//L'objet littéral respecte le format JSPON
//- Pas de commentaire
//- Clés délimitées par des " "
//- Valeur de type String délimitées par des " "
const selectMode = document.getElementById('select-mode');
const selectTheme = document.getElementById('select-theme');
const gameConfig = {
    "distinctCards": selectMode.value,
    "timerDelay": 1000,
    "themes": [
        {"slug": "default", "displayName": "Nuages"},
        {"slug": "pluie", "displayName": "Pluie"}
    ]
};