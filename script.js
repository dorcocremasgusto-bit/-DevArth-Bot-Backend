// --- VARIABLES GLOBALES ---
let isRunning = false;
let timerInterval = null;
let floodInterval = null;

// Fonction principale déclenchée par le bouton HTML
async function startFlood() {
    const input = document.getElementById('phoneNumber');
    const btn = document.getElementById('startBtn');
    const statusText = document.getElementById('statusText');
    const countDisplay = document.getElementById('countDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const logConsole = document.getElementById('logConsole');

    // 1. Validation
    if (!input.value || isRunning) return;

    const targetNumber = input.value.replace(/\D/g, ''); // Nettoie le numéro
    
    // 2. Initialisation UI
    isRunning = true;
    btn.disabled = true;
    btn.innerText = "CONNEXION AU SERVEUR...";
    addLog(`[INIT] Connexion au serveur Klaus pour ${targetNumber}...`, "normal");

    try {
        // 3. Appel API vers le backend Node.js
        const response = await fetch('/api/flood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: targetNumber })
        });

        const data = await response.json();

        // 4. Gestion du succès ou échec
        if (data.success) {
            addLog(`[SUCCESS] Le serveur a envoyé ${data.totalSent} messages !`, "success");
            statusText.innerText = "COMPLETED";
            statusText.style.color = "#27c93f";
            btn.innerText = "BANNING TERMINÉ";
        } else {
            addLog(`[ERROR] ${data.error || 'Erreur serveur inconnue'}`, "error");
            statusText.innerText = "FAILED";
            statusText.style.color = "red";
            btn.innerText = "RÉESSAYER";
        }
    } catch (err) {
        addLog("[!] Erreur de connexion réseau ou serveur hors ligne.", "error");
        console.error(err);
        statusText.innerText = "OFFLINE";
        btn.innerText = "RÉESSAYER";
    } finally {
        // 5. Nettoyage des compteurs visuels
        clearInterval(timerInterval);
        clearInterval(floodInterval);
        isRunning = false;
        
        // On ne réactive pas le bouton si c'était un succès critique, 
        // mais on laisse l'utilisateur recommencer.
        if(btn.innerText === "CONNEXION AU SERVEUR...") {
             btn.innerText = "INITIATE BANNING SEQUENCE";
        }
        
        // Reset des compteurs après un délai
        setTimeout(() => {
            countDisplay.innerText = "0 / 300";
            timeDisplay.innerText = "03:00";
            statusText.style.color = ""; // Reset couleur
        }, 2000);
    }
}

// Fonction pour gérer l'animation visuelle (compte à rebours)
function startVisualCountdown(totalTimeSeconds = 180) {
    let currentTime = totalTimeSeconds;
    const timeDisplay = document.getElementById('timeDisplay');
    const countDisplay = document.getElementById('countDisplay');
    const statusText = document.getElementById('statusText');

    statusText.innerText = "ATTACKING...";
    statusText.style.color = "#ff003c";

    // Compte à rebours temps réel
    timerInterval = setInterval(() => {
        currentTime--;
        
        // Format MM:SS
        let m = Math.floor(currentTime / 60);
        let s = currentTime % 60;
        timeDisplay.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;

        if (currentTime <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);

    // Animation d'envoi (pour faire beau à voir, même si le vrai envoi est côté serveur)
    floodInterval = setInterval(() => {
        // On simule une progression visuelle jusqu'à 300
        // Note: Ceci est juste cosmétique, le vrai travail est fait par Node.js
        let currentSent = parseInt(countDisplay.innerText.split('/')[0]) || 0;
        if (currentSent < 300) {
            countDisplay.innerText = `${currentSent + 1} / 300`;
            
            // Petit effet visuel aléatoire
            document.body.style.boxShadow = `inset 0 0 ${Math.random() * 50}px var(--neon-red)`;
            setTimeout(() => document.body.style.boxShadow = 'none', 100);
        }
    }, 600); // Simule un envoi toutes les 600ms
}

// Fonction utilitaire pour les logs
function addLog(message, type) {
    const consoleDiv = document.getElementById('logConsole');
    const line = document.createElement('div');
    line.innerText = message;
    
    if (type === 'error') line.classList.add('error');
    if (type === 'success') line.classList.add('success');
    
    consoleDiv.appendChild(line);
    // Auto-scroll vers le bas
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// Démarrage automatique de l'animation visuelle quand on clique
// (Modification légère du HTML onclick pour appeler cette fonction avant startFlood)
document.getElementById('startBtn').addEventListener('click', () => {
    startVisualCountdown(180); // Lance le chrono visuel
});
