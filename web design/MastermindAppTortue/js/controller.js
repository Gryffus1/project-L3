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
    '/images/images_aléatoires_Tortue/_ copie 2.jpeg',
    '/images/images_aléatoires_Tortue/_ copie 3.jpeg',
    '/images/images_aléatoires_Tortue/_ copie.jpeg',
    '/images/images_aléatoires_Tortue/_.jpeg',
    '/images/images_aléatoires_Tortue/Tortoise.jpeg',
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
        // Positionne l'image légèrement derrière la tortue, comme si la tortue traînait l'image
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
  "Certaines tortues peuvent vivre plus de 150 ans, comme la tortue géante des Galápagos. !",
  "Certaines tortues aquatiques peuvent respirer par leur cloaque (leur petites fesses...)",
  "La carapace des tortues est innervée et sensible au toucher..",
  "Les tortues n’ont pas de dents, mais un bec corné pour broyer leur nourriture.",
  "Il existe plus de 300 espèces de tortues, terrestres, aquatiques ou marines !",
  "Les tortues marines parcourent des milliers de kilomètres pour pondre sur leur plage natale !",
  "La température du nid détermine le sexe des bébés tortues (chaud = femelle, frais = mâle)",
  "Certaines tortues terrestres hibernent en s’enterrant pour échapper au froid.",
  "Les tortues communiquent par des sons, des vibrations et des mouvements de tête.",
  "La tortue luth peut peser jusqu’à 700 kg et mesurer 2 mètres de long."
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