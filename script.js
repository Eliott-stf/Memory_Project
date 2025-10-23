console.log("Script loaded");

function handlerDomContentLoaded() {
    //On récupere dans le DOM les éléments avec lequels on souhaite intéragir 
    const elHiScore = document.getElementById('hi-score');
    const elBtnResetScore = document.getElementById('btn-reset-score');
    const elCurrentScore = document.getElementById('current-score');
    const elDeck = document.getElementById('deck');
    const elFinalScore = document.getElementById('final-score');
    const elModalWin = document.getElementById('modal-win');
    const elBtnPlayAgain = document.getElementById('btn-play-again');
    const elBtnSettings = document.getElementById('btn-settings');
    const elBtnSettingsCancel = document.getElementById('btn-settings-cancel');
    const elBtnSettingsOk = document.getElementById('btn-settings-ok');
    const elModalSettings = document.getElementById('modal-settings')
    

    /* On peut declarer plusieurs constantes avec le meme "const"
    Ex: const TOTO = 5, truc = 10, baba =10;
    On peut l'ecrire de manière plus jolie :
    const
        TOTO = 5,
        truc = 10,
        baba = 10;
    */


    //Les variables de fonctionnement du jeu
    let arrNumCards = [];

    //Reglage du jeu sur le config.js


    //Objet litteral qui contient les infos de l'état actuel de la partie
    const gameState = {
        arrFound: [],   //Liste des numéros déja découverts
        arrFlipped: [], //Liste temporaire des cartes retournées pendant une tentative
        canPlay: true, //Flag qui empeche le clic sur la carte de fonctionner
        tries: 0, //Nombre de tentative de la partie en cours
        hiScore: 0, //Le High-Score actuel : 0 signifira qu'il n'y en a pas encore
        timer: null, //Timer de retournemnet des cartes non matchées 
    };

    //Etapes de démarage 
    //Récupération et affichage du hi-score
    const storeHiScore = localStorage.getItem('memory-game-hiscore');
    //s'il n'en existe pas, on le creer dans le stockage du navigateur 
    if (storeHiScore === null) {
        localStorage.setItem('memory-game-hiscore', gameState.hiScore);
    }
    //Sinon on met a jour le gameState
    else {
        gameState.hiScore = parseInt(storeHiScore, 10);
    }

    //afficher le hi-score
    elHiScore.textContent = gameState.hiScore > 0 ? gameState.hiScore : 'Aucun'


    //Implementer les clicks sur les boutons fixes : elBtnResetScore, elBtnPlayAgain, .....

    //Ecouteur de click sur elBtnSettings
    elBtnSettings.addEventListener('click', function () {
        //On retire la classe hidden
        elModalSettings.classList.remove('hidden');
    })


    //Ecouteur de click sur elBtnSettingsCancel
    elBtnSettingsCancel.addEventListener('click', function () {
        //On retire la classe hidden
        elModalSettings.classList.add('hidden');
    })


    //Ecouteur de click sur elBtnSettingsOk
    elBtnSettingsOk.addEventListener('click', function () {
        //Réinitialise en fonction du choix sur la modale
        initGame();
        //On retire la classe hidden
        elModalSettings.classList.add('hidden');
    })

    //Ecouteur de click sur elBtnResetScore
    elBtnResetScore.addEventListener("click", function () {
        //Effacer le hi-score de la "mémoire"
        localStorage.removeItem('memory-game-hiscore');

        //On réinitialise l'affichage
        elHiScore.textContent = 'Aucun';
    });

    //Ecouteur de click sur elBtnPlayAgain
    elBtnPlayAgain.addEventListener("click", function () {
        //On cache la modale de victoire
        elModalWin.classList.add('hidden');

        //on réintialise le jeu
        initGame();
    });

    //Fonction utilitaire de mélange aléatoire d'un tableau
    function shuffleArray(arr) {
        //On récupère l'index max de arr
        let idMax = arr.length - 1;

        //Boucle de lecture inversée de arr
        while (idMax > 0) {
            //Géneration d'un index aléatoire de 0 a (idMax -1)
            let idRandom = Math.floor(Math.random() * idMax);

            //On récupère les valeurs associées aux 2 indices 
            let valueAtMax = arr[idMax];
            let valueAtRandom = arr[idRandom];

            //On echange les places des 2 valeurs dans le tableau 
            arr[idMax] = valueAtRandom;
            arr[idRandom] = valueAtMax;
            //Forme courte, moins lisible 
            //On donne a gauche une liste de position dans le tableau
            //et a droite la liste des valeur dans le meme ordre a associer
            // [arr[idMax], arr[idRandom]] = [valueAtRandom, valueAtMax];

            //Décremente l'idMax avec lequel on travaille
            idMax--;
        }
        let idRandom;
    }

 
    //Géneration du DOM d'une carte
    function getCardDom(numCard) {
        /*<div class="card" data-num="1">
                <!--div.card-back+div.card-img -->
                <div class="card-back"></div>
                <div class="card-img" style="background-image:url('img/1.png')"></div>
            </div>
        */
        const elCard = document.createElement('div');
        elCard.classList.add('card');
        elCard.dataset.numCard = numCard;

        //On fabrique l'intérieur de elCard
        let cardInnerHTML = ` <div class="card-back" style="background-image:url('./themes/default/img/back.png')"></div> `;
        cardInnerHTML += ` <div class="card-img" style="background-image:url('./themes/default/img/${numCard}.png')"></div> `;
        elCard.innerHTML = cardInnerHTML;

        // Event listener pour le clic de la carte 
        elCard.addEventListener("click", handlerCardClick)

        return elCard;
    }


    //Creer une fonction pour réinitialiser l'interface graphique
    function initGame() {
        console.log('Initialisation du jeu');

        //Remise a zero du current score 
        gameState.tries = 0;

        elCurrentScore.textContent = gameState.tries;

        //Remise a zero du final score
        elFinalScore.textContent = '';

        //Remise a zero de la liste des paires trouvées
        gameState.arrFound = [];

        //On vide la liste des cartes
        arrNumCards = [];

        //vidange du deck
        elDeck.innerHTML = '';

        //afficher le hi-score
        elHiScore.textContent = gameState.hiScore > 0 ? gameState.hiScore : 'Aucun'

        //Generation aléatoire d'une liste de nombre en double (numéro des cartes par paire)
        for (let i = 1; i <= selectMode.value; i++) {
            //On ajoute 2 fois le i a la fin du tableau de nombres
            arrNumCards.push(i, i);
        }

        //liste avant mélange
        console.log(arrNumCards);

        //On mélange les nombres de la liste
        shuffleArray(arrNumCards);

        //Après mélange
        console.log(arrNumCards);

        //On parcours la liste pour fabriquer les cartes et les afficher 
        //Boucle pour parcourir un tableau dans son intégralité => for(... ; .... ; ...)
        //for (let i = 0; i < arrNumCards.length; i++) {
        //    console.log(arrNumCards[i] );
        //}
        //Boucle pour parcourir un tableau dans son intégralité => for(.. in ..)
        //for(let i in arrNumCards){
        //    console.log(i);  
        //}
        //Boucle pour parcourir un tableau dans son intégralité => for (.. of ..)
        for (let numCard of arrNumCards) {
            const elCard = getCardDom(numCard);
            elDeck.append(elCard);
        }
        //Boucle pour parcourir un tableau dans son intégralité => Array.forEach()
        //arrNumCards.forEach(numCard => {console.log(numCard);})


    }

    //Gestionnaire de clic d'une carte
    function handlerCardClick() {
        //Technique de "early return":
        //On sort de la fonction si on n'a plus besoin d'exécuter la suite du code 
        //On limite l'emboitement de plusieur niveau d'indentation typiquement géneré par des blocs if ... else
        //si on a pas le droit de retourner les cartes OU la carte cliquée est deja retounrée, on sort
        if (!gameState.canPlay || this.classList.contains('flipped')) return; //Accolades optionnelles lorsque l'on n'a qu'une seule instruction

        //on réinitialise le timer
        clearTimeout(gameState.timer);

        //On retourne la carte cliquée
        this.classList.add('flipped');

        //Si on n'a pas déja retourné une carte (c'est arrFlipped est vide)
        if (!gameState.arrFlipped.length > 0) {
            //On ajoute l'élément de la carte dans arrFlipped et on sort
            gameState.arrFlipped.push(this);
            return;
        }
        //Sinon on continue
        //on incrémente le score
        gameState.tries++;
        //On met a jour elCurrentScore
        elCurrentScore.textContent = gameState.tries;

        //On récupère les numéros des 2 cartes 
        const numCard1 = gameState.arrFlipped[0].dataset.numCard
        const numCard2 = this.dataset.numCard;

        //Si les 2 cartes sont identiques 
        if (numCard1 === numCard2) {
            //On ajoute le numéro de la carte dans la liste des cartes trouvées 
            gameState.arrFound.push(numCard1)
            //On vide arrFlipped pour la prochaine tentative
            gameState.arrFlipped = [];

            //Si on a pas trouvé toutes les paires
            if (gameState.arrFound.length < selectMode.value) return;

            //sinon GAGNE
            //On met a jour le score final
            elFinalScore.textContent = gameState.tries;
            //on affiche la modale
            elModalWin.classList.remove('hidden');

            //Gestion du high score
            //Si aucun hi-score OU que le nombre de tentatives est meilleur que hi-score
            //=> enregistrement du nouveau hi-score
            //mettre le plus probable en 1er pour de l'économie de performance (ici il faut inversé par exemple)
            //On peut optimiser de la meme manière pour ET, il va pas lire si le premier est 0 (faux)
            if (gameState.hiScore <= 0 || gameState.tries < gameState.hiScore) {
                //On met a jour le gameState
                gameState.hiScore = gameState.tries;
                //On enregistre le nouveau score dans localStorage
                localStorage.setItem('memory-game-hiscore', gameState.hiScore);
            }

            return;
        }


        //sinon on continue
        //On ajoute la carte actuelle à la liste des carte retournées 
        gameState.arrFlipped.push(this);

        //On désactive la possibilité de jouer d'autres cartes
        gameState.canPlay = false;

        // On lance un timer qui remet les cartes en place au bout d'un temps défini
        //Dans une fonction flèche, la convention dit que un argument seul, qui est a coup sur "indefined" doit etre nommé "_"
        gameState.timer = setTimeout(_ => {
            //Pour chaque carte retourné pour cette tentative, on retire la classe
            for (let elCard of gameState.arrFlipped) {
                elCard.classList.remove('flipped');
            }

            //On réactive la possibilité de retourner d'autres cartes
            gameState.canPlay = true;

            //On réinitialise la liste des cartes retournées pour une tentative
            gameState.arrFlipped = [];

        }, gameConfig.timerDelay);

    }


    //Initialisation du jeu
    initGame();


}

//Mise ne place d'un ecouteur pour ne lancer le code que lorsque le navigateur a terminé de fabrgiquer le DOM
document.addEventListener('DOMContentLoaded', handlerDomContentLoaded);