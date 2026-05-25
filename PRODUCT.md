# Product

## Register

brand

## Users

**Voyageurs (priorité égale).** Deux profils partagent la landing publique :

1. **Planificateurs internationaux** — Européens, diaspora malgache, voyageurs qui réservent circuits et navette aéroport avant d'arriver à Majunga. Contexte : mobile ou laptop, comparaison rapide, besoin de confiance avant de payer ou de confirmer.
2. **Voyageurs déjà sur place** — Week-endistes, expats, visiteurs business dans le nord-ouest. Contexte : mobile en extérieur (luminosité forte), décision rapide, navette ou excursion du jour.

**Équipe locale (secondaire sur la landing).** Admins et éditeurs gèrent tours, réservations et navettes via le back-office. Le register par défaut reste *brand* : la landing est la vitrine et le moteur de conversion.

## Product Purpose

Mada Booking est la porte d'entrée en ligne vers Majunga (Mahajanga) : circuits guidés par des locaux et navette aéroport fiable. Le site existe pour transformer l'intention de visite en **réservation confirmée** (circuit ou navette) avec un minimum de friction.

**Succès =** un visiteur comprend l'offre, a confiance dans l'équipe locale, et finalise une réservation en ligne sans abandon ni aller-retour inutile.

**Hors scope de la landing :** remplacer l'humain (guides, accueil WhatsApp/téléphone restent complémentaires), rivaliser sur le volume avec les agrégateurs internationaux.

## Brand Personality

**Trois mots :** authentique, accueillant, ancré.

Voix de **guide local de confiance**, pas d'agence resort ni de plateforme tech. Chaleureux sans être familier ; concret sans jargon ; fier de Majunga sans posture luxury.

**Émotions visées :** confiance (équipe née ici, depuis 2015), accueil (on sait où vous allez), sérénité (réservation simple, navette fiable).

**Ton rédactionnel :** direct, humain, ancré dans le lieu (baobabs, côte, culture malgache). i18n FR / EN / IT ; le français est la langue de repli.

## Anti-references

- **Dashboards SaaS / startup tourisme** : glassmorphism, dégradés décoratifs, cartes KPI, sidebars flottantes, badges « Live », hero-metrics.
- **Templates IA tourisme** : blue-orange corporate, grilles de cartes identiques (icône + titre + texte), pill badges, parallax blobs, copy générique (« discover hidden gems »).
- **Resort / all-inclusive** : esthétique hôtel 5 étoiles, pricing opaque, urgence artificielle.
- **Plateformes agrégatrices** : interface marketplace froide (Booking.com, TUI) où le lieu disparaît derrière l'UI.

Le système visuel « Coastal Gazette » (voir DESIGN.md) sert cette personnalité : gazette locale, pas moteur de réservation corporate.

## Design Principles

1. **Ancrage local d'abord.** Chaque écran public doit sentir Majunga : guides natifs, détails concrets, photos et copy du territoire. La marque est le lieu, pas la tech.
2. **Confiance avant conversion.** Montrer qui guide, depuis quand, pourquoi faire confiance — puis proposer réserver. Pas l'inverse.
3. **Réservation sans friction.** Chemins courts vers circuit ou navette ; formulaire clair ; statuts et prix lisibles. Chaque clic inutile est un échec.
4. **Montrer le voyage, pas la plateforme.** Le contenu éditorial mène ; l'UI reste discrète. Pas de chrome qui rivalise avec les circuits ou la côte.
5. **Pensé pour le terrain.** Mobile lisible en plein soleil, trois langues, motion respectueuse (`prefers-reduced-motion`). L'outil s'adapte au voyageur, pas l'inverse.

## Accessibility & Inclusion

**Niveau visé :** bonnes pratiques de base, pas certification formelle WCAG.

- Responsive mobile-first ; contrastes lisibles sur fond sable en extérieur.
- Navigation clavier sur parcours public (skip link, modales fermables, focus visible).
- `prefers-reduced-motion` honoré sur animations hero et scroll.
- Copy i18n pour FR, EN, IT ; pas de texte critique uniquement en image.

Améliorations futures possibles : audit WCAG 2.1 AA formel, tests lecteurs d'écran sur formulaire de réservation.
