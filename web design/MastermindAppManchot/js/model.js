export const state = {
    existingColors: [
      "red",
      "green",
      "blue",
      "yellow",
      "white",
      "black",
      "pink",
      "orange",
    ],
    selectColor: "",
    currentLine: 1,
    currentHoles: ["", "", "", ""],
    hiddenColors: ["", "", "", ""],
    numWhitePoints: 0,
    numRedPoints: 0,
    score: 0,
    savedScores: [],
  };
  
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };
  
  export const generateHiddenColors = function () {
    state.hiddenColors = state.hiddenColors.map(
      (_) =>
        state.existingColors[getRandomNumber(0, state.existingColors.length - 1)]
    );
  };
  
  export const checkIfCurrentLineFull = function () {
    const lengthLine = state.currentHoles.filter((el) => el !== "").length;
    if (lengthLine === 4) return true;
    else return false;
  };
  
  export const calculatePoints = function () {
    // Calculate Red points
    let restCurrentHoles = [];
    let restHiddenColors = [];
  
    state.currentHoles.forEach((el, i) => {
      if (el === state.hiddenColors[i]) return;
      restCurrentHoles.push(el);
      restHiddenColors.push(state.hiddenColors[i]);
    });
  
    state.numRedPoints = state.currentHoles.length - restCurrentHoles.length;
  
    // Calculer les points blancs
    let countWhitePoints = 0;
    restCurrentHoles.forEach((current) => {
      let done = 0;
      restHiddenColors.forEach((hidden, i) => {
        if (current === hidden && done === 0) {
          countWhitePoints++;
          restHiddenColors.splice(i, 1);
          done = 1;
        }
      });
    });
    state.numWhitePoints = countWhitePoints;
  };
  
  export const saveScore = function () {
    state.savedScores.push(state.score);
    state.savedScores.sort((a, b) => b - a);
    localStorage.setItem("scores", JSON.stringify(state.savedScores));
  };
  
  const getScoresFromLocalStorage = function () {
    const storage = localStorage.getItem("scores");
    if (storage) state.savedScores = JSON.parse(storage);
  };
  getScoresFromLocalStorage();

// Sélectionne la tortue
const tortue = document.getElementById('tortue');

// Déplace la tortue aléatoirement
function deplacerTortue() {
  const x = Math.random() * (window.innerWidth - 100);
  const y = Math.random() * (window.innerHeight - 100);

  tortue.style.left = `${x}px`;
  tortue.style.top = `${y}px`;

  // Change l'animation (GIF) aléatoirement
  const animations = [
    'images/tortue-marchant.gif',
    'images/tortue-glissant.gif',
    'images/tortue-clignant.gif'
  ];
  const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
  tortue.querySelector('img').src = randomAnimation;
}

// Déplace la tortue toutes les 3 secondes
setInterval(deplacerTortue, 3000);

// Réagir aux clics
document.addEventListener('click', (e) => {
  tortue.style.left = `${e.clientX}px`;
  tortue.style.top = `${e.clientY}px`;
  tortue.querySelector('img').src = 'images/tortue-surprise.gif';
});

