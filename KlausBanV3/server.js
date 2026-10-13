const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Servir les fichiers statiques (CSS, JS, images) depuis le dossier racine
app.use(express.static(path.join(__dirname)));

// 2. Servir index.html explicitement quand on va à la racine /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Écoute du serveur
app.listen(PORT, () => {
    console.log(`KLAUS BAN V3 is running on port ${PORT}`);
});
