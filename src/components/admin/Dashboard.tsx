import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  Users, 
  MapPin, 
  Calendar, 
  Bus, 
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react'

interface DashboardStats {
  totalTours: number
  totalBookings: number
  totalRevenue: number
  totalShuttles: number
  activeTours: number
  pendingBookings: number
  confirmedBookings: number
  recentBookings: any[]
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalShuttles: 0,
    activeTours: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    recentBookings: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Récupérer les statistiques des tours
      const { data: tours, error: toursError } = await supabase
        .from('tours')
        .select('*')

      if (toursError) {
        console.error('Erreur lors du chargement des tours:', toursError)
      }

      // Récupérer les statistiques des réservations
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')

      if (bookingsError) {
        console.error('Erreur lors du chargement des réservations:', bookingsError)
      }

      // Récupérer les statistiques des navettes
      const { data: shuttles, error: shuttlesError } = await supabase
        .from('shuttle_schedules')
        .select('*')

      if (shuttlesError) {
        console.error('Erreur lors du chargement des navettes:', shuttlesError)
      }

      // Récupérer les réservations récentes (sans jointure pour éviter les erreurs)
      const { data: recentBookings, error: recentBookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentBookingsError) {
        console.error('Erreur lors du chargement des réservations récentes:', recentBookingsError)
      }

      // Calculer les statistiques avec des valeurs par défaut
      const totalRevenue = (bookings || []).reduce((sum, booking) => sum + booking.total_price, 0)
      const pendingBookings = (bookings || []).filter(b => b.status === 'pending').length
      const confirmedBookings = (bookings || []).filter(b => b.status === 'confirmed').length
      const activeTours = (tours || []).filter(t => t.is_active).length

      setStats({
        totalTours: (tours || []).length,
        totalBookings: (bookings || []).length,
        totalRevenue,
        totalShuttles: (shuttles || []).length,
        activeTours,
        pendingBookings,
        confirmedBookings,
        recentBookings: recentBookings || []
      })
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      // Définir des statistiques par défaut en cas d'erreur
      setStats({
        totalTours: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalShuttles: 0,
        activeTours: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        recentBookings: []
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de votre activité MadaBooking
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tours actifs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activeTours} / {stats.totalTours}
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
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Réservations
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalBookings}
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
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chiffre d'affaires
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
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
                <Bus className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Navettes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalShuttles}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statut des réservations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">En attente</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.pendingBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">Confirmées</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{stats.confirmedBookings}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <a
                href="/admin/tours"
                className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Gérer les tours
              </a>
              <a
                href="/admin/bookings"
                className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Voir les réservations
              </a>
              <a
                href="/admin/shuttles"
                className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Gérer les navettes
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Réservations récentes</h3>
          {stats.recentBookings.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Tour ID: {booking.tour_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.user_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.booking_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.participants}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmée' : 
                           booking.status === 'pending' ? 'En attente' : 'Annulée'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucune réservation récente</p>
          )}
        </div>
      </div>
    </div>
  )
}
