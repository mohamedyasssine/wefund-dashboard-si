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

Next.js a été choisi plutôt que React pur pour plusieurs raisons stratégiques :

### 🚀 Déploiement simplifié
- Le cahier des charges exige une URL déployée pour la recette du client
- Next.js se déploie facilement sur Render.com (offre free) ou Vercel sans configuration complexe
- Optimisé pour la production dès le départ

### 🗺️ Routing intégré
- App Router moderne et intuitif pour organiser les pages du dashboard
- Pas besoin d'installer React Router séparément
- Structure de fichiers claire et standardisée

### ⚡ Performance optimale
- Optimisations automatiques (code splitting, lazy loading)
- Important pour un dashboard avec plusieurs graphiques simultanés
- Meilleure expérience utilisateur avec des chargements rapides

### 🔌 Évolutivité
- API Routes intégrées pour connecter facilement les microservices plus tard
- Architecture prête pour intégrer les services de gestion de projets et contributions
- Support natif du SSR/SSG si nécessaire

### 📦 Configuration minimale
- Support TypeScript natif et optimisé
- Moins de configuration manuelle nécessaire
- Focus sur le développement plutôt que sur la configuration

### 🎯 Alignement avec le cahier des charges
- Le cahier des charges mentionne la possibilité d'utiliser NextJS
- Framework moderne et largement adopté dans l'écosystème React
- Meilleure maintenabilité à long terme

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
├── components/             # Composants React réutilisables
├── lib/                    # Utilitaires et services
├── types/                  # Définitions TypeScript
└── public/                 # Assets statiques
```
