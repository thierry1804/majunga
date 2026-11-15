import { useEffect, useState } from 'react';
import { getImageUrl, getPublicSiteSettings } from '../api/madabookingApi';
import { SITE_IMAGE_SLOTS, type SiteImageKey } from '../lib/siteImages';

export type SiteImages = Partial<Record<SiteImageKey, string>>;

// Une seule requête partagée par toutes les sections de la page.
let cache: Promise<SiteImages> | null = null;

function loadSiteImages(): Promise<SiteImages> {
  if (!cache) {
    cache = getPublicSiteSettings()
      .then((settings) => {
        const images: SiteImages = {};
        for (const slot of SITE_IMAGE_SLOTS) {
          const value = settings.find((s) => s.key === slot.key)?.value?.trim();
          if (value) {
            images[slot.key] = /^https?:\/\//.test(value) ? value : getImageUrl(value);
          }
        }
        return images;
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des photos du site:', error);
        cache = null; // permet de réessayer au prochain rendu
        return {};
      });
  }
  return cache;
}

/** URLs des photos gérées depuis le back-office. `loading` reste vrai tant que la réponse n'est pas arrivée. */
export function useSiteImages(): { images: SiteImages; loading: boolean } {
  const [images, setImages] = useState<SiteImages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadSiteImages().then((result) => {
      if (active) {
        setImages(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { images, loading };
}
