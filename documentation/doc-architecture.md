# Documentation — Port et adaptateur données KPI (architecture hexagonale)

Ce document décrit l’introduction d’un **port** pour la récupération des données KPI et d’un **adaptateur** mock, conformément au cours QSI (Architecture, inversion de dépendances, testabilité).

---

## 1. Objectif

- **Découpler** le dashboard de la source de données concrète (fichier mock, future API).
- **Inverser la dépendance** : le dashboard dépend d’une **abstraction** (le port), pas de l’implémentation.
- **Faciliter les tests** : on peut injecter un adaptateur stub/fake dans les tests sans toucher au code métier.
- **Préparer le remplacement** du mock par un adaptateur API sans modifier le dashboard.

---

## 2. Le port : `KpiDataService`

**Fichier** : `lib/ports/kpiDataService.ts`

Le port est une **interface** TypeScript qui définit le contrat utilisé par l’application (cœur / UI) pour obtenir les données KPI :

```ts
export interface KpiDataService {
  getKpiData(kpiId: KpiId, period: Period): Promise<KpiData>
  getKpiMetadata(): Promise<KpiMetadata[]>
}
```

- **getKpiData** : retourne les données d’un KPI pour une période donnée (valeur agrégée + série temporelle si applicable).
- **getKpiMetadata** : retourne la liste des indicateurs disponibles (titre, description, type de graphique, etc.).

Le dashboard (et tout composant ou hook qui a besoin de ces données) **dépend uniquement de cette interface**. Il ne connaît pas le fichier `mock.ts` ni une future URL d’API.

---

## 3. L’adaptateur mock

**Fichier** : `lib/adapters/mockKpiDataAdapter.ts`

L’adaptateur **implémente** le port en déléguant aux fonctions existantes du module de données mockées :

```ts
export const mockKpiDataAdapter: KpiDataService = {
  getKpiData: (kpiId, period) => fetchKpiData(kpiId, period),
  getKpiMetadata: () => fetchKpiMetadata(),
}
```

- Il réutilise `fetchKpiData` et `fetchKpiMetadata` exportés par `lib/data/mock.ts`.
- Pour la production, on créera un autre adaptateur (ex. `apiKpiDataAdapter.ts`) qui appellera les vrais endpoints et implémentera le même port.

---

## 4. Injection du service : contexte React

**Fichier** : `context/KpiDataServiceContext.tsx`

Pour que le dashboard (et d’éventuels autres composants) obtiennent le service **sans import direct** de l’adaptateur :

- **KpiDataServiceProvider** : composant client qui reçoit en prop optionnelle un `KpiDataService` (par défaut : `mockKpiDataAdapter`) et le fournit via un `Context`.
- **useKpiDataService()** : hook qui retourne le service ; il lève une erreur claire si utilisé en dehors du provider.

Le **layout racine** (`app/layout.tsx`) enveloppe l’application avec `<KpiDataServiceProvider>`. Ainsi, tout composant enfant peut appeler `useKpiDataService()` et utiliser le port.

Pour les tests, on peut envelopper uniquement le composant à tester avec un provider qui reçoit un **stub** ou **fake** implémentant `KpiDataService`.

---

## 5. Utilisation dans le dashboard

Le **KpiDashboard** :

1. Appelle **useKpiDataService()** pour obtenir le service (port).
2. Utilise **service.getKpiMetadata()** au montage pour remplir la liste d’indicateurs.
3. Utilise **service.getKpiData(kpiId, period)** lorsque l’utilisateur change d’indicateur ou de période.

Il n’importe plus `fetchKpiData` ni `KPI_METADATA` depuis `lib/data/mock`. Toute la donnée passe par le port.

---

## 6. Schéma des dépendances

```
app/layout.tsx
  → KpiDataServiceProvider (injecte mockKpiDataAdapter par défaut)
      → Layout
          → KpiDashboard
              → useKpiDataService()  →  KpiDataService (port)
                                            ↑
              lib/adapters/mockKpiDataAdapter.ts  (implémente le port)
              lib/data/mock.ts  (logique et données mockées)
```

- **Port** : `lib/ports/kpiDataService.ts` (aucune dépendance vers mock ou API).
- **Adaptateur** : dépend du **port** (interface) et du **module mock** (implémentation actuelle).
- **Dashboard** : dépend du **port** via le hook, pas de l’adaptateur ni du mock.

---

## 7. Référence cours QSI

- **Architecture hexagonale** : le port est le contrat “côté métier / UI” ; l’adaptateur est “côté infrastructure”.
- **Inversion de dépendances** : les composants de haut niveau (dashboard) ne dépendent pas des détails de bas niveau (fichier mock, HTTP), mais d’une abstraction (le port).
- **Testabilité** : en fournissant un autre implémenteur du port (stub, fake), on peut tester le dashboard sans exécuter le vrai mock ni l’API.
