# Test technique

**Le temps n’est pas limité pour vous permettre de nous envoyer le code le plus clair et
maintenable possible. Il montrera le meilleur de vos compétences.**

## Sujet

Dans le cadre de l’analyse de données, nous souhaitons pouvoir détecter un comportement
continu à partir des données reçues par nos compteurs.
Nous souhaitons par exemple identifier les fuites en supposant que toute consommation de
plus de 15l / heure pendant plus de 3h d’affilée est une fuite potentielle.

- [ ] Ecrire un algorithme qui détecte ce type d’événement, qui prend en entrée le jeu de donnée
      contenu dans hourly_consumption.json et qui ressort pour résultat le tableau décrit dans
      potential_leakage.json.
- [ ] **Bonus 1 :**
      Rendre cet algorithme indépendant du type de structure de donnée passé en entrée.
      Par exemple, nous devons pouvoir passer un simple tableau d’entiers (représentants ici la
      consommation) et considérer que chaque occurrence correspond à 1h.
- [ ] **Bonus 2 :**

      Ce même algorithme doit pouvoir détecter plusieurs types d’événements. C’est à dire que
      les conditions de reconnaissances d’un événement doivent pouvoir être configurables.

**Exemple :**

> Nous souhaitons identifier les événements où la somme des consommations de 3 heures
> consécutives est supérieure à un seuil pendant plus de 5h.

Pour répondre au test technique :
Le code doit être envoyé sous forme de lien vers le repository GitHub ou GitLab.
Le code doit être exécutable et la procédure pour l’exécuter doit être décrite dans le
README du repo.
L’utilisation de librairie telle que lodash/underscore.js est autorisée.
