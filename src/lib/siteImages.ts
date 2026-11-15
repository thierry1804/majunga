/** Emplacements de photos du site, gérés depuis le back-office (Paramètres > Photos du site). */
export const SITE_IMAGE_SLOTS = [
  {
    key: 'hero_image',
    label: 'Photo principale (accueil)',
    hint: "Grande photo derrière le titre de la page d'accueil. Format paysage, au moins 1920 px de large.",
    description: "Photo d'accueil (hero), nom du fichier téléversé",
  },
  {
    key: 'about_image_main',
    label: 'À propos, grande photo',
    hint: 'Photo principale de la section « À propos ». Format portrait ou carré, au moins 800 px.',
    description: "Photo principale de la section À propos, nom du fichier téléversé",
  },
  {
    key: 'about_image_secondary',
    label: 'À propos, petite photo',
    hint: 'Photo secondaire de la section « À propos ». Au moins 600 px.',
    description: "Photo secondaire de la section À propos, nom du fichier téléversé",
  },
] as const;

export type SiteImageKey = (typeof SITE_IMAGE_SLOTS)[number]['key'];
