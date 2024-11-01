# Calculatrice Web

Ce projet est une **calculatrice en ligne** moderne et interactive style IOS, réalisée par **Stark Kassa**, étudiant en développement d'applications. Le projet est conçu pour offrir une expérience utilisateur fluide, avec des fonctionnalités de calcul avancées et un affichage dynamique de l'historique des opérations.

## Fonctionnalités Principales

- **Opérations de base** : Addition, soustraction, multiplication, division.
- **Gestion avancée des opérateurs** : Évite les doublons d’opérateurs et ajuste les opérations en cours pour une précision optimale.
- **Historique des opérations** : Enregistre et affiche les calculs précédents.
- **Effets visuels et animations** : Transitions et opacité pour une expérience utilisateur fluide.
- **Interface responsive** : Adaptée à toutes les tailles d'écran.

## Technologies Utilisées

- **HTML5** pour la structure de la page et l'organisation des éléments.
- **CSS3** pour la stylisation, les animations, et la responsivité.
- **JavaScript** pour la logique de calcul et la gestion de l’interaction utilisateur.

## Aperçu du Projet

### Interface de l'application

Le projet présente une calculatrice avec un design centré, une barre d'historique de calcul et des boutons stylisés pour une interaction intuitive. Le CSS apporte un fond en dégradé et une disposition des boutons inspirée des calculatrices modernes.

### Code et Structure

#### Fichier HTML

L'HTML structure l'application en plusieurs sections principales :

- **Conteneur de l'affichage (`#display-container`)** :
    ```html
    <div id="display-container">
      <span id="operation-history"></span>
      <input type="text" id="display" readonly value="0">
    </div>
    ```
    Ce conteneur inclut `#operation-history` pour afficher l’opération en cours et `#display` pour montrer le résultat.

- **Clavier de la calculatrice (`#keys`)** :
    ```html
    <div id="keys">
      <button onclick="clearOrDelete()" id="clear-btn" class="function-btn">AC</button>
      <button onclick="toggleSign()" class="function-btn">+/-</button>
      <button onclick="appendToDisplay('%')" class="function-btn">%</button>
      <button onclick="appendToDisplay('÷')" class="operator-btn">÷</button>
      <!-- Nombre et opérateurs -->
      <button onclick="appendToDisplay('7')">7</button>
      <button onclick="calculate()" class="operator-btn">=</button>
    </div>
    ```

#### Logique en JavaScript

Le JavaScript gère l'interaction utilisateur et la logique de calcul. Voici les principales fonctions :

- **Affichage et manipulation de l’affichage** :
    ```javascript
    function appendToDisplay(input) {
      if (isOperatorOrPercent(input) && isOperatorOrPercent(display.value.slice(-1))) {
          display.value = display.value.slice(0, -1) + input;
      } else {
          display.value += input;
      }
    }
    ```
    Cette fonction permet d'ajouter des chiffres ou des opérateurs tout en gérant les cas particuliers d'opérateurs consécutifs.

- **Calcul des opérations (`calculate`)** :
    ```javascript
    function calculate() {
      try {
          let result = eval(display.value.replace(/,/g, '.').replace(/÷/g, '/').replace(/×/g, '*'));
          display.value = formatNumber(result.toString().replace('.', ','));
      } catch (error) {
          display.value = 'Error';
      }
    }
    ```
    Cette fonction effectue les calculs en utilisant `eval` après avoir transformé les symboles pour les adapter à la syntaxe JavaScript.

#### Stylisation en CSS

Les styles sont créés pour rendre l’interface agréable et moderne. Voici un aperçu des classes principales utilisées :

- **Styles des boutons** :
    ```css
    button {
      width: 70px;
      height: 70px;
      border-radius: 35px;
      background-color: hsl(30, 9%, 10%);
      font-size: 1.8rem;
    }

    .operator-btn {
      background-color: hsl(35, 100%, 50%);
    }
    ```

- **Effets de flou** : Les classes `#display.exceeded` et `#operation-history.exceeded` appliquent un effet de flou progressif pour indiquer un débordement de texte.

## Guide d'Utilisation

1. **Lancer le projet** : Ouvrez `index.html` dans un navigateur.
2. **Saisir des calculs** : Utilisez les boutons pour entrer des chiffres et des opérateurs.
3. **Effacer l'entrée** : Appuyez sur `AC` pour réinitialiser le champ d'affichage.
4. **Afficher l'historique** : Appuyez sur le bouton de menu pour ouvrir le panneau d'historique et voir les calculs précédents.

## Améliorations Futures

Ce projet est encore en développement et plusieurs fonctionnalités pourraient être ajoutées :

- **Calculs scientifiques** : Fonctions avancées comme les exponentielles, les racines carrées, etc.
- **Mode sombre/clair** : Pour un meilleur confort visuel en fonction des préférences de l’utilisateur.
- **Stockage des calculs** : Enregistrement de l'historique dans le `localStorage` pour le conserver après une fermeture de l’application.

## Objectif du Projet

Ce projet a été réalisé pour pratiquer et illustrer des compétences en développement front-end, notamment en JavaScript et en design d'interface utilisateur. Il reflète mon intérêt pour les expériences utilisateur soignées et les interfaces interactives.

## Contact

Pour toute question ou suggestion, n'hésitez pas à me contacter via mon profil GitHub ou LinkedIn.

---
