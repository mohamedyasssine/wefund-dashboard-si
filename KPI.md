# Liste des Indicateurs (KPI) - Dashboard WeFund

## Indicateurs à implémenter

1. **Nombre de campagnes actives sur une période donnée**
   - Description: Affiche le nombre de campagnes en statut "active" sur une période sélectionnée
   - Type de graphique: Ligne ou barre temporelle
   - Période: Sélectionnable (jour, semaine, mois, trimestre, année)

2. **Montant collecté au total sur une période donnée**
   - Description: Somme totale des contributions collectées sur une période
   - Type de graphique: Ligne temporelle avec montant cumulé
   - Période: Sélectionnable

3. **Taux de succès global**
   - Description: Pourcentage de campagnes ayant atteint leur objectif
   - Type de graphique: Indicateur avec pourcentage ou graphique en secteurs
   - Calcul: (Campagnes réussies / Total campagnes terminées) × 100

4. **Nombre de contributions total sur une période donnée**
   - Description: Nombre total de contributions effectuées sur une période
   - Type de graphique: Barre ou ligne temporelle
   - Période: Sélectionnable

5. **Nombre moyen de contributions par campagne**
   - Description: Moyenne du nombre de contributions par campagne
   - Type de graphique: Indicateur numérique ou histogramme
   - Calcul: Total contributions / Nombre de campagnes

6. **Durée moyenne avant succès/échec**
   - Description: Temps moyen nécessaire pour qu'une campagne atteigne le succès ou échoue
   - Type de graphique: Indicateur avec durée (jours) ou graphique comparatif
   - Calcul: Moyenne des durées des campagnes terminées

7. **Montant moyen par contribution**
   - Description: Montant moyen d'une contribution individuelle
   - Type de graphique: Indicateur numérique ou distribution
   - Calcul: Total collecté / Nombre de contributions

8. **Taux d'atteinte moyen des objectifs**
   - Description: Pourcentage moyen d'atteinte des objectifs financiers
   - Type de graphique: Indicateur avec pourcentage ou barre
   - Calcul: (Total collecté / Total objectifs) × 100

9. **Volume remboursé total sur une période**
   - Description: Montant total des remboursements effectués sur une période
   - Type de graphique: Ligne temporelle ou barre
   - Période: Sélectionnable

## Notes

- Tous les graphiques sont publics (pas de gestion d'accès dans le POC)
- Les données seront mockées dans un premier temps
- L'architecture permettra de brancher facilement l'API réelle plus tard
