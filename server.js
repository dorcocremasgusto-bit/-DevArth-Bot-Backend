const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---
const TEXTBELT_API_KEY = 'TA_CLE_API_TEXTELT_ICI'; // Mets ta clé ici ou dans les variables d'environnement de Render
// ---------------------

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/flood', async (req, res) => {
    const { phoneNumber, count = 300 } = req.body;
    
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Numéro manquant' });
    }

    let sentCount = 0;
    const results = [];

    try {
        for (let i = 0; i < count; i++) {
            const randomMsg = `KLAUS_BAN_${Math.random().toString(36).substring(7)}`;
            
            // Appel API Textbelt
            const response = await axios.post(`https://textbelt.com/text/${phoneNumber}`, {
                key: TEXTBELT_API_KEY,
                message: randomMsg
            });

            if (response.data.success) {
                sentCount++;
                results.push({ msg: randomMsg, status: 'ok' });
            } else {
                results.push({ msg: randomMsg, status: 'failed' });
            }
            
            // Petit délai pour ne pas saturer l'API (optionnel mais recommandé)
            await new Promise(r => setTimeout(r, 500)); 
        }

        res.json({ success: true, totalSent: sentCount, details: results });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`KLAUS BAN V3 Server running on port ${PORT}`);
});
