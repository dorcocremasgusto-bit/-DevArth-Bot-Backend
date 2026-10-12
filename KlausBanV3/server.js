const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Route principale pour corriger le "Cannot GET /"
// Cela dit au serveur de servir le fichier index.html quand on va à la racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`[+] KLAUS BAN V3 SERVER ONLINE ON PORT ${PORT}`);
});
