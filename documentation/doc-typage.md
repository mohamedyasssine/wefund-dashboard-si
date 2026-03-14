# Documentation — Typage et états métier (TypeDD)

Ce document décrit les choix de typage du dashboard WeFund, alignés sur le **Type Driven Development** et le cours QSI (Qualité des Systèmes d’Information) : types somme, cardinalité, absence de primitive obsession.

---

## 1. Objectifs

- **Restreindre la cardinalité** des types à celle du métier (éviter `string` ou `number` partout).
- **Modéliser les états asynchrones** (chargement / succès / erreur) par une union discriminée, sans `any` ni états incohérents.
- **Centraliser** les types et constantes pour éviter les chaînes magiques (`'active-campaigns'`, `'month'`, etc.) dispersées dans le code.

---

## 2. Types métier utilisés partout

### 2.1 `KpiId`

Identifiant d’un indicateur. **Type union de littéraux** (cardinalité finie) :

- `'active-campaigns'` | `'total-collected'` | `'success-rate'` | …

Utilisé dans : sélecteur d’indicateur, service de données, métadonnées. Aucune string arbitraire : seules les valeurs déclarées dans le type sont acceptées.

### 2.2 `Period`

Période de filtrage. **Type union** :

- `'day'` | `'week'` | `'month'` | `'quarter'` | `'year'` | `'all'`

Utilisé dans : sélecteur de période, `getPeriodStartDate`, `getKpiData`. Les constantes `AVAILABLE_PERIODS`, `DEFAULT_PERIOD` sont typées en `Period[]` et `Period`.

### 2.3 `KpiData`

Structure de réponse pour un KPI : `kpiId`, `period`, `value?`, `timeSeries?`, `metadata?`. Défini dans `types/kpi.ts`. Évite des objets anonymes ou des `any` lors du passage des données au composant.

---

## 3. Modélisation des états asynchrones : `AsyncResult<T, E>`

Au lieu de plusieurs `useState` (données, chargement, erreur) non coordonnés, on utilise une **union discriminée** sur un champ `status` :

```ts
type AsyncResult<T, E = KpiLoadError> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; error: E }
```

- **idle** : aucune requête encore lancée.
- **loading** : requête en cours.
- **loaded** : succès, avec `data: T` (ex. `KpiData`).
- **error** : échec, avec `error: E` (ex. `KpiLoadError`).

Avantages :

- Le compilateur force le traitement de chaque cas (ex. accès à `data` uniquement quand `status === 'loaded'`).
- Pas d’état impossible (ex. `loading: true` et `data` non null en même temps).
- Une seule variable d’état dans le composant.

### 3.1 `KpiLoadError`

Erreur typée (pas une simple `string`) pour le chargement des données KPI :

```ts
interface KpiLoadError {
  message: string
  code?: 'NETWORK' | 'UNKNOWN'
}
```

Permet d’afficher un message utilisateur et, si besoin, d’adapter le comportement selon le `code`.

### 3.2 Spécialisation pour le dashboard

`KpiDashboardDataState` est défini comme :

```ts
type KpiDashboardDataState = AsyncResult<KpiData, KpiLoadError>
```

Tout l’état “données KPI” du dashboard est donc soit idle, soit loading, soit loaded avec `KpiData`, soit error avec `KpiLoadError`.

### 3.3 Gardes de type

Pour affiner le type dans les conditions, on utilise des gardes exportées depuis `types/kpi.ts` :

- `isLoaded(state)` : `state is { status: 'loaded'; data: T }` → accès à `state.data` en toute sécurité.
- `isError(state)` : `state is { status: 'error'; error: E }` → accès à `state.error`.

Cela évite des casts et documente l’intention (vérification de cas “succès” ou “erreur”).

---

## 4. Constantes typées

Fichier : `lib/constants/dashboard.ts`.

- **AVAILABLE_PERIODS** : `readonly Period[]` — périodes proposées dans le sélecteur (plus de tableau de strings en dur dans le JSX).
- **DEFAULT_KPI_ID** : `KpiId` — indicateur sélectionné au premier rendu.
- **DEFAULT_PERIOD** : `Period` — période par défaut.

Toute évolution (nouvelle période, autre KPI par défaut) se fait à un seul endroit, avec vérification de type.

---

## 5. Où trouver les définitions

| Élément              | Fichier                 |
|----------------------|-------------------------|
| `KpiId`, `Period`, `KpiData`, `TimeSeriesDataPoint`, `KpiMetadata` | `types/index.ts`, `types/kpi.ts` |
| `AsyncResult`, `KpiLoadError`, `KpiDashboardDataState`, `isLoaded`, `isError` | `types/kpi.ts` |
| `AVAILABLE_PERIODS`, `DEFAULT_KPI_ID`, `DEFAULT_PERIOD` | `lib/constants/dashboard.ts` |

---

## 6. Référence cours QSI

- **TypeDD** : types somme (union discriminée), cardinalité alignée sur le métier, pas de primitive obsession.
- **JS/TS** : interfaces et types explicites, pas de `any` pour les états métier.
- **Gestion des erreurs** : erreur modélisée comme type (`KpiLoadError`) plutôt que chaîne seule ou `try/catch` non typé.
