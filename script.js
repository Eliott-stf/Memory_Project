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

    //Etapes de démarage 
    //TODO: Plus tard, récupération et affichage du hi-score

    //Implementer les clicks sur les boutons fixes : elBtnResetScore, elBtnPlayAgain

    //Ecouteur de click sur elBtnResetScore
    elBtnResetScore.addEventListener("click", function () {
        //TODO: Effacer le hi-score de la "mémoire"

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
        /*<div class="card">
                <!--div.card-back+div.card-img -->
                <div class="card-back"></div>
                <div class="card-img" style="background-image:url('img/1.png')"></div>
            </div>
        */
        const elCard = document.createElement('div');
        elCard.classList.add('card');

        //On fabrique l'intérieur de elCard
        let cardInnerHTML = '<div class="card-back"></div>';
        cardInnerHTML += ` <div class="card-img" style="background-image:url('img/${numCard}.png')"></div>`;
        elCard.innerHTML = cardInnerHTML;

        //TODO: Event listener pour le clic de la carte TEMPORAIRE
        elCard.addEventListener('click', function () {
            elCard.classList.toggle('flipped');
        })




        return elCard;


    }


    //Creer une fonction pour réinitialiser l'interface graphique
    function initGame() {
        console.log('Initialisation du jeu');
        //Remise a zero du current score 
        elCurrentScore.textContent = 0;

        //Remise a zero du final score
        elFinalScore.textContent = '';

        //vidange du deck
        elDeck.innerHTML = '';

        //Generation aléatoire d'une liste de nombre en double (numéro des cartes par paire)
        for (let i = 1; i <= 12; i++) {
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
        let uneCarte = getCardDom(5);
        elDeck.append(uneCarte);


    }



    //Initialisation du jeu
    initGame();


}

//Mise ne place d'un ecouteur pour ne lancer le code que lorsque le navigateur a terminé de fabrgiquer le DOM
document.addEventListener('DOMContentLoaded', handlerDomContentLoaded);