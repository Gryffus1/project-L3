import * as model from "./model.js";
import view from "./view.js";

let timerGame;
const scoreMax = 3000;

const controlRestart = function () {
  // Rest Variables
  model.state.currentHoles = ["", "", "", ""];
  model.state.hiddenColors = ["", "", "", ""];
  model.state.numWhitePoints = 0;
  model.state.numRedPoints = 0;
  model.state.currentLine = 1;
  model.state.selectColor = "red"; 

  // reset le jeu
  view.clearBoard();

  // Reset les points
  view.clearPoints();

  //cacher les couleurs secretes
  view.revealHiddenColors(false);

  //creer nouvelles couleurs
  model.generateHiddenColors();
  view.renderHiddenColors(model.state.hiddenColors);

  // mise en lumière de la ligne de jeu
  view.highlightCurrentline(model.state.currentLine);

  // mise en lumière de la couleur sélectioné
  view.highlightSelectColor(model.state.selectColor);

  // (Re)start le timer
  if (timerGame) clearInterval(timerGame);
  timerGame = startTimer();

  // Render score
  model.state.score = scoreMax;
  view.renderScore(model.state.score);

  // cacher win et lose
  view.renderWin(false);
  view.renderGameOver(false);
};

const controlColors = function (color) {
  model.state.selectColor = color;
  view.highlightSelectColor(model.state.selectColor);
};

const controlHoles = function (hole) {
  model.state.currentHoles[hole] = model.state.selectColor;
};

const controlCheck = function () {
  if (!model.checkIfCurrentLineFull()) return;

  model.calculatePoints();
  view.renderPoints(model.state);

  if (model.state.numRedPoints === 4) {
    model.state.currentLine = 100;

    view.revealHiddenColors(true);
    view.renderWin(true, model.state.score, model.state.savedScores);

    clearInterval(timerGame);

    model.saveScore();
  } else if (model.state.currentLine === 10) {
    model.state.currentLine = 100;

    view.revealHiddenColors(true);
    view.renderGameOver(true);

    clearInterval(timerGame);
  } else {
    model.state.currentLine++;

    if (model.state.score !== 0) model.state.score -= 100;
    if (model.state.score < 0) model.state.score = 0;

    view.highlightCurrentline(model.state.currentLine);
    model.state.currentHoles = ["", "", "", ""];
  }
};

const startTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //remise à jour du temps régulière
    view.renderTime(min, sec);
    time++;

    // Update score
    if (model.state.score !== 0) model.state.score -= 1;
    if (model.state.score < 0) model.state.score = 0;
    view.renderScore(model.state.score);
  };

  //Set Timer to 0s
  let time = 0;

  //Call the time every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const init = function () {
  view.addHandlerRestart(controlRestart);
  view.addHandlerCheck(controlCheck);
  view.addHandlerColors(controlColors);
  view.addHandlerHoles(controlHoles);
};
init();

const goose = document.getElementById('goose');
let x = Math.random() * (window.innerWidth - 100);
let y = Math.random() * (window.innerHeight - 100);
let dx = (Math.random() - 0.5) * 4;
let dy = (Math.random() - 0.5) * 4;
let facingRight = true;
let isVisible = true;
let disappearTimer = null;
let lastX, lastY;
let disappearCount = 0;
let pulledImages = []; // Tableau pour stocker les images tirées

const randomImages = [
    '/images/images_aléatoires_Manchots/1200px-Falkland_Islands_Penguins_88.jpg',
    '/images/images_aléatoires_Manchots/baby_emperor_penguin_by_laogephoto_d6094yj-pre.jpg',
    '/images/images_aléatoires_Manchots/Emperor_Penguin_Manchot_empereur.jpg',
    '/images/images_aléatoires_Manchots/lG.gif',
    '/images/images_aléatoires_Manchots/manchots_O23527.jpg',
    '/images/images_aléatoires_Manchots/Penguin_in_Antarctica_jumping_out_of_the_water.jpg',
    '/images/images_aléatoires_Manchots/penguin-56101_1280.jpg', 
    '/images/images_aléatoires_Manchots/penguin-2104173_1280.jpg',
];

function moveGoose() {
    if (!isVisible) {
        requestAnimationFrame(moveGoose);
        return;
    }

    // Mouvement aléatoire : change de direction occasionnellement
    if (Math.random() < 0.02) {
        dx = (Math.random() - 0.5) * 4;
        dy = (Math.random() - 0.5) * 4;
        facingRight = dx > 0;
        goose.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
    }

    x += dx;
    y += dy;

    updatePulledImages();

    // Vérifie si elle sort de l'écran
    if (x < -100 || x > window.innerWidth || y < -100 || y > window.innerHeight) {
        lastX = x;
        lastY = y;
        disappear();
    } else {
        goose.style.left = x + 'px';
        goose.style.top = y + 'px';
    }

    requestAnimationFrame(moveGoose);
}

function updatePulledImages() {
    pulledImages.forEach((img, index) => {
        // Positionne l'image légèrement derrière le manchot, comme si le manchot traînait l'image
        const offsetX = facingRight ? -60 : 110; // Derrière selon la direction
        const offsetY = 20; // Légèrement en bas
        img.style.left = (x + offsetX) + 'px';
        img.style.top = (y + offsetY) + 'px';
    });
}

function disappear() {
    isVisible = false;
    goose.style.display = 'none';
    disappearCount++;
    const disappearTime = 1000 + Math.random() * 2000;
    disappearTimer = setTimeout(() => {
        respawn();
    }, disappearTime);
}

function respawn() {
    isVisible = true;
    goose.style.display = 'block';
    x = lastX;
    y = lastY;
    dx = -dx;
    dy = -dy;
    facingRight = dx > 0;
    goose.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
    goose.style.left = x + 'px';
    goose.style.top = y + 'px';

    // Toutes les 3 disparitions, tire une nouvelle image
    if (disappearCount % 3 === 0 && randomImages.length > 0) {
        pullRandomImage();
    }
}

function pullRandomImage() {
    if (pulledImages.length >= 5) {
        const oldest = pulledImages.shift();
        oldest.remove();
    }

    const randomIndex = Math.floor(Math.random() * randomImages.length);
    const newImg = document.createElement('img');
    newImg.src = randomImages[randomIndex];
    newImg.className = 'pulled-image';
    newImg.alt = 'Pulled Image';
    document.body.appendChild(newImg);
    pulledImages.push(newImg);


    updatePulledImages();

    // Faire disparaître l'image après 10 secondes
    setTimeout(() => {
        const index = pulledImages.indexOf(newImg);
        if (index > -1) {
            pulledImages.splice(index, 1);
            newImg.remove();
        }
    }, 10000); // 10 secondes
}


moveGoose();


// Gestion du redimensionnement
window.addEventListener('resize', () => {
    if (isVisible) {
        x = Math.min(x, window.innerWidth - 100);
        y = Math.min(y, window.innerHeight - 100);
        updatePulledImages();
    }
});

let tourActuel = 0;  // Compteur de tours (1 à 10)
let toursAlertes = new Set();  // Ensemble pour stocker les 3 tours aléatoires

// Tableau des messages d'alerte 
const messagesAlertes = [
  "Les ailes du Manchot sont adaptées pour nager, pas pour voler !",
  "Certains manchots nagent à 35 km/h sous l’eau !",
  "Les Manchots survivent à des températures de -60°C grâce à leur graisse et leurs plumes denses.",
  "La plupart des espèces de Manchots restent fidèles à leur partenaire pendant une saison de reproduction.",
  "Le manchot empereur peut plonger jusqu’à 500 mètres de profondeur !",
  "Les Manchots marchent en file indienne pour économiser de l’énergie et se protéger du vent. !",
  "Chaque manchot a un motif de taches unique sur le ventre, comme une empreinte digitale.",
  "Certains manchots utilisent des cailloux pour construire leurs nids, qu’ils volent parfois entre eux.",
  "Le corp des manchots s’adapte pour résister à la pression lors de plongées profondes.",
  "Il existe 18 espèces de manchots, toutes dans l’hémisphère sud."
];

// Génère 3 numéros uniques aléatoires entre 1 et 10
while (toursAlertes.size < 3) {
  toursAlertes.add(Math.floor(Math.random() * 10) + 1);
}

document.querySelector('.btn--check').addEventListener('click', function() {
  tourActuel = (tourActuel % 10) + 1;  // Incrémente le tour (1-10, puis boucle)

  if (toursAlertes.has(tourActuel)) {
    setTimeout(() => {
      // Sélectionne un message aléatoire
      const messageAleatoire = messagesAlertes[Math.floor(Math.random() * messagesAlertes.length)];
      alert(messageAleatoire);
    }, 100);  // Petit délai
  }
});