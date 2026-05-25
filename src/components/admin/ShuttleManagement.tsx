import React, { useState, useEffect } from 'react'
import {
  getShuttleSchedules,
  createShuttleSchedule,
  updateShuttleSchedule,
  deleteShuttleSchedule,
  patchShuttleSchedule,
  ApiShuttleSchedule
} from '../../api/madabookingApi'
import { Plus, Edit, Trash2, Eye, EyeOff, Clock, MapPin, Bus, X } from 'lucide-react'

interface ShuttleSchedule {
  id: string
  departure_time: string
  arrival_time: string
  route: string
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ShuttleManagement() {
  const [schedules, setSchedules] = useState<ShuttleSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ShuttleSchedule | null>(null)
  const [formData, setFormData] = useState({
    departure_time: '',
    arrival_time: '',
    route: '',
    price: '',
    is_active: true
  })

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const apiSchedules = await getShuttleSchedules()
      // Convertir ApiShuttleSchedule vers le format interne
      const convertedSchedules = apiSchedules.map(schedule => ({
        id: schedule.id || extractIdFromIri(schedule['@id']) || '',
        departure_time: schedule.departureTime,
        arrival_time: schedule.arrivalTime,
        route: schedule.route,
        price: parseFloat(schedule.price) || 0,
        is_active: schedule.isActive !== false,
        created_at: schedule.createdAt || '',
        updated_at: schedule.updatedAt || ''
      }))
      setSchedules(convertedSchedules)
    } catch (error) {
      console.error('Erreur lors du chargement des horaires:', error)
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
    
    try {
      const scheduleData = {
        departureTime: formData.departure_time,
        arrivalTime: formData.arrival_time,
        route: formData.route,
        price: String(parseFloat(formData.price)),
        isActive: formData.is_active
      }

      if (editingSchedule) {
        await updateShuttleSchedule(editingSchedule.id, scheduleData)
      } else {
        await createShuttleSchedule(scheduleData)
      }

      await fetchSchedules()
      resetForm()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleEdit = (schedule: ShuttleSchedule) => {
    setEditingSchedule(schedule)
    setFormData({
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      route: schedule.route,
      price: schedule.price.toString(),
      is_active: schedule.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) return

    try {
      await deleteShuttleSchedule(id)
      await fetchSchedules()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const toggleActive = async (schedule: ShuttleSchedule) => {
    try {
      await patchShuttleSchedule(schedule.id, { isActive: !schedule.is_active })
      await fetchSchedules()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      departure_time: '',
      arrival_time: '',
      route: '',
      price: '',
      is_active: true
    })
    setEditingSchedule(null)
    setShowModal(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDuration = (departure: string, arrival: string) => {
    const dep = new Date(`2000-01-01T${departure}`)
    const arr = new Date(`2000-01-01T${arrival}`)
    const diff = arr.getTime() - dep.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h${minutes > 0 ? minutes.toString().padStart(2, '0') : ''}`
  }

  const activeSchedules = schedules.filter(s => s.is_active)
  const inactiveSchedules = schedules.filter(s => !s.is_active)

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Navettes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les horaires et tarifs des navettes
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel horaire
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total horaires
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {schedules.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Horaires actifs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeSchedules.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EyeOff className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Horaires inactifs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {inactiveSchedules.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Schedules */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Horaires actifs ({activeSchedules.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {activeSchedules.map((schedule) => (
            <li key={schedule.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatTime(schedule.departure_time)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {schedule.route}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Arrivée: {formatTime(schedule.arrival_time)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Durée: {getDuration(schedule.departure_time, schedule.arrival_time)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">
                            {formatCurrency(schedule.price)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleActive(schedule)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="Désactiver"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Inactive Schedules */}
      {inactiveSchedules.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Horaires inactifs ({inactiveSchedules.length})
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {inactiveSchedules.map((schedule) => (
              <li key={schedule.id} className="bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-500">
                              {formatTime(schedule.departure_time)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {schedule.route}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Arrivée: {formatTime(schedule.arrival_time)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-400">
                              {formatCurrency(schedule.price)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleActive(schedule)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full"
                              title="Activer"
                            >
                              <EyeOff className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <Bus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun horaire</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer un nouvel horaire de navette.
          </p>
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
                {editingSchedule ? 'Modifier l\'horaire' : 'Nouvel horaire'}
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
              <form id="shuttle-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Itinéraire
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    placeholder="ex: Majunga - Antananarivo"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Heure de départ
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.departure_time}
                      onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Heure d'arrivée
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.arrival_time}
                      onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Horaire actif
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
                form="shuttle-form"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingSchedule ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
