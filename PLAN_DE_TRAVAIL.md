# Plan de Travail - Dashboard WeFund

## Vue d'ensemble

Ce document décrit le plan de développement du dashboard, découpé en plusieurs commits pour une progression structurée.

## Commits prévus

### ✅ Commit 1: Configuration initiale
**Statut**: En cours
- [x] Configuration Next.js + TypeScript
- [x] Configuration ESLint
- [x] Dépendances (React, Next.js, Recharts)
- [x] Structure de base (app/, layout, page)
- [x] Documentation README et KPI.md

### Commit 2: Structure de base et layout
- Structure des dossiers (components/, lib/, types/)
- Layout principal du dashboard
- Composant Header/Navigation
- Styles de base et thème

### Commit 3: Service de données mockées
- Types TypeScript pour les données
- Service de génération de données mockées
- Interface pour les données réelles (préparation API)
- Données de test réalistes

### Commit 4: Composants de graphiques avec Recharts
- Composant générique de graphique
- Composants spécifiques (LineChart, BarChart, PieChart)
- Composant d'indicateur numérique (KPI card)
- Gestion des périodes (sélecteur de dates)

### Commit 5: Page principale avec sélection d'indicateurs
- Liste des indicateurs disponibles
- Sélecteur d'indicateur
- Affichage conditionnel du graphique sélectionné
- Routing et navigation

### Commit 6: Implémentation des 9 KPI individuels
- KPI 1: Nombre de campagnes actives
- KPI 2: Montant collecté total
- KPI 3: Taux de succès global
- KPI 4: Nombre de contributions total
- KPI 5: Nombre moyen de contributions par campagne
- KPI 6: Durée moyenne avant succès/échec
- KPI 7: Montant moyen par contribution
- KPI 8: Taux d'atteinte moyen des objectifs
- KPI 9: Volume remboursé total

### Commit 7: Styling, responsive design et finalisation
- Design moderne et professionnel
- Responsive design (mobile, tablette, desktop)
- Animations et transitions
- Tests finaux et corrections
- Documentation finale

## Architecture technique

### Structure des dossiers
```
wefund-dashboard-si/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── charts/
│   ├── kpi/
│   └── ui/
├── lib/
│   ├── data/
│   └── utils/
├── types/
└── public/
```

### Technologies utilisées
- **Next.js 14** (App Router)
- **TypeScript** (typage strict)
- **Recharts** (graphiques)
- **CSS Modules** ou **Tailwind** (styling - à décider)

## Prochaines étapes

1. Finaliser le commit 1 (configuration)
2. Commencer le commit 2 (structure et layout)
3. Implémenter les données mockées
4. Créer les composants de graphiques
5. Implémenter chaque KPI progressivement
