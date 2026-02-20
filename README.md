# WeFund Dashboard SI

Dashboard de suivi pour la plateforme de financement participatif WeFund.

## Description

Cette application fournit des graphiques de suivi à la DSI pour analyser les performances de la plateforme de crowdfunding.

## Indicateurs disponibles

- Nombre de campagnes actives sur une période donnée
- Montant collecté au total sur une période donnée
- Taux de succès global
- Nombre de contributions total sur une période donnée
- Nombre moyen de contributions par campagne
- Durée moyenne avant succès/échec
- Montant moyen par contribution
- Taux d'atteinte moyen des objectifs (collecté / objectif cible)
- Volume remboursé total sur une période

## Technologies

- **Framework**: Next.js 14
- **Langage**: TypeScript
- **Graphiques**: Recharts
- **Node.js**: Version 24+

## Pourquoi Next.js ?

Next.js a été choisi plutôt que React pur pour les raisons suivantes :

### Déploiement simplifié
Le cahier des charges exige une URL déployée pour la recette du client. Next.js se déploie facilement sur Render.com (offre free) ou Vercel sans configuration complexe. Le framework est optimisé pour la production dès le départ.

### Routing intégré
L'App Router permet d'organiser les pages du dashboard de manière claire. Pas besoin d'installer React Router séparément, la structure de fichiers est standardisée.

### Performance
Next.js propose des optimisations automatiques (code splitting, lazy loading) qui sont importantes pour un dashboard avec plusieurs graphiques simultanés. Cela améliore l'expérience utilisateur avec des chargements plus rapides.

### Évolutivité
Les API Routes intégrées permettront de connecter facilement les microservices plus tard. L'architecture est prête pour intégrer les services de gestion de projets et contributions. Le support natif du SSR/SSG est disponible si nécessaire.

### Configuration minimale
Le support TypeScript est natif et optimisé. Moins de configuration manuelle est nécessaire, ce qui permet de se concentrer sur le développement.

### Alignement avec le cahier des charges
Le cahier des charges mentionne la possibilité d'utiliser NextJS. C'est un framework moderne et largement adopté dans l'écosystème React, ce qui garantit une meilleure maintenabilité à long terme.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Structure du projet

```
wefund-dashboard-si/
├── app/                    # Pages Next.js (App Router)
├── components/             # Composants Next.js réutilisables
├── lib/                    # Utilitaires et services
├── types/                  # Définitions TypeScript
└── public/                 # Assets statiques
```
