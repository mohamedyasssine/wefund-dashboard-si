# Architecture hexagonale et qualite de code

## Lecture architecture (cours QSI)

- Domaine (`domain/`): coeur metier, sans dependance externe.
- Port (`domain/ports/KpiDataService.ts`): contrat d'acces aux donnees KPI.
- Adaptateur (`lib/adapters/mockKpiDataAdapter.ts`): implementation concrete.
- Application (`lib/application/kpiDashboardUseCases.ts`): orchestration des cas d'usage.
- Presentation (`components/`): UI, depend des abstractions.

## Point cle: inversion de dependances (DIP)

- Le composant ne depend pas directement du module mock.
- L'UI consomme un service abstrait via le port.
- Le remplacement mock -> API peut se faire sans casser la UI.

## Qualites obtenues

- Maintenabilite:
  - roles des couches clairs,
  - impact localise des changements.
- Testabilite:
  - use-cases testables avec stubs/fakes.
- Evolutivite:
  - ajout d'un nouvel adaptateur sans reecriture majeure.
- Lisibilite:
  - types metier centralises dans `domain/kpi.ts`.

## Limites actuelles (honnetete technique)

- Une partie de logique metier reste dans `lib/data/mock.ts`.
- A terme: extraire encore plus de regles metier vers `domain/` ou `application/`.

## Lien avec les principes du cours

- SRP: separation UI / application / infra.
- DIP: dependance vers abstractions (ports).
- DRY: centralisation des types, constantes et utilitaires.
- YAGNI: architecture modulaire mais pragmatique pour un projet de taille moyenne.
