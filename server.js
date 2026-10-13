const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques (CSS, JS, Images) depuis le dossier src si nécessaire
app.use(express.static(path.join(__dirname)));

// Servir index.html quand on va à la racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`KLAUS SERVER RUNNING ON PORT ${PORT}`);
});
