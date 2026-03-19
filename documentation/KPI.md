# Indicateurs KPI — WeFund Dashboard

Les 9 indicateurs clés sont calculés à partir de projets, campagnes et contributions. Toutes les formules sont implémentées dans `lib/data/mock.ts` et testées.

---

## 1. Total collecté (€)

**Formule :** `SUM(collected_amount pour toutes les contributions)`

**Implémentation :** `lib/data/mock.ts` L320-325

**Graphique :** Courbe cumulative  
**Cas limites :** Aucune contribution = 0

---

## 2. Total remboursé (€)

**Formule :** `SUM(refunded_amount pour toutes les contributions)`

**Implémentation :** `lib/data/mock.ts` L320-325

**Graphique :** Courbe cumulative  
**Contrainte :** Remboursé ≤ Collecté  
**Cas limites :** Aucun remboursement = 0

---

## 3. Durée moyenne (jours)

**Formule (moyenne pondérée) :**
```
Durée moy = (nb_succès × durée_succès + nb_échecs × durée_échecs) / 
            (nb_succès + nb_échecs)
```

**Pourquoi pondérée ?** Évite le biais quand succès ≠ échecs en nombre.

**Implémentation :** `lib/data/mock.ts` L355-359

**Graphique :** Barres (succès, échecs, moyenne)  

**Exemple :**
```
8 succès @ 30j, 2 échecs @ 45j
Naive: (30 + 45) / 2 = 37.5j ← FAUX
Pondérée: (8×30 + 2×45) / 10 = 33j ← JUSTE
```

**Cas limites :** Que succès ou que échecs = durée du groupe seul

---

## 4. Taux de succès (%)

**Formule :** `(campagnes_réussies / total_campagnes) × 100`

**Implémentation :** `lib/data/mock.ts` L330-335

**Graphique :** Pie (succès vs échecs)  
**Cas limites :** Tous succès = 100%, tous échecs = 0%

---

## 5. Montant moyen par contribution (€)

**Formule :** `montant_total_collecté / nombre_contributions`

**Implémentation :** `lib/data/mock.ts` L340-345

**Graphique :** Barres par période  
**Cas limites :** Zéro contribution = 0 (évite division par zéro)  
**Interprétation :** Gros dons vs crowdfunding selon la moyenne

---

## 6. Taux de remboursement (%)

**Formule :** `(montant_remboursé / montant_collecté) × 100`

**Implémentation :** `lib/data/mock.ts` L350-365

**Graphique :** Courbe quotidienne  
**Interprétation :**
- 0% = aucun remboursement
- ~10-20% = churn normal
- 100% = échec complet

**Cas limites :** Zéro collecté = 0 (évite division par zéro)

---

## 7. Total contributeurs (nombre)

**Formule :** `COUNT(DISTINCT contributor_ids)`

**Implémentation :** `lib/data/mock.ts` L360-365

**Graphique :** Courbe cumulative  
**Cas limites :**
- Contributeur multi-dons = compté une fois
- Série temporelle : augmentation ou plateau

---

## 8. Campagnes actives (nombre)

**Formule :** 
```
COUNT(campagnes WHERE startDate ≤ fin_période 
                  AND endDate ≥ début_période)
```

**Implémentation :** `lib/data/mock.ts` L220-250, L370-380

**Graphique :** Barres par jour/semaine  
**Cas limites :** Campagnes d'un projet = chacune comptée séparément

---

## 9. Projets (nombre)

**Formule :** `COUNT(DISTINCT project_ids avec activité)`

**Implémentation :** `lib/data/mock.ts` L280-300, L375-385

**Graphique :** Barres par mois/année  
**Cas limites :**
- Projet = plusieurs campagnes = compté une fois
- Utilisé avec collecté total pour moyenne/projet

---

## Validation des calculs

- **Tests unitaires :** `__tests__/data-aggregation-edge-cases.test.ts` (12 tests)
- **Moyenne pondérée :** `__tests__/weighted-avg-duration.test.ts` (8 tests)
- **Composants :** `__tests__/components.*.test.ts` (23 tests)
- **Service :** `__tests__/kpi-data-service*.test.ts` (46 tests)

**Total :** 110 tests, tous passants

---

## Données de test

- 10 projets
- 35+ campagnes (succès / échecs mélangés)
- 500+ contributions (€500-€50k chacune)
- 200+ contributeurs uniques
- Lancer : `npm test`

---

## Intégration future API

Quand les microservices seront disponibles, remplacer `mockKpiDataAdapter` par `apiKpiDataAdapter` dans `app/layout.tsx`. Les formules basculeront au backend, l'UI reste identique.

---

**Dernière mise à jour :** 16 janv 2025  
**Couverture tests :** 110 tests ✓  
**État :** Prêt pour intégration API
