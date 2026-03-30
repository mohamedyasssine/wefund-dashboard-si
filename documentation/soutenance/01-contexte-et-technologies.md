# Contexte et technologies

## Contexte fonctionnel

- Application: dashboard de pilotage SI pour WeFund.
- Valeur: suivre la performance de campagnes, contributions et remboursements.
- Indicateurs: collecte, succes, duree, contribution moyenne, etc.

## Technologies utilisees

- Framework: Next.js 14
- UI: React 18
- Langage: TypeScript 5.5 (`strict: true`)
- Graphiques: Recharts 2.12
- Tests: Vitest 4 + @testing-library/react + jsdom
- Qualite: ESLint, type-check TypeScript, couverture LCOV
- Analyse qualite: Sonar (local ou cloud)

## Pourquoi ces choix (angle qualite)

- TypeScript strict:
  - reduit les erreurs runtime,
  - force la clarte des contrats.
- Next.js:
  - structure claire,
  - bon socle de maintainabilite.
- Vitest:
  - execution rapide,
  - integration naturelle avec couverture.
- Sonar:
  - vue centralisee de la dette technique et des risques.
