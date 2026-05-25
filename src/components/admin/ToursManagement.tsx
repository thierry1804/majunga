import React, { useState, useEffect } from 'react'
import {
  getTours,
  createTour,
  updateTour,
  deleteTour,
  patchTour,
  ApiTour,
  uploadImage,
  deleteImage,
  getImageUrl
} from '../../api/madabookingApi'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, X, Image as ImageIcon, Upload } from 'lucide-react'

interface Tour {
  id: string
  title: string
  description: string
  price: number
  duration: string
  highlights: string[]
  image_url: string | null
  image_urls?: string[] // Support pour plusieurs images
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ImageItem {
  url: string
  filename: string
  isNew?: boolean // Pour distinguer les nouvelles images des existantes
  file?: File // Fichier à uploader (seulement pour les nouvelles images)
}

export default function ToursManagement() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTour, setEditingTour] = useState<Tour | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    highlights: '',
    image_url: '',
    is_active: true
  })
  const [images, setImages] = useState<ImageItem[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchTours()

    // Écouter les événements d'expiration de token
    const handleTokenExpired = (event: CustomEvent) => {
      alert(event.detail?.message || 'Votre session a expiré. Veuillez vous reconnecter.')
      setTimeout(() => {
        window.location.href = '/admin'
      }, 2000)
    }

    window.addEventListener('auth:token-expired', handleTokenExpired as EventListener)

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired as EventListener)
    }
  }, [])

  const fetchTours = async () => {
    try {
      const apiTours = await getTours()
      console.log('Tours récupérés depuis l\'API:', apiTours)
      // Convertir ApiTour vers le format interne
      const convertedTours = apiTours.map(tour => {
        // Utiliser imageUrls (nouveau format) ou imageUrl (ancien format) pour compatibilité
        const imageFilenames = tour.imageUrls
          ? (Array.isArray(tour.imageUrls) ? tour.imageUrls : [tour.imageUrls])
          : (Array.isArray(tour.imageUrl)
            ? tour.imageUrl
            : tour.imageUrl
              ? [tour.imageUrl]
              : [])

        // Construire l'URL de l'image principale en utilisant l'endpoint GET /api/images/{filename}
        let mainImageUrl: string | null = null
        if (imageFilenames.length > 0) {
          const firstFilename = imageFilenames[0]
          // Si c'est déjà une URL complète, utiliser directement
          if (firstFilename.includes('/api/images/') || firstFilename.startsWith('http')) {
            mainImageUrl = firstFilename
          } else {
            // C'est un filename, construire l'URL avec l'endpoint GET
            mainImageUrl = getImageUrl(firstFilename)
          }
        }

        // Construire les URLs pour toutes les images
        const constructedImageUrls = imageFilenames.map(filename => {
          // Si c'est déjà une URL complète, utiliser directement
          if (filename.includes('/api/images/') || filename.startsWith('http')) {
            return filename
          } else {
            // C'est un filename, construire l'URL avec l'endpoint GET
            return getImageUrl(filename)
          }
        })

        return {
          id: tour.id || extractIdFromIri(tour['@id']) || '',
          title: tour.title,
          description: tour.description,
          price: parseFloat(tour.price) || 0,
          duration: tour.duration,
          highlights: tour.highlights || [],
          image_url: mainImageUrl,
          image_urls: constructedImageUrls,
          is_active: tour.isActive !== false,
          created_at: tour.createdAt || '',
          updated_at: tour.updatedAt || ''
        }
      })
      console.log('Tours convertis:', convertedTours)
      setTours(convertedTours)
    } catch (error) {
      console.error('Erreur lors du chargement des tours:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper pour extraire l'ID depuis un IRI
  const extractIdFromIri = (iri?: string): string => {
    if (!iri) return ''
    const parts = iri.split('/')
    return parts[parts.length - 1] || ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (uploading) return

    try {
      setUploading(true)

      console.log('Début de la soumission, images à traiter:', images)

      // Uploader toutes les nouvelles images
      const uploadedImages: string[] = []
      for (const image of images) {
        console.log('Traitement de l\'image:', image)
        if (image.isNew && image.file) {
          try {
            // Vérifier que le fichier est valide
            if (!image.file || image.file.size === 0) {
              console.warn('Fichier invalide ignoré:', image.filename)
              continue
            }

            // Vérifier que le fichier est bien un objet File
            if (!(image.file instanceof File)) {
              console.error('Le fichier n\'est pas un objet File valide:', image.file)
              continue
            }

            console.log('Upload du fichier:', image.file.name, image.file.size, image.file.type)

            // Uploader le fichier
            const uploadResult = await uploadImage(image.file)
            console.log('=== DEBUG UPLOAD ===')
            console.log('Réponse complète de uploadImage:', uploadResult)
            console.log('uploadResult.filename:', uploadResult.filename)
            console.log('uploadResult.url:', uploadResult.url)

            // Stocker le filename pour l'envoyer à l'API (l'API stocke les filenames)
            // Extraire le filename de l'URL retournée
            let filename = uploadResult.filename
            if (!filename || filename === '') {
              // Si pas de filename, extraire de l'URL
              const urlParts = uploadResult.url.split('/')
              filename = urlParts[urlParts.length - 1] || ''
              filename = filename.split('?')[0] // Enlever les paramètres de query
              console.log('Filename extrait de l\'URL:', filename)
            }
            // S'assurer qu'on a un filename valide
            if (filename && filename !== '') {
              uploadedImages.push(filename)
              console.log('✅ Image uploadée, filename ajouté:', filename)
              console.log('uploadedImages maintenant:', uploadedImages)
            } else {
              console.error('❌ Impossible d\'extraire le filename de:', uploadResult)
              throw new Error(`Impossible d'extraire le filename de la réponse d'upload: ${JSON.stringify(uploadResult)}`)
            }
          } catch (error: any) {
            console.error('Erreur lors de l\'upload de l\'image:', error)
            // Si l'endpoint n'existe pas encore, afficher un message d'erreur clair
            if (error?.status === 404 || error?.message?.includes('404')) {
              alert('L\'endpoint d\'upload d\'images n\'est pas encore disponible. Veuillez utiliser des URLs d\'images externes pour l\'instant.')
              throw new Error('Endpoint d\'upload non disponible. Utilisez des URLs d\'images externes.')
            }
            throw error
          }
        } else if (!image.isNew) {
          // Image déjà sur le serveur, extraire le filename de l'URL
          const urlParts = image.url.split('/')
          let filename = urlParts[urlParts.length - 1] || ''
          filename = filename.split('?')[0] // Enlever les paramètres de query
          if (filename) {
            uploadedImages.push(filename)
          }
        }
      }

      // Envoyer toutes les images uploadées comme un tableau (toujours un tableau, même pour une seule image)
      // uploadedImages est déjà un tableau, mais on s'assure qu'il est bien défini
      const imageUrlsArray: string[] = uploadedImages || []

      console.log('=== DEBUG AVANT ENVOI ===')
      console.log('Nombre d\'images uploadées:', imageUrlsArray.length)
      console.log('Images uploadées (filenames):', imageUrlsArray)

      if (imageUrlsArray.length === 0) {
        console.warn('⚠️ ATTENTION: Aucune image à envoyer ! uploadedImages est vide.')
      }

      // Créer l'objet tourData avec tous les champs, y compris imageUrls
      const tourData: any = {
        title: formData.title,
        description: formData.description,
        price: String(parseFloat(formData.price)),
        duration: formData.duration,
        highlights: formData.highlights.split('\n').filter(h => h.trim()),
        isActive: formData.is_active
      }

      // Toujours ajouter imageUrls comme un tableau (même vide)
      tourData.imageUrls = imageUrlsArray

      console.log('=== DONNÉES À ENVOYER À L\'API ===')
      console.log('tourData complet:', JSON.stringify(tourData, null, 2))
      console.log('imageUrls dans tourData:', tourData.imageUrls)
      console.log('Type de imageUrls:', typeof tourData.imageUrls, Array.isArray(tourData.imageUrls))
      console.log('Longueur de imageUrls:', tourData.imageUrls?.length)

      if (editingTour) {
        await updateTour(editingTour.id, tourData)
      } else {
        await createTour(tourData)
      }

      await fetchTours()
      resetForm()
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)

      // Si le token a expiré, afficher un message spécial
      if (error?.isTokenExpired || error?.status === 401) {
        alert('Votre session a expiré. Veuillez vous reconnecter.')
        // Rediriger vers la page de connexion après un court délai
        setTimeout(() => {
          window.location.href = '/admin'
        }, 2000)
      } else {
        alert('Erreur lors de la sauvegarde: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
      }
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour)
    setFormData({
      title: tour.title,
      description: tour.description,
      price: tour.price.toString(),
      duration: tour.duration,
      highlights: tour.highlights.join('\n'),
      image_url: tour.image_url || '',
      is_active: tour.is_active
    })

    // Initialiser les images existantes
    const existingImages: ImageItem[] = []
    if (tour.image_urls && tour.image_urls.length > 0) {
      tour.image_urls.forEach(url => {
        // Extraire le filename de l'URL
        const urlParts = url.split('/')
        let filename = urlParts[urlParts.length - 1] || ''
        // Enlever les paramètres de query si présents
        filename = filename.split('?')[0]

        // Si l'URL contient déjà /api/images/, utiliser directement
        // Sinon, reconstruire l'URL avec l'endpoint GET /api/images/{filename}
        let imageUrl = url
        if (filename && !url.includes('/api/images/')) {
          // Construire l'URL avec l'endpoint GET /api/images/{filename}
          imageUrl = getImageUrl(filename)
        }

        // Si pas de filename, utiliser une valeur par défaut
        if (!filename || filename === '') {
          filename = `image-${existingImages.length + 1}`
        }

        existingImages.push({
          url: imageUrl,
          filename,
          isNew: false
        })
      })
    } else if (tour.image_url) {
      const urlParts = tour.image_url.split('/')
      let filename = urlParts[urlParts.length - 1] || ''
      filename = filename.split('?')[0]

      // Construire l'URL avec l'endpoint GET /api/images/{filename} si nécessaire
      let imageUrl = tour.image_url
      if (filename && !tour.image_url.includes('/api/images/')) {
        imageUrl = getImageUrl(filename)
      }

      if (!filename || filename === '') {
        filename = 'image-1'
      }

      existingImages.push({
        url: imageUrl,
        filename,
        isNew: false
      })
    }
    setImages(existingImages)

    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tour ?')) return

    try {
      await deleteTour(id)
      await fetchTours()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const toggleActive = async (tour: Tour) => {
    try {
      await patchTour(tour.id, { isActive: !tour.is_active })
      await fetchTours()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const resetForm = () => {
    // Libérer les URLs blob avant de réinitialiser
    images.forEach(image => {
      if (image.isNew && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url)
      }
    })

    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      highlights: '',
      image_url: '',
      is_active: true
    })
    setImages([])
    setEditingTour(null)
    setShowModal(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Créer des objets ImageItem avec des URLs blob pour prévisualisation
    const newImages: ImageItem[] = Array.from(files).map((file) => {
      const blobUrl = URL.createObjectURL(file)
      return {
        url: blobUrl,
        filename: file.name,
        isNew: true,
        file: file
      }
    })

    setImages(prev => [...prev, ...newImages])

    // Réinitialiser l'input file
    e.target.value = ''
  }

  const handleImageDelete = async (index: number) => {
    const imageToDelete = images[index]

    // Si c'est une nouvelle image (blob), libérer l'URL blob
    if (imageToDelete.isNew && imageToDelete.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete.url)
      // Retirer l'image de la liste (pas besoin de supprimer sur le serveur)
      setImages(prev => prev.filter((_, i) => i !== index))
      return
    }

    // Supprimer l'image du serveur si elle n'est pas nouvelle (déjà sur le serveur)
    if (!imageToDelete.isNew) {
      try {
        // Extraire le filename depuis l'URL si nécessaire
        let filename = imageToDelete.filename
        if (!filename || filename === '') {
          // Extraire depuis l'URL
          const urlParts = imageToDelete.url.split('/')
          filename = urlParts[urlParts.length - 1] || ''
          filename = filename.split('?')[0] // Enlever les paramètres de query
        }

        if (filename) {
          await deleteImage(filename)
        }
      } catch (error: any) {
        console.error('Erreur lors de la suppression de l\'image:', error)

        // Si le token a expiré, afficher un message spécial
        if (error?.isTokenExpired || error?.status === 401) {
          alert('Votre session a expiré. Veuillez vous reconnecter.')
          setTimeout(() => {
            window.location.href = '/admin'
          }, 2000)
        } else {
          alert('Erreur lors de la suppression de l\'image: ' + (error instanceof Error ? error.message : 'Erreur inconnue'))
        }
        return
      }
    }

    // Retirer l'image de la liste
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const filteredTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Tours</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos offres de tours et excursions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau tour
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher un tour..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            {tour.image_url && (
              <div className="h-48 bg-gray-200">
                <img
                  src={tour.image_url}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Si l'image ne charge pas, afficher un placeholder
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="18"%3EImage non disponible%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900 truncate pr-2">{tour.title}</h3>
                <button
                  onClick={() => toggleActive(tour)}
                  className={`p-1 rounded-full flex-shrink-0 ${
                    tour.is_active 
                      ? 'text-green-600 hover:bg-green-100' 
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {tour.is_active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {tour.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(tour.price)}
                  </p>
                  <p className="text-sm text-gray-500">{tour.duration}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(tour)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {tour.highlights.slice(0, 3).map((highlight, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {highlight}
                  </span>
                ))}
                {tour.highlights.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{tour.highlights.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun tour trouvé</p>
        </div>
      )}

      {/* Offcanvas */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 transition-opacity"
            onClick={resetForm}
          />

          {/* Offcanvas Panel */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header - Fixed */}
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0 bg-white">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTour ? 'Modifier le tour' : 'Nouveau tour'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-grow p-6">
              <form id="tour-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Durée
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="ex: 1 jour, 2 jours"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Points forts (un par ligne)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="Observation des baleines&#10;Plage paradisiaque&#10;Déjeuner traditionnel"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>

                  {/* Input file pour upload */}
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Télécharger des images</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">ou glissez-déposez</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF jusqu'à 10MB
                      </p>
                    </div>
                  </div>

                  {/* Liste des images uploadées */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={image.url}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Si l'image ne charge pas, afficher un placeholder
                                const target = e.target as HTMLImageElement
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E'
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleImageDelete(index)}
                            disabled={uploading}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            title="Supprimer l'image"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {uploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Tour actif
                  </label>
                </div>
              </form>
            </div>

            {/* Footer - Fixed */}
            <div className="border-t p-6 bg-gray-50 flex justify-end space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                form="tour-form"
                disabled={uploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Enregistrement...' : (editingTour ? 'Mettre à jour' : 'Créer')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
