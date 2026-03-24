# Guide tests, couverture et Sonar local

## Commandes rapides (a lancer en premier)

```bash
# 1) Tests
npm test

# 2) Couverture
npm run test:coverage

# 3) Lint + type-check
npm run lint
npm run type-check
```

## Strategie de test du projet

- **Tests unitaires metier**: verification des invariants KPI et des formules d'agregation.
- **Tests adaptateur/port**: validation de la delegation via `KpiDataService`.
- **Tests use-cases application**: verification des chemins succes/erreur de `kpiDashboardUseCases`.
- **Tests composants**: rendu, interactions UI, et accessibilite de base.
- **Objectif**: couvrir le comportement attendu, pas seulement l'implementation.

## Lancer SonarQube en local (demo prof)

### 1) Demarrer SonarQube local

```bash
docker run -d --name sonarqube-local -p 9000:9000 sonarqube:lts-community
```

Interface: `http://localhost:9000`

Identifiants par defaut:
- user: `admin`
- pass: `admin`

### 2) Preparer la couverture

```bash
npm run test:coverage
```

Le rapport attendu: `coverage/lcov.info`

### 3) Lancer le scan local

```bash
npx sonar-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=TON_TOKEN_LOCAL \
  -Dsonar.projectKey=wefund-dashboard-si-local \
  -Dsonar.projectName=wefund-dashboard-si-local \
  -Dsonar.sources=app,components,context,domain,lib,types \
  -Dsonar.tests=__tests__ \
  -Dsonar.test.inclusions=__tests__/**/*.test.ts,__tests__/**/*.test.tsx \
  -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
  -Dsonar.typescript.tsconfigPath=tsconfig.json
```

### 4) Voir les resultats

Ouvrir `http://localhost:9000`, puis le projet `wefund-dashboard-si-local`.

## Commandes utiles pendant la demo

```bash
# arreter / relancer SonarQube
docker stop sonarqube-local
docker start sonarqube-local

# logs SonarQube
docker logs -f sonarqube-local
```

## Notes importantes

- Les traces `useKpiDataService ... hors provider` peuvent apparaitre dans certains tests qui verifient explicitement le cas d'erreur.
- Le resultat final a lire est le resume Vitest: nombre de fichiers/tests passes + couverture.
