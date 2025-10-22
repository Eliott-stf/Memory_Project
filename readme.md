
# Memory Game

Jeu de memory classique : retourner deux cartes à la fois pour trouver des paires identiques. L'objectif est de trouver toutes les paires en un minimum d'essais. Projet pédagogique simple (HTML/CSS/JS).

## Langages et rôles
- HTML : structure (deck, boutons, modales).
- CSS : styles et animations (retournement de cartes).
- JavaScript : logique du jeu, gestion du DOM et stockage (localStorage).

## Fichiers principaux
- index.html — page principale.
- styles.css — styles et animations.
- script.js — logique et contrôle du jeu.
- config.js — paramètres modifiables du jeu.

## Variables dans config.js
Modifier ces valeurs pour adapter la difficulté/comportement.

- ```distinctCards```  
  Nombre de cartes distinctes — le jeu contient distinctCards * 2 cartes.  
  Exemple : 6 → 12 cartes au total.

- ```timerDelay``` 
  Délai (en millisecondes) pendant lequel deux cartes non appariées restent visibles avant d'être retournées.  
  Exemple : 800 → 0,8 seconde.

Exemple minimal de config.js :
```javascript
// filepath: /home/es_prepa_dev/Documents/HTML_CSS_JV/Memory_Project/config.js
const gameConfig = {
  distinctCards: 6,
  timerDelay: 800
};
```

## Résumé des variables d'état (dans script.js)
- gameState.arrFound : tableau des numéros de paires déjà trouvées.  
- gameState.arrFlipped : cartes actuellement retournées lors d'une tentative (max 2).  
- gameState.canPlay : booléen — empêche les clics pendant les animations.  
- gameState.tries : compteur d'essais (paires tentées).  
- gameState.hiScore : meilleur score stocké.  
- gameState.timer : référence au timeout utilisé pour retourner les cartes non appariées.

## Logique du jeu (bref)
1. initGame() : crée la liste [1,1,2,2,...], la mélange (shuffleArray), génère les éléments DOM (getCardDom) et les ajoute au deck. Réinitialise l'état et l'affichage.  
2. getCardDom(num) : crée l'élément .card, lui associe data-num (num) et ajoute le listener de clic.  
3. handlerCardClick(event) :  
   - Vérifie gameState.canPlay et que la carte n'est pas déjà trouvée/retournée.  
   - Ajoute la carte à arrFlipped et la retourne visuellement.  
   - Si deux cartes sont retournées : incrémente tries, compare les numéros.  
     - Si égal → ajoute à arrFound et garde retournées.  
     - Si différent → bloque les clics (canPlay = false), attend timerDelay puis retourne les cartes et réactive canPlay.  
   - Après chaque paire trouvée, si toutes les paires sont trouvées, affiche la modale de victoire et met à jour le hi-score (localStorage).
