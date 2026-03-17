# Documentation — Architecture hexagonale et couche domaine

Ce document décrit l'organisation en couches du projet WeFund Dashboard, conformément au cours QSI (Architecture hexagonale, inversion de dépendances, testabilité).

---

## 1. Objectif

- **Isoler le domaine métier** dans un dossier dédié (`domain/`), sans dépendance vers l'UI ni l'infrastructure.
- **Découpler** le dashboard de la source de données concrète (fichier mock, future API).
- **Inverser la dépendance** : le dashboard dépend d'une **abstraction** (le port), pas de l'implémentation.
- **Faciliter les tests** : on peut injecter un adaptateur stub/fake sans toucher au code métier.
- **Préparer le remplacement** du mock par un adaptateur API sans modifier le dashboard.

---

## 2. Organisation des couches

```
domain/                          ← Noyau métier (aucune dépendance externe)
  ├── entities.ts                   Entités : Project, Campaign, User, Contribution
  ├── kpi.ts                        Types KPI : KpiId, KpiMetadata, Period, KpiData…
  └── ports/
      └── KpiDataService.ts         Port (interface) du service de données KPI

types/                           ← Types techniques / UI
  ├── index.ts                      Barrel de ré-export
  └── kpi.ts                        KpiChartConfig, AsyncResult, KpiLoadError…

lib/                             ← Infrastructure & utilitaires
  ├── adapters/
  │   └── mockKpiDataAdapter.ts     Adaptateur mock (implémente le port)
  ├── data/
  │   └── mock.ts                   Données et logique du mock (POC)
  ├── constants/
  │   └── dashboard.ts              Constantes typées (périodes, KPI par défaut)
  └── utils/
      ├── date.ts                   Utilitaires de dates
      └── format.ts                 Utilitaires de formatage

components/                      ← Couche présentation (UI)
  ├── dashboard/
  │   ├── KpiDashboard.tsx          Dashboard principal
  │   └── KpiSelector.tsx           Sélecteur d'indicateur
  └── ui/
      ├── Header.tsx, Layout.tsx    Structure de la page
      ├── KpiCard.tsx               Carte d'indicateur
      ├── PeriodSelector.tsx        Sélecteur de période
      ├── LineKpiChart.tsx          Graphique en courbe
      ├── BarKpiChart.tsx           Graphique en barres
      └── PieKpiChart.tsx           Graphique circulaire

context/                         ← Injection de dépendances (React Context)
  └── KpiDataServiceContext.tsx     Provider + hook useKpiDataService
```

---

## 3. Le domaine (`domain/`)

Le dossier `domain/` est le **cœur de l'hexagone**. Il ne dépend d'**aucun** module externe (pas de React, pas de bibliothèque de graphiques, pas de fetch).

### `domain/entities.ts`

Contient les **entités métier** de la plateforme WeFund :

- `Project` — un projet de financement participatif
- `Campaign` — une campagne de collecte liée à un projet
- `Contribution` — une contribution financière d'un utilisateur
- `User` — un utilisateur de la plateforme
- `CampaignStatus` — les statuts possibles d'une campagne

### `domain/kpi.ts`

Contient les **types liés aux indicateurs de performance** :

- `KpiId` — identifiant typé d'un KPI (union de littéraux)
- `KpiMetadata` — métadonnées d'un indicateur (titre, description, type de graphique…)
- `KpiData` — données d'un KPI pour affichage (valeur, série temporelle)
- `Period` — période de filtrage (`day`, `week`, `month`…)
- `TimeSeriesDataPoint` — un point de donnée temporelle
- `AggregatedStats` — statistiques agrégées

### `domain/ports/KpiDataService.ts`

Le **port** — une interface TypeScript qui définit le contrat utilisé par l'application pour obtenir les données KPI :

```ts
export interface KpiDataService {
  getKpiData(kpiId: KpiId, period: Period): Promise<KpiData>
  getKpiMetadata(): Promise<KpiMetadata[]>
}
```

Le dashboard (et tout composant) dépend **uniquement de cette interface**. Il ne connaît pas le fichier mock ni une future URL d'API.

---

## 4. Les types techniques (`types/`)

Le dossier `types/` ne contient **que** les types liés à la couche **présentation / technique** :

- `KpiChartConfig` — configuration d'un graphique (couleurs, axes, grille)
- `AsyncResult<T, E>` — union discriminée pour modéliser l'état asynchrone (idle / loading / loaded / error)
- `KpiDashboardDataState` — spécialisation pour les données du dashboard
- `KpiLoadError` / `KpiErrorCode` — erreur typée de chargement
- `toKpiLoadError()`, `isLoaded()`, `isError()` — fonctions utilitaires

Ces types importent `KpiData` depuis `@/domain/kpi` car l'état async encapsule les données du domaine.

---

## 5. L'adaptateur mock

**Fichier** : `lib/adapters/mockKpiDataAdapter.ts`

L'adaptateur **implémente** le port en déléguant aux fonctions existantes du module de données mockées :

```ts
export const mockKpiDataAdapter: KpiDataService = {
  getKpiData: (kpiId, period) => fetchKpiData(kpiId, period),
  getKpiMetadata: () => fetchKpiMetadata(),
}
```

Pour la production, on créera un autre adaptateur (ex. `apiKpiDataAdapter.ts`) qui appellera les vrais endpoints et implémentera le même port.

---

## 6. Injection du service : contexte React

**Fichier** : `context/KpiDataServiceContext.tsx`

- **KpiDataServiceProvider** : composant client qui reçoit en prop optionnelle un `KpiDataService` (par défaut : `mockKpiDataAdapter`) et le fournit via un `Context`.
- **useKpiDataService()** : hook qui retourne le service ; il lève une erreur claire si utilisé en dehors du provider.

Le **layout racine** (`app/layout.tsx`) enveloppe l'application avec `<KpiDataServiceProvider>`.

Pour les tests, on peut envelopper uniquement le composant à tester avec un provider qui reçoit un **stub** ou **fake** implémentant `KpiDataService`.

---

## 7. Schéma des dépendances

```
                    ┌─────────────────────────┐
                    │       domain/            │   ← Aucune dépendance externe
                    │  entities.ts             │
                    │  kpi.ts                  │
                    │  ports/KpiDataService.ts │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                   │
              ▼                  ▼                   ▼
   ┌──────────────────┐ ┌───────────────┐ ┌─────────────────────┐
   │  lib/adapters/   │ │   types/      │ │   components/       │
   │  (infrastructure)│ │   (UI types)  │ │   (présentation)    │
   └──────────────────┘ └───────────────┘ └─────────────────────┘
              │                                      │
              ▼                                      ▼
   ┌──────────────────┐                   ┌─────────────────────┐
   │  lib/data/mock   │                   │  context/           │
   │  (données POC)   │                   │  (injection React)  │
   └──────────────────┘                   └─────────────────────┘
```

- **domain/** : le noyau, ne dépend de rien d'autre.
- **types/** : dépend de `domain/` (importe `KpiData` pour typer `AsyncResult`).
- **lib/adapters/** : dépend de `domain/` (implémente le port) et de `lib/data/` (données mock).
- **components/** : dépend de `domain/` (types métier) et de `types/` (types UI).
- **context/** : dépend de `domain/` (le port) et de `lib/adapters/` (adaptateur par défaut).

---

## 8. Règle de dépendance (hexagonale)

> Le domaine ne dépend de **rien** d'extérieur. Tout le reste dépend du domaine.

Cette règle est vérifiable en inspectant les imports de `domain/` : ils ne pointent vers aucun fichier hors de `domain/`.

---

## 9. Référence cours QSI

- **Architecture hexagonale** : le port est le contrat « côté métier / UI » ; l'adaptateur est « côté infrastructure ».
- **Inversion de dépendances** : les composants de haut niveau (dashboard) ne dépendent pas des détails de bas niveau (fichier mock, HTTP), mais d'une abstraction (le port dans `domain/ports/`).
- **Séparation des préoccupations** : les entités et types métier vivent dans `domain/`, les types d'affichage dans `types/`, l'implémentation dans `lib/`.
- **Testabilité** : en fournissant un autre implémenteur du port (stub, fake), on peut tester le dashboard sans exécuter le vrai mock ni l'API.
