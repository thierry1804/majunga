import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { Save, Plus, Trash2, Edit, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ApiSiteSetting } from '../../api/madabookingApi';

// Paramètres essentiels prédéfinis
const ESSENTIAL_SETTINGS = [
  {
    key: 'maintenance_mode',
    valueType: 'boolean',
    description: 'Active ou désactive le mode maintenance du site',
    category: 'system',
    isPublic: true,
    defaultValue: 'false',
  },
  {
    key: 'maintenance_message',
    valueType: 'string',
    description: 'Message affiché aux utilisateurs en mode maintenance',
    category: 'system',
    isPublic: true,
    defaultValue: 'Le site est actuellement en maintenance. Nous serons de retour très bientôt.',
  },
  {
    key: 'site_name',
    valueType: 'string',
    description: 'Nom du site',
    category: 'general',
    isPublic: true,
    defaultValue: 'MadaBooking',
  },
  {
    key: 'site_email',
    valueType: 'string',
    description: 'Email de contact du site',
    category: 'general',
    isPublic: true,
    defaultValue: 'contact@madabooking.mg',
  },
  {
    key: 'site_phone',
    valueType: 'string',
    description: 'Numéro de téléphone de contact',
    category: 'general',
    isPublic: true,
    defaultValue: '',
  },
  {
    key: 'site_address',
    valueType: 'string',
    description: 'Adresse du site',
    category: 'general',
    isPublic: true,
    defaultValue: '',
  },
  {
    key: 'booking_enabled',
    valueType: 'boolean',
    description: 'Active ou désactive les réservations',
    category: 'booking',
    isPublic: true,
    defaultValue: 'true',
  },
  {
    key: 'max_booking_participants',
    valueType: 'number',
    description: 'Nombre maximum de participants par réservation',
    category: 'booking',
    isPublic: false,
    defaultValue: '20',
  },
  {
    key: 'currency',
    valueType: 'string',
    description: 'Devise utilisée (EUR, USD, MGA, etc.)',
    category: 'general',
    isPublic: true,
    defaultValue: 'EUR',
  },
  {
    key: 'timezone',
    valueType: 'string',
    description: 'Fuseau horaire du site',
    category: 'general',
    isPublic: false,
    defaultValue: 'Indian/Antananarivo',
  },
];

export default function SettingsManagement() {
  const {
    settings,
    loading,
    error,
    refresh,
    getSetting,
    updateSettingByKey,
    createSetting,
    removeSetting,
  } = useSiteSettings();

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    valueType: 'string',
    description: '',
    category: 'general',
    isPublic: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Créer les paramètres essentiels s'ils n'existent pas
    const initializeEssentialSettings = async () => {
      if (loading || settings.length === 0) return;

      for (const essential of ESSENTIAL_SETTINGS) {
        const existing = getSetting(essential.key);
        if (!existing) {
          try {
            await createSetting({
              key: essential.key,
              value: essential.defaultValue,
              valueType: essential.valueType,
              description: essential.description,
              category: essential.category,
              isPublic: essential.isPublic,
            });
          } catch (err) {
            console.error(`Erreur lors de la création du paramètre ${essential.key}:`, err);
          }
        }
      }
      await refresh();
    };

    initializeEssentialSettings();
  }, [loading, settings, getSetting, createSetting, refresh]);

  const handleEdit = (key: string) => {
    const setting = getSetting(key);
    if (setting) {
      setEditingKey(key);
      setEditingValue(setting.value || '');
    }
  };

  const handleSave = async (key: string) => {
    try {
      setSaving(true);
      setMessage(null);
      await updateSettingByKey(key, editingValue);
      setEditingKey(null);
      setEditingValue('');
      setMessage({ type: 'success', text: 'Paramètre mis à jour avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du paramètre' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingValue('');
  };

  const handleAdd = async () => {
    try {
      setSaving(true);
      setMessage(null);
      await createSetting(newSetting);
      setShowAddModal(false);
      setNewSetting({
        key: '',
        value: '',
        valueType: 'string',
        description: '',
        category: 'general',
        isPublic: false,
      });
      setMessage({ type: 'success', text: 'Paramètre créé avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la création du paramètre' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, key: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le paramètre "${key}" ?`)) {
      return;
    }

    try {
      await removeSetting(id);
      setMessage({ type: 'success', text: 'Paramètre supprimé avec succès' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du paramètre' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const renderValueInput = (setting: ApiSiteSetting, value: string, onChange: (value: string) => void) => {
    switch (setting.valueType) {
      case 'boolean':
        return (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );
      case 'json':
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
            placeholder='{"key": "value"}'
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        );
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, ApiSiteSetting[]>);

  const categories = ['system', 'general', 'booking', 'email', 'other'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">Erreur: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres du site</h1>
          <p className="mt-2 text-gray-600">Gérez les paramètres de configuration du site</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un paramètre
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {Object.keys(groupedSettings).length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Aucun paramètre configuré</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const categorySettings = groupedSettings[category] || [];
            if (categorySettings.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {category === 'system' ? 'Système' : category === 'general' ? 'Général' : category === 'booking' ? 'Réservations' : category}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {categorySettings.map((setting) => (
                    <div key={setting.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-900">{setting.key}</h3>
                            {setting.isPublic && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Public
                              </span>
                            )}
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                              {setting.valueType}
                            </span>
                          </div>
                          {setting.description && (
                            <p className="mt-1 text-sm text-gray-600">{setting.description}</p>
                          )}
                          <div className="mt-3">
                            {editingKey === setting.key ? (
                              <div className="space-y-3">
                                {renderValueInput(setting, editingValue, setEditingValue)}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSave(setting.key)}
                                    disabled={saving}
                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Enregistrer
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="inline-flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <p className="text-sm text-gray-500">Valeur actuelle:</p>
                                  <p className="mt-1 text-gray-900 font-mono text-sm break-all">
                                    {setting.value || '(vide)'}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(setting.key)}
                                    className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </button>
                                  {!ESSENTIAL_SETTINGS.find((s) => s.key === setting.key) && (
                                    <button
                                      onClick={() => handleDelete(setting.id!, setting.key)}
                                      className="inline-flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Supprimer
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Ajouter un paramètre</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clé (unique) *
                </label>
                <input
                  type="text"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="ex: site_name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de valeur *
                </label>
                <select
                  value={newSetting.valueType}
                  onChange={(e) => setNewSetting({ ...newSetting, valueType: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="string">String</option>
                  <option value="boolean">Boolean</option>
                  <option value="number">Number</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valeur *
                </label>
                {renderValueInput(
                  { valueType: newSetting.valueType } as ApiSiteSetting,
                  newSetting.value,
                  (value) => setNewSetting({ ...newSetting, value })
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSetting.description}
                  onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Description du paramètre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={newSetting.category}
                  onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="general">Général</option>
                  <option value="system">Système</option>
                  <option value="booking">Réservations</option>
                  <option value="email">Email</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newSetting.isPublic}
                  onChange={(e) => setNewSetting({ ...newSetting, isPublic: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  Paramètre public (accessible sans authentification)
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !newSetting.key || !newSetting.value}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

