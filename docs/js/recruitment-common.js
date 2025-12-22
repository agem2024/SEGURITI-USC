/**
 * ORION TECH - Recruitment Security & Analytics
 * Shared module for all recruitment landing pages.
 */

// Simple PIN Security
const RECRUITMENT_PIN = "2025";

function initSecurity() {
    // Check if session is already authorized
    if (sessionStorage.getItem("orion_recruitment_auth") === "true") {
        document.body.classList.remove("blur-content");
        document.getElementById("security-overlay").style.display = "none";
        return;
    }

    // Lock screen setup
    const overlay = document.createElement("div");
    overlay.id = "security-overlay";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #000; z-index: 9999; display: flex; flex-direction: column;
        align-items: center; justify-content: center; color: #00f3ff;
        font-family: 'Orbitron', 'Courier New', sans-serif;
    `;

    overlay.innerHTML = `
        <img src="images/orion_logo.png" style="width: 100px; margin-bottom: 20px;">
        <h2 style="margin-bottom: 20px;">ORION TECH // RESTRICTED ACCESS</h2>
        <p style="margin-bottom: 20px;">Enter Personnel Access Code</p>
        <div style="display:flex; gap:10px;">
            <input type="password" id="pin-input" style="padding: 10px; border: 1px solid #00f3ff; background: #000; color: #fff; text-align: center; font-size: 1.2rem; outline: none;">
            <button onclick="verifyPin()" style="padding: 10px 20px; background: #00f3ff; color: #000; border: none; font-weight: bold; cursor: pointer;">ACCESS</button>
        </div>
        <p id="pin-error" style="color: #ff3333; margin-top: 10px; display: none;">ACCESS DENIED</p>
    `;

    document.body.appendChild(overlay);

    // Blur main content if possible
    // document.body.style.filter = "blur(5px)"; // Can cause issues with rendering overlay inside body
}

window.verifyPin = function () {
    const input = document.getElementById("pin-input").value;
    if (input === RECRUITMENT_PIN) {
        sessionStorage.setItem("orion_recruitment_auth", "true");
        document.getElementById("security-overlay").style.display = "none";
        // document.body.style.filter = "none";

        // Log Access to Firebase if available
        if (window.logOrionVisit) {
            window.logOrionVisit('recruitment_access_granted');
        }
    } else {
        document.getElementById("pin-error").style.display = "block";
        if (window.navigator.vibrate) window.navigator.vibrate(200);
    }
}

// Training Enrollment Logic
window.enrollInTraining = function (program) {
    console.log(`[ORION] Enrolling in ${program}`);
    logTrainingAction('enroll', program);

    // Simulate Application
    sessionStorage.setItem("orion_application_status", "pending");
    sessionStorage.setItem("orion_applied_to", program);

    alert("APLICACIÓN ENVIADA: Tu perfil está siendo analizado por el sistema central. Por favor contacta al administrador por WhatsApp para la aprobación final.");

    // Redirect to whatsapp with context
    const msg = `Hola! He aplicado al Programa ${program} en el Recruitment Command Center. Solicito aprobación para iniciar las capacitaciones.`;
    window.location.href = `https://wa.me/16692342444?text=${encodeURIComponent(msg)}`;
}

window.checkApproval = function () {
    const status = sessionStorage.getItem("orion_application_status");
    if (status === "approved") {
        window.location.href = "training-dashboard.html";
    } else {
        // Admin override for testing/demo
        const override = confirm("ACCESO RESTRINGIDO: Tu aplicación está PENDIENTE. ¿Eres el ADMINISTRADOR para forzar la aprobación?");
        if (override) {
            const pass = prompt("INTRODUCE EL PIN DE ADMINISTRADOR:");
            if (pass === "2025") {
                sessionStorage.setItem("orion_application_status", "approved");
                window.location.href = "training-dashboard.html";
            } else {
                alert("PIN INCORRECTO.");
            }
        }
    }
}

// Text-to-Speech Core Logic - Hybrid (OpenAI API -> Browser Fallback)
async function speakOrion(text, agentName = "System", lang = "es") {
    console.log(`[ORION VOICE] Speaking as ${agentName}: ${text.substring(0, 30)}...`);

    // 1. Try Natural OpenAI Voice via Local API
    try {
        const response = await fetch('http://localhost:3030/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, lang })
        });

        if (response.ok) {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
            return;
        }
    } catch (e) {
        console.warn('⚠️ TTS API unavailable, using browser fallback');
    }

    // 2. Fallback: Browser Built-in TTS
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();

        // Clean text for pronunciation (xona -> chona)
        let spokenText = text.replace(/xona/gi, 'Chona')
            .replace(/orion/gi, 'Orión');

        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.lang = lang === 'es' ? 'es-MX' : 'en-US';
        utterance.rate = 0.95;
        utterance.pitch = (agentName === 'FLASH' || agentName === 'KAI') ? 1.4 : 1.0;

        const setVoice = () => {
            const voices = speechSynthesis.getVoices();
            let selectedVoice = null;

            if (lang === 'es') {
                const femaleKeywords = ['paulina', 'monica', 'sabina', 'helena', 'lucia', 'laura', 'female'];
                selectedVoice = voices.find(v => v.lang.includes('es') && femaleKeywords.some(sw => v.name.toLowerCase().includes(sw)));
            } else {
                const femaleKeywords = ['samantha', 'victoria', 'karen', 'zira', 'female'];
                selectedVoice = voices.find(v => v.lang.includes('en') && femaleKeywords.some(sw => v.name.toLowerCase().includes(sw)));
            }

            if (selectedVoice) utterance.voice = selectedVoice;
            speechSynthesis.speak(utterance);
        };

        if (speechSynthesis.getVoices().length > 0) setVoice();
        else speechSynthesis.onvoiceschanged = setVoice;
    }
}

// User Identity & Training Progress Persistence
const PROGRESS_KEY = "orion_user_progress";

window.saveProgress = function (data) {
    let current = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    let updated = { ...current, ...data, lastUpdate: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    console.log("[ORION] Progress saved:", updated);
}

window.getProgress = function () {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
}

window.completeModule = function (moduleId) {
    let progress = getProgress();
    if (!progress.completedModules) progress.completedModules = [];
    if (!progress.completedModules.includes(moduleId)) {
        progress.completedModules.push(moduleId);
        saveProgress(progress);
        speakOrion(`¡Felicidades! Has completado el módulo ${moduleId}. Tu progreso ha sido guardado en la red neuronal.`, "System");
    }
}

// Auto-run security
document.addEventListener("DOMContentLoaded", initSecurity);

// Analytics Helper
function logTrainingAction(action, label) {
    console.log(`[ORION TRAINING] ${action}: ${label}`);
    if (typeof gtag === 'function') {
        gtag('event', action, {
            'event_category': 'Recruitment',
            'event_label': label
        });
    }
}
