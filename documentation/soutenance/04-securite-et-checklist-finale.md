# Securite et checklist finale de soutenance

## Securite appliquee dans le projet

- Typage fort des erreurs:
  - `KpiLoadError` + codes (`NETWORK`, `TIMEOUT`, `UNKNOWN`).
- Etats asynchrones explicites:
  - `AsyncResult` (`idle`, `loading`, `loaded`, `error`).
- Limitation des etats invalides:
  - unions TypeScript sur `KpiId`, `Period`.
- Bonnes pratiques CI locale:
  - lint + type-check + tests + couverture.

## Points de vigilance a annoncer

- Dependances npm:
  - des vulnerabilities ont ete signalees pendant `npm install`.
  - action prevue: audit et remediation progressive.
- Sonar Cloud CI:
  - volontairement desactive pour rester en mode local demo.
- SonarQube local:
  - preferer une version active de l'image Docker.

## Checklist avant passage avec le prof

- [ ] `npm run lint` vert
- [ ] `npm run type-check` vert
- [ ] `npm run test` vert
- [ ] `npm run test:coverage` vert
- [ ] Sonar local accessible sur `http://localhost:9000`
- [ ] Rapport coverage visible et chiffre annonce (91.18%)
- [ ] Expliquer les couches: domain / application / adapters / components
- [ ] Montrer 2-3 tests metier significatifs

## Commandes Sonar local (demo)

```bash
# lancer SonarQube local
docker run -d --name sonarqube-local -p 9000:9000 sonarqube:community

# couverture
npm run test:coverage

# scan local
npx sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=TON_TOKEN_LOCAL -Dsonar.projectKey=wefund-dashboard-si-local -Dsonar.projectName=wefund-dashboard-si-local -Dsonar.sources=app,components,context,domain,lib,types -Dsonar.tests=__tests__ -Dsonar.test.inclusions=__tests__/**/*.test.ts,__tests__/**/*.test.tsx -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info -Dsonar.typescript.tsconfigPath=tsconfig.json
```
