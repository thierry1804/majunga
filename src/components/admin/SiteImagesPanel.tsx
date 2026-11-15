import { useRef, useState } from 'react';
import { ImagePlus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ApiSiteSetting, deleteImage, getImageUrl, uploadImage } from '../../api/madabookingApi';
import { SITE_IMAGE_SLOTS, type SiteImageKey } from '../../lib/siteImages';

const MAX_SIZE = 10 * 1024 * 1024; // limite de l'API : 10 Mo
const ACCEPTED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

interface SiteImagesPanelProps {
  getSetting: (key: string) => ApiSiteSetting | undefined;
  createSetting: (
    setting: Omit<ApiSiteSetting, 'id' | '@id' | '@type' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateSettingByKey: (key: string, value: string) => Promise<void>;
}

const toUrl = (value: string) => (/^https?:\/\//.test(value) ? value : getImageUrl(value));

/** Photos affichées sur le site public : téléversement, remplacement et retrait. */
export default function SiteImagesPanel({ getSetting, createSetting, updateSettingByKey }: SiteImagesPanelProps) {
  const [busy, setBusy] = useState<SiteImageKey | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputs = useRef<Partial<Record<SiteImageKey, HTMLInputElement | null>>>({});

  const save = async (key: SiteImageKey, description: string, value: string) => {
    if (getSetting(key)) {
      await updateSettingByKey(key, value);
    } else {
      await createSetting({ key, value, valueType: 'string', description, category: 'media', isPublic: true });
    }
  };

  const removeFile = async (filename: string) => {
    // Nettoyage du fichier remplacé : sans conséquence si le serveur refuse
    if (!filename || /^https?:\/\//.test(filename)) return;
    try {
      await deleteImage(filename);
    } catch (err) {
      console.warn('Ancienne photo non supprimée:', err);
    }
  };

  const handleFile = async (slot: (typeof SITE_IMAGE_SLOTS)[number], file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setMessage({ type: 'error', text: 'Le fichier doit être une image (JPEG, PNG, GIF, WebP ou BMP).' });
      return;
    }
    if (file.size > MAX_SIZE) {
      setMessage({ type: 'error', text: 'Le fichier est trop volumineux (maximum 10 Mo).' });
      return;
    }

    const previous = getSetting(slot.key)?.value ?? '';
    setBusy(slot.key);
    setMessage(null);
    try {
      const { filename } = await uploadImage(file);
      await save(slot.key, slot.description, filename);
      await removeFile(previous);
      setMessage({ type: 'success', text: `« ${slot.label} » mise à jour. Elle apparaît sur le site à l'ouverture de la page.` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : "Échec du téléversement de la photo." });
    } finally {
      setBusy(null);
      const input = inputs.current[slot.key];
      if (input) input.value = '';
    }
  };

  const handleRemove = async (slot: (typeof SITE_IMAGE_SLOTS)[number]) => {
    const previous = getSetting(slot.key)?.value ?? '';
    setBusy(slot.key);
    setMessage(null);
    try {
      await save(slot.key, slot.description, '');
      await removeFile(previous);
      setMessage({ type: 'success', text: `« ${slot.label} » retirée. Le site affiche l'illustration par défaut.` });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Échec du retrait de la photo.' });
    } finally {
      setBusy(null);
    }
  };

  return (
    <section aria-labelledby="site-images-title" className="bg-white rounded-lg shadow-sm border border-sand-200">
      <div className="px-6 py-4 border-b border-sand-200">
        <h2 id="site-images-title" className="text-xl font-semibold text-ink">
          Photos du site
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Sans photo, le site affiche une illustration par défaut. JPEG, PNG, WebP : 10 Mo maximum, converties
          automatiquement en WebP.
        </p>
      </div>

      {message && (
        <div
          role="status"
          className={`mx-6 mt-4 p-3 rounded-lg flex items-center text-sm ${
            message.type === 'success'
              ? 'bg-ocean-50 border border-ocean-200 text-ocean-800'
              : 'bg-terracotta-50 border border-terracotta-100 text-terracotta-600'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 mr-2 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {SITE_IMAGE_SLOTS.map((slot) => {
          const value = getSetting(slot.key)?.value?.trim() ?? '';
          const isBusy = busy === slot.key;
          const inputId = `site-image-${slot.key}`;
          return (
            <div key={slot.key}>
              <p className="text-sm font-medium text-ink mb-2">{slot.label}</p>
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-sand-300 bg-sand-100 flex items-center justify-center">
                {value ? (
                  <img src={toUrl(value)} alt={slot.label} className="w-full h-full object-cover" />
                ) : (
                  <p className="text-xs text-ink-light px-4 text-center">Aucune photo : illustration par défaut</p>
                )}
              </div>
              <p className="mt-2 text-xs text-ink-light">{slot.hint}</p>

              <div className="relative mt-3 flex flex-wrap gap-2">
                <input
                  id={inputId}
                  ref={(el) => {
                    inputs.current[slot.key] = el;
                  }}
                  type="file"
                  accept={ACCEPTED.join(',')}
                  className="sr-only peer"
                  disabled={isBusy}
                  onChange={(e) => handleFile(slot, e.target.files?.[0])}
                />
                <label
                  htmlFor={inputId}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-ocean-600 text-white hover:bg-ocean-700 transition-colors cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-ocean-500 peer-focus-visible:ring-offset-2 ${
                    isBusy ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  <ImagePlus className="h-4 w-4 mr-2" aria-hidden="true" />
                  {isBusy ? 'Envoi en cours…' : value ? 'Remplacer' : 'Choisir une photo'}
                </label>
                {value && (
                  <button
                    type="button"
                    onClick={() => handleRemove(slot)}
                    disabled={isBusy}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-sand-300 text-ink-muted hover:bg-sand-100 transition-colors disabled:opacity-60"
                  >
                    <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Retirer
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
