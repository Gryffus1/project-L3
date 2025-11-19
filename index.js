
const avatarButtons = document.querySelectorAll('.avatar-button');
const startButton = document.getElementById('startButton');
const avatarDisplay = document.getElementById('avatarDisplay');
const selectedAnimalName = document.getElementById('selectedAnimalName');
const startLink = document.getElementById('startLink');

let selectedAvatar = null;

// Gestion de la sélection d'avatar
avatarButtons.forEach(button => {
    button.addEventListener('click', function() {
        const animal = this.dataset.animal;
        
        // Animation de clic
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 500);
        
        // Retirer la sélection précédente
        avatarButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Ajouter la nouvelle sélection
        this.classList.add('selected');
        selectedAvatar = animal;
        
        // Afficher l'animal sélectionné
        const animalNames = {
            'manchot': '🐧 Manchot',
            'tortue': '🐢 Tortue'
        };
        selectedAnimalName.textContent = animalNames[animal];
        avatarDisplay.classList.add('show');
        
        // Activer le bouton de démarrage
        startButton.disabled = false;

        // Mettre à jour le lien du bouton "Commencer" en fonction de l'avatar
        if (animal === 'manchot') {
            startLink.href = '/MastermindAppManchot/index.html';
        } else if (animal === 'tortue') {
            startLink.href = '/MastermindAppTortue/index.html';
        }
        
        // Sauvegarder le choix (en mémoire pour cette session)
        sessionStorage.setItem('selectedAvatar', animal);
        
        // Effet sonore visuel (vibration du bouton)
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});

// Vérifier si un avatar était déjà sélectionné (par exemple, après un rafraîchissement de page)
const savedAvatar = sessionStorage.getItem('selectedAvatar');
if (savedAvatar) {
    const savedButton = document.querySelector(`[data-animal="${savedAvatar}"]`);
    if (savedButton) {
        savedButton.classList.add('selected');
        selectedAvatar = savedAvatar;
        startButton.disabled = false; // Activer le bouton si un avatar est déjà sélectionné

        const animalNames = {
            'manchot': '🐧 Manchot',
            'tortue': '🐢 Tortue'
        };
        selectedAnimalName.textContent = animalNames[savedAvatar];
        avatarDisplay.classList.add('show');

        // Mettre à jour le lien si un avatar est déjà sélectionné
        if (savedAvatar === 'manchot') {
            startLink.href = '/MastermindAppManchot/index.html';
        } else if (savedAvatar === 'tortue') {
            startLink.href = '/MastermindAppTortue/index.html';
        }
    }
}

// Animation au clic du bouton Commencer
startButton.addEventListener('click', function(e) {
    if (!this.disabled) {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    }
});