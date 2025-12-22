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
