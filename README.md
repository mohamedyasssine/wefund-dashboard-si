# WeFund Dashboard SI

Dashboard de suivi pour la plateforme de crowdfunding WeFund.

## Description

Application de monitoring des KPIs pour les équipes DSI/recette. Affiche 9 indicateurs clés (collecté, remboursé, taux succès, etc.) avec graphiques et sélecteurs de période.

## Les 9 KPIs

1. Total collecté (€)
2. Total remboursé (€)
3. Durée moyenne (jours)
4. Taux de succès (%)
5. Montant moyen par contribution (€)
6. Taux de remboursement (%)
7. Total contributeurs (nombre)
8. Campagnes actives (nombre)
9. Projets (nombre)

**Voir** `documentation/KPI.md` pour formules et détails.

---

## Stack technique

- **Framework :** Next.js 14 + React 18.3
- **Langage :** TypeScript 5.5
- **Graphiques :** Recharts 2.12
- **Tests :** Vitest 4.1 + Testing Library
- **Node.js :** v24+

---

## Installation & lancement

**Prérequis :** Node.js v24+

```bash
# Installer
npm install

# Dev
npm run dev
# → http://localhost:3000

# Build production
npm run build
npm start

# Tests
npm test
```

---

## Architecture

### Port/Adapter (Hexagonal)

L'application suit le pattern hexagonal pour découpler la UI des données :

```
Domaine (métier, sans dépendances)
  ├── domain/entities.ts → Entités (Project, Campaign, User, Contribution)
  ├── domain/kpi.ts → Types KPI
  └── domain/ports/KpiDataService.ts → Interface du service
       ↑
       │ implémente
       │
Adaptateurs (infrastructure)
  └── lib/adapters/mockKpiDataAdapter.ts → Implémentation mock

UI (composants React)
  └── components/ → Dépend du port, pas de l'implémentation
```

**Avantages :**
- Swap facile : mock → API sans toucher la UI
- Tests simples : injecter des mocks en 2 lignes
- Maintenabilité : domaine isolé des changements externes

### Dossiers clés

| Dossier | Rôle |
|---------|------|
| `domain/` | Entités métier, port `KpiDataService` |
| `lib/adapters/` | `mockKpiDataAdapter` implémente le port |
| `lib/data/mock.ts` | Données mock + formules KPI |
| `components/` | Composants React (KpiDashboard, KpiCard, Charts) |
| `context/` | `KpiDataServiceProvider` + hook `useKpiDataService` |
| `documentation/` | `doc-architecture.md`, `doc-typage.md`, `KPI.md` |
| `__tests__/` | 110 tests validant formules & composants |

---

## Composants UI

### KpiDashboard
Composant principal. Affiche grille de cartes KPI avec sélecteurs.

### KpiCard
Affiche un KPI : titre, valeur, graphique, sous-titre.

### KpiSelector
Dropdown pour choisir l'indicateur à afficher.

### PeriodSelector
Radio buttons pour période (jour, semaine, mois, année, tout).

### Charts
- `LineKpiChart` — courbes (collecté, remboursé, refundrate)
- `BarKpiChart` — barres (succès, contributeurs, durée)
- `PieKpiChart` — pie (taux succès)

---

## Injection de dépendances

Le service KPI est fourni via **React Context**. Cela permet de swapper l'implémentation sans recompiler la UI.

**Actuel (mock) :**
```typescript
// app/layout.tsx
<KpiDataServiceProvider service={mockKpiDataAdapter}>
  <KpiDashboard />
</KpiDataServiceProvider>
```

**Futur (API) :**
```typescript
// app/layout.tsx
<KpiDataServiceProvider service={apiKpiDataAdapter}>
  <KpiDashboard />
</KpiDataServiceProvider>
```

### Hook d'utilisation
```typescript
const service = useKpiDataService()
const data = await service.getKpiData('total-collected', 'month')
```

---

## Tests

**110 tests** validant formules, composants et service :

| Suite | Nb tests | Couverture |
|-------|----------|-----------|
| `weighted-avg-duration` | 8 | Moyenne pondérée (durée moyenne) |
| `data-aggregation-edge-cases` | 12 | Formules & cas limites |
| `components.rendering` | 11 | Rendu composants |
| `components.smoke` | 5 | Tests simples |
| `components.kpi-card` | 7 | KpiCard avec props |
| `kpi-data-service-adapter` | 5 | Service & injection |
| `kpi-data-service` (existant) | 41 | Contrat données KPI |
| `utils` (existant) | 21 | Formatage dates/devises |

**Lancer :**
```bash
npm test              # Interactive
npm test -- --run    # Une fois
```

---

## Données de test

Mock dataset dans `lib/data/mock.ts` :
- 10 projets
- 35+ campagnes
- 500+ contributions (€500–€50k)
- 200+ contributeurs
- Dates : personnalisables par test

**Formules testées :**
- ✓ Moyenne pondérée (durée)
- ✓ Taux succès
- ✓ Agrégation multi-période
- ✓ Contrainte remboursé ≤ collecté

---

## Intégration API (futur)

Quand les microservices seront disponibles :

1. Créer `lib/adapters/apiKpiDataAdapter.ts` implémentant `KpiDataService`
2. Remplacer `mockKpiDataAdapter` par `apiKpiDataAdapter` dans `app/layout.tsx`
3. Tests restent identiques (interface ne change pas)

**Exemple :**
```typescript
// lib/adapters/apiKpiDataAdapter.ts
export const apiKpiDataAdapter: KpiDataService = {
  async getKpiData(kpiId, period) {
    const res = await fetch(`/api/kpis/${kpiId}?period=${period}`)
    return res.json()
  },
  async getKpiMetadata() {
    const res = await fetch('/api/kpis/metadata')
    return res.json()
  }
}
```

---

## Documentation

- **[doc-architecture.md](documentation/doc-architecture.md)** — Pattern hexagonal, découpage couches
- **[doc-typage.md](documentation/doc-typage.md)** — Types métier, AsyncResult, gardes
- **[KPI.md](documentation/KPI.md)** — Formules exactes, cas limites, implémentation

---

## Déploiement

Prêt pour Render.com, Vercel, ou tout serveur Node.js 24+.

```bash
npm run build
npm start
```

Environment : `NODE_ENV=production`

---

**Créé :** Janv 2025  
**Status :** POC complet, prêt pour recette  
**Tests :** 110/110 ✓
