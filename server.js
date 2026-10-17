const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API pour générer les 300 liens
app.get('/api/generate', (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.json({ links: [] });

    const links = [];
    for (let i = 0; i < 300; i++) {
        // On ajoute un paramètre aléatoire pour chaque lien afin que WhatsApp ne les considère pas comme un doublon instantané
        const randomId = Math.random().toString(36).substring(7);
        links.push(`https://web.whatsapp.com/send?phone=${phone}&text=KLAUS_BAN_${randomId}`);
    }
    res.json({ links });
});

app.listen(PORT, () => {
    console.log(`KLAUS SERVER RUNNING AT ${PORT}`);
});
