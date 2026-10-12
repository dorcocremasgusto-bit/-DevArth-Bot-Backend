// ==========================================
// CONFIGURATION API
// ==========================================
// Colles ton API Key ici entre les guillemets ""
const API_KEY = "F79c2a9bbf29054b7e585ca1df7b7f096fee81bcWcvmI79eJaGHYityXbCpA2ClU"; 
// ==========================================

let isRunning = false;

function startFlood() {
    const input = document.getElementById('phoneNumber');
    const statusText = document.getElementById('statusText');
    const countDisplay = document.getElementById('countDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const logConsole = document.getElementById('logConsole');
    const btn = document.getElementById('startBtn');

    if (!input.value || isRunning) return;

    // Reset
    isRunning = true;
    let sentCount = 0;
    let totalTime = 180; // 3 minutes en secondes
    let currentSecond = totalTime;
    
    btn.disabled = true;
    btn.innerText = "BANNING IN PROGRESS...";
    statusText.innerText = "ATTACKING";
    statusText.style.color = "#ff003c";
    
    addLog(`Targeting ${input.value}...`, 'normal');
    addLog("Connecting to WhatsApp Gateway...", 'normal');

    // Timer Loop
    const timerInterval = setInterval(() => {
        currentSecond--;
        
        // Format MM:SS
        let m = Math.floor(currentSecond / 60);
        let s = currentSecond % 60;
        timeDisplay.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;

        if (currentSecond <= 0) {
            clearInterval(timerInterval);
            stopFlood(input.value, sentCount);
        }
    }, 1000);

    // Flood Logic: 300 links over 180 seconds = 1 link every 0.6 seconds
    const floodInterval = setInterval(() => {
        if (sentCount >= 300) {
            clearInterval(floodInterval);
            clearInterval(timerInterval);
            stopFlood(input.value, sentCount);
            return;
        }

        sentCount++;
        countDisplay.innerText = `${sentCount} / 300`;
        
        // --- ZONE API ICI ---
        // Pour utiliser une vraie API, remplace le code ci-dessous par un fetch()
        // Exemple :
        /*
        fetch(`https://ton-api.com/send?number=${input.value}&key=${API_KEY}`, { method: 'POST' })
          .then(response => response.json())
          .then(data => { console.log(data); });
        */
        
        // Simulation actuelle (pour l'effet visuel) :
        const randomCode = Math.random().toString(36).substring(7);
        const fakeLink = `https://wa.me/${input.value.replace(/\D/g,'')}?text=Ban_Link_${randomCode}`;
        addLog(`[+] Link Sent: ${fakeLink}`, 'normal');
        
        // Animation visuelle aléatoire sur le bouton ou l'écran
        document.body.style.boxShadow = `inset 0 0 ${Math.random() * 50}px var(--neon-red)`;
        setTimeout(() => document.body.style.boxShadow = 'none', 100);

    }, 600); // 600ms * 300 = 180 000 ms = 3 minutes exactement.
}

function stopFlood(target, totalSent) {
    isRunning = false;
    const statusText = document.getElementById('statusText');
    const btn = document.getElementById('startBtn");
    
    statusText.innerText = "COMPLETED";
    statusText.style.color = "#27c93f";
    btn.disabled = false;
    btn.innerText = "INITIATE BANNING SEQUENCE";
    
    addLog(`--------------------------------`, 'normal');
    addLog(`[SUCCESS] Target ${target} flooded with ${totalSent} links.`, 'success');
    addLog("System Idle.", 'normal');
}

function addLog(message, type) {
    const consoleDiv = document.getElementById('logConsole');
    const line = document.createElement('div');
    line.innerText = message;
    if (type === 'error') line.classList.add('error');
    if (type === 'success') line.classList.add('success');
    
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight; // Auto scroll
}
