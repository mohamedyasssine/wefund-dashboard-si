# Strategie de tests et couverture

## Commandes de demonstration (a afficher en premier)

```bash
npm run lint
npm run type-check
npm test
npm run test:coverage
```

## Resultats actuels

- Tests: 120 / 120 passes
- Couverture statements: 91.18%
- Couverture lignes: 90.95%
- Rapport exploitable par Sonar via `coverage/lcov.info`

## Strategie appliquee (cours Testing)

- Tests unitaires metier:
  - verification des formules et invariants.
- Tests adaptateur/port:
  - verification du contrat `KpiDataService`.
- Tests use-cases:
  - verification des chemins succes/erreur.
- Tests composants:
  - rendu + interactions + accessibilite de base.

## Detail par fichier de test

- `__tests__/kpi-data-service.test.ts`
  - couverture principale de `getKpiData` et `computeAggregatedStats`.
  - valeur qualite: validation fonctionnelle du coeur KPI.

- `__tests__/data-aggregation-edge-cases.test.ts`
  - cas limites et egalites entre series/agregats.
  - valeur qualite: detection de regressions mathematiques.

- `__tests__/weighted-avg-duration.test.ts`
  - formule de moyenne ponderee de duree.
  - valeur qualite: fiabilite des regles metier.

- `__tests__/kpi-data-service-adapter.test.tsx`
  - port/adaptateur/context + comportement hors provider.
  - valeur qualite: robustesse de l'injection de dependance.

- `__tests__/application.kpi-dashboard-use-cases.test.ts`
  - tests dedies a la couche application (nouvelle couche).
  - valeur qualite: garantie des cas d'usage, conforme architecture.

- `__tests__/components.kpi-card.test.tsx`
  - rendu de la carte KPI.
  - valeur qualite: non-regression UI locale.

- `__tests__/components.rendering.test.tsx`
  - interactions UI (changement periode, etc.).
  - valeur qualite: comportement utilisateur reel.

- `__tests__/components.smoke.test.tsx`
  - verifications rapides des composants.
  - valeur qualite: alerte rapide sur casse globale.

- `__tests__/utils.test.ts`
  - tests utilitaires (date/format).
  - valeur qualite: stabilite des fonctions transverses.

- `__tests__/types.kpi.test.ts`
  - tests de `toKpiLoadError`, `isLoaded`, `isError`.
  - valeur qualite: TypeDD + gestion d'erreur explicite.

## Lecture des traces d'erreur dans Vitest

- La trace `useKpiDataService ... hors provider` apparait dans un test volontaire.
- Ce n'est pas un echec de suite.
- L'indicateur a retenir reste:
  - "Test Files passed"
  - "Tests passed"
  - pourcentage de couverture.
