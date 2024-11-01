// Récupération des éléments HTML pour manipulations dans le script
const display = document.getElementById("display");
const clearText = document.getElementById("clear-text");
const clearIcon = document.getElementById("clear-icon");
const operationHistory = document.getElementById("operation-history");
const historyPanel = document.getElementById("history-panel");
const historyList = document.getElementById("history-list");
const historyDate = document.getElementById("history-date");

// Variables de contrôle de l'état de la calculatrice
let isClear = true;
let isNewOperation = true;
let lastResult = null;
let clearHoldTimeout;
let isResultDisplayed = false;


// Initialisation de la date d'historique
function setTodayDate() {
  const today = new Date();
  const formattedDate = `Today - ${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  historyDate.textContent = formattedDate;
}
setTodayDate();

// Ajout d'une opération dans le panneau d'historique
function addToHistory(operation, result) {
  operation = operation.replace(/\*/g, '×');
  const historyItem = document.createElement("li");
  const operationElement = document.createElement("span");
  operationElement.className = "operation";
  operationElement.textContent = operation;
  const resultElement = document.createElement("span");
  resultElement.className = "result";
  resultElement.textContent = result;

  historyItem.appendChild(operationElement);
  historyItem.appendChild(resultElement);
  historyList.insertBefore(historyItem, historyList.firstChild); // Insère l’élément sans trait supplémentaire
}

// Fonction de validation pour opérateur ou pourcentage
function isOperatorOrPercent(char) {
  return ['+', '-', '×', '÷', '%'].includes(char);
}




// Fonction d'ajout d'input au display principal
function appendToDisplay(input) {
  // Empêche l'utilisation directe de "=" ou "+/-" si le display est vide ou "0"
  if ((input === "=" || input === "+/-") && (display.value === '0' || display.value === '')) {
      return;
  }

  // Si un opérateur est pressé après un calcul, utilise le dernier résultat et ajoute l'opérateur
  if (isResultDisplayed && isOperatorOrPercent(input)) {
      display.value = lastResult + input;
      operationHistory.textContent = lastResult; // Affiche le dernier résultat comme opération précédente
      isNewOperation = false;
      isResultDisplayed = false;
  } 
  // Si une virgule est pressée après un résultat, ajoute une virgule
  else if (isResultDisplayed && input === ',') {
      display.value = lastResult + ',';
      operationHistory.textContent = lastResult;
      isNewOperation = false;
      isResultDisplayed = false;
  }
  // Si un chiffre est pressé après un calcul, commence une nouvelle opération sans "lastResult"
  else if (isResultDisplayed && !isOperatorOrPercent(input)) {
      display.value = input;
      operationHistory.textContent = lastResult;
      isNewOperation = false;
      isResultDisplayed = false;
  }
  // Si un opérateur est saisi en première position, commence avec "0" suivi de l'opérateur
  else if (isNewOperation && isOperatorOrPercent(input)) {
      display.value = '0' + input;
      operationHistory.textContent = ''; // Réinitialise l'opération précédente
      isNewOperation = false;
  }
  // Remplace le zéro initial si un chiffre est pressé en premier
  else if (display.value === '0' && !isOperatorOrPercent(input) && input !== ',') {
      display.value = input;
      isNewOperation = false;
  }
  // Empêche les opérateurs consécutifs en remplaçant le dernier opérateur
  else if (isOperatorOrPercent(input)) {
      if (isOperatorOrPercent(display.value.slice(-1))) {
          display.value = display.value.slice(0, -1) + input;
      } else {
          display.value += input;
      }
  }
  // Gère l'ajout de "0" après un opérateur
  else if (input === '0' && isOperatorOrPercent(display.value.slice(-1))) {
      display.value += input;
  }
  // Gère l'ajout d'une virgule après un opérateur pour un nombre décimal
  else if (input === ',' && isOperatorOrPercent(display.value.slice(-1))) {
      display.value += '0,';
  }
  // Gère l'ajout d'une seule virgule dans les nombres décimaux
  else if (input === ',') {
      const lastNumber = display.value.split(/[\+\-\×\÷]/).pop();
      if (!lastNumber.includes(',')) {
          display.value += input;
      }
  }
  // Continue à ajouter les chiffres normalement
  else {
      display.value += input;
  }

  // Met à jour les variables d'état après l'ajout d'un opérateur
  isNewOperation = false;
  isResultDisplayed = false;

  // Met à jour l'affichage et le format du display
  display.value = formatNumber(display.value.replace(/\./g, ','));
  updateDisplayScroll();
  toggleClearIcon();
  adjustFontSize();
  updateBlurEffect();
}


// Gestion du bouton Clear et AC
function clearOrDelete(event) {
  if (isResultDisplayed) {
      // Efface tout immédiatement après un calcul
      clearDisplay();
  } else if (event.type === "mousedown") {
      // Initialise le minuteur pour un appui long afin d'activer AC
      clearHoldTimeout = setTimeout(() => {
          clearDisplay(); // Active AC pour effacer tout
          clearHoldTimeout = null; // Réinitialise pour éviter les doublons
      }, 500);
  } else if (event.type === "mouseup") {
      // Annule le délai de Clear si l’appui est court
      if (clearHoldTimeout) {
          clearTimeout(clearHoldTimeout);
          clearHoldTimeout = null;
          deleteLastCharacter();
      }
  }
}



// Associer les événements mousedown et mouseup au bouton Clear
const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("mousedown", clearOrDelete);
clearBtn.addEventListener("mouseup", clearOrDelete);


// Fonction pour basculer le panneau d'historique
function toggleHistoryPanel() {
  historyPanel.classList.toggle("show");
  if (historyPanel.classList.contains("show")) {
    historyPanel.scrollTop = 0; // Réinitialise le défilement en haut
    historyPanel.classList.remove("expand");
    setTimeout(() => historyPanel.classList.add("slide-in"), 50);
  } else {
    historyPanel.classList.remove("slide-in", "expand");
  }
}


let scrollTimeout;
historyPanel.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (!historyPanel.classList.contains("expand")) {
      historyPanel.classList.add("expand");
    }
  }, 100);
});


// Réinitialise l'affichage principal
function clearDisplay() {
  // Remet à zéro complètement le display et l'opération
  display.value = '0';
  operationHistory.textContent = '';
  isNewOperation = true;
  lastResult = null;
  isResultDisplayed = false; // Reset le flag du résultat affiché

  toggleClearIcon(true);
  updateBlurEffect();
}


// Supprime le dernier caractère
function deleteLastCharacter() {
  if (display.value.length > 1) {
      display.value = display.value.slice(0, -1);
  } else {
      display.value = '0'; // Affiche 0 si tous les caractères sont supprimés
      isNewOperation = true; // Marque comme nouvelle opération pour écraser le 0 au prochain chiffre
  }

  // Actualise l'état du bouton "Clear" ou "AC" selon le contenu
  toggleClearIcon(display.value === '0');
}


// Active/désactive l'icône Clear
function toggleClearIcon(isReset) {
  if (isReset) {
    clearText.style.display = 'inline';  // Affiche "AC"
    clearIcon.style.display = 'none';    // Cache l'icône Clear
    isClear = true;
  } else {
    clearText.style.display = 'none';    // Cache "AC"
    clearIcon.style.display = 'inline';  // Affiche l'icône Clear
    isClear = false;
  }
}


// Gère le signe +/- pour les nombres négatifs
function toggleSign() {
  // Vérifie si le display ne contient que "0", auquel cas aucune action n'est effectuée
  if (display.value === '0' || display.value.trim() === '') {
      return; // Ne fait rien si "+/-" est appuyé sans valeur
  }

  if (display.value.startsWith("(-") && display.value.endsWith(")")) {
      display.value = display.value.slice(2, -1); // Enlève les parenthèses pour un nombre négatif
  } else if (!display.value.startsWith("(-")) {
      display.value = `(-${display.value})`; // Ajoute des parenthèses pour indiquer un nombre négatif
  }
}


// Calcul principal avec traitement des erreurs
function calculate() {
  if (display.value === '0' || display.value.trim() === '') {
      return;
  }

  try {
      // Sauvegarde de l'opération en cours pour l'afficher dans `operationHistory`
      const currentOperation = display.value.replace(/\s/g, '').replace(/,/g, '.').replace(/÷/g, '/').replace(/×/g, '*');
      
      // Affiche l'opération en cours dans `operationHistory`
      operationHistory.textContent = display.value;

      // Calcul du résultat
      let result = eval(currentOperation);

      // Vérifie la division par zéro pour éviter "Infinity"
      if (!isFinite(result)) {
          display.value = 'Undefined';
      } else {
          // Arrondi pour éviter les erreurs de virgule flottante
          result = Math.round(result * 1000000000000) / 1000000000000;
          display.value = formatNumber(result.toString().replace('.', ','));
      }
      
      // Ajoute l'opération et le résultat dans l'historique
      addToHistory(currentOperation.replace(/\*/g, '×').replace(/\//g, '÷'), display.value);

      // Met à jour les variables d'état
      lastResult = display.value;
      isNewOperation = true;
      isResultDisplayed = true;

  } catch (error) {
      display.value = 'Error';
  }

  // Met à jour l'affichage et l'interface
  toggleClearIcon(true);
  adjustFontSize();
  updateBlurEffect();
}


// Formate le nombre avec des espaces pour les milliers
function formatNumber(value) {
  value = value.toString().replace(/\s/g, '');
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}


// Ajuste le défilement si le texte dépasse
function updateDisplayScroll() {
  if (display.scrollWidth > display.clientWidth) {
    display.scrollLeft = display.scrollWidth - display.clientWidth;
  }
  adjustFontSize();
}


// Ajuste la taille de police selon la largeur du texte
function adjustFontSize() {
  const maxFontSize = 48;
  const minFontSize = 20;
  display.style.fontSize = `${maxFontSize}px`;

  while (display.scrollWidth > display.clientWidth && parseInt(display.style.fontSize) > minFontSize) {
    display.style.fontSize = `${parseInt(display.style.fontSize) - 1}px`;
  }
}


// Effet de flou si le texte dépasse
function updateBlurEffect() {
  // Effet de flou sur le display si le texte dépasse
  if (display.scrollWidth > display.clientWidth) {
    display.classList.add("exceeded");
  } else {
    display.classList.remove("exceeded");
  }

  // Effet de flou sur l'opération précédente si le texte dépasse
  if (operationHistory.scrollWidth > operationHistory.clientWidth) {
    operationHistory.classList.add("exceeded");
  } else {
    operationHistory.classList.remove("exceeded");
  }
}

// Appelle la fonction de mise à jour au démarrage et lors des changements
updateBlurEffect();



// Fonction pour le pop-up de la calculatrice
function openCalculatorApp() {
  const overlay = document.getElementById("overlay");
  
  document.getElementById("feature-popup").classList.add("show");
  document.getElementById("feature-popup").style.display = "block";
  
  overlay.style.display = "block";
  overlay.style.zIndex = "999";  // Ramène l'overlay au premier plan
  overlay.style.pointerEvents = "auto";  // Réactive les interactions avec l'overlay uniquement lorsque visible
}



// Ferme le pop-up et l'overlay
function closePopup() {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("feature-popup");
  
  popup.classList.remove("show");
  popup.style.display = "none";
  
  overlay.style.display = "none";
  overlay.style.zIndex = "-1";  
  overlay.style.pointerEvents = "none";  
}

// Ferme le pop-up quand on clique sur l'overlay
document.getElementById("overlay").addEventListener('click', closePopup);




window.addEventListener('click', function(event) {
  if (event.target.id === 'feature-popup') {
      closePopup();
  }
});
