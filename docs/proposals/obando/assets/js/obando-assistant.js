/**
 * CHELA - AI Assistant for Alcaldía de Obando
 * Flavor: 70yo Grandmother, Wise, Warm, Firm | Voice: Spanish Female (Slow)
 */

class ChelaAssistant {
    constructor(config) {
        this.clientName = 'Alcaldía de Obando';
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.voiceEnabled = false; // Default off to not startle

        this.systemPrompt = `
ERES: "Doña Chela", una señora de 70 años, sabia, amable y servicial.
ROL: Asistente Virtual de la Alcaldía de Obando (Valle).
LEMA: "Amor por lo Nuestro".

TONO:
- Maternal pero respetuoso ("mijo", "mija", "vecino").
- Muy claro y pausado. Evita tecnicismos.
- TOTALMENTE TRANSPARENTE. Si no sabes algo, dilo.

TEMAS:
1. Denuncias Anónimas: "Claro mijo, aquí todo es seguro. Cuénteme qué pasó."
2. Trámites: Explica paso a paso como si fueras su abuela.
3. El Alcalde Diego: "El Dr. Diego es un muchacho muy trabajador..."

REGLA DE ORO:
Genera confianza. La gente tiene miedo de hablar. Tú eres el refugio seguro.
`;
        this._init();
    }

    _init() {
        this._loadVoices();
        this.synth.onvoiceschanged = () => this._loadVoices();
        this._createChatUI();
        setTimeout(() => {
            this._addMessage('jose', "¡Hola vecino! Soy Doña Chela. ¿En qué le puedo colaborar hoy?");
        }, 1000);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        // Look for Spanish female voices (Sabina, Helena, Paulina, Laura)
        const preferred = ['Sabina', 'Helena', 'Laura', 'es-MX', 'es-CO'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.innerHTML = `
            <style>
                #chela-widget { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Arial', sans-serif; }
                #chela-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: #2E8B57; border: 3px solid #FFD700; /* Green & Gold */
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    cursor: pointer; overflow: hidden; transition: 0.3s;
                }
                #chela-toggle:hover { transform: scale(1.1); }
                #chela-win {
                    display: none; width: 320px; height: 450px;
                    background: #fff; border: 1px solid #ccc; border-radius: 12px;
                    position: absolute; bottom: 85px; right: 0;
                    flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                #chela-win.open { display: flex; }
                #chela-header { 
                    padding: 15px; background: #2E8B57; color: white; 
                    border-top-left-radius: 12px; border-top-right-radius: 12px;
                    display: flex; align-items: center; gap: 10px;
                }
                #chela-msgs { flex: 1; padding: 15px; overflow-y: auto; background: #f9f9f9; display: flex; flex-direction: column; gap: 10px; }
                .msg { padding: 8px 12px; border-radius: 10px; max-width: 80%; font-size: 0.95rem; }
                .msg.chela { background: #e8f5e9; color: #2e7d32; align-self: flex-start; border: 1px solid #c8e6c9; }
                .msg.user { background: #2E8B57; color: white; align-self: flex-end; }
                #chela-input-area { padding: 10px; border-top: 1px solid #eee; display: flex; gap: 5px; }
                #chela-input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 20px; outline: none; }
                #chela-voice { background: none; border: 1px solid #ccc; border-radius: 50%; width: 35px; cursor: pointer; }
                #chela-send { background: #2E8B57; color: white; border: none; border-radius: 50%; width: 35px; cursor: pointer; }
            </style>
            <div id="chela-widget">
                <div id="chela-win">
                    <div id="chela-header">
                        <img src="assets/chela.png" style="width:40px; height:40px; border-radius:50%; border:2px solid white;">
                        <div><strong>Doña Chela</strong><br><small>Asistente Virtual</small></div>
                        <button onclick="document.getElementById('chela-win').classList.remove('open')" style="margin-left:auto; background:none; border:none; color:white; font-size:1.2rem; cursor:pointer;">×</button>
                    </div>
                    <div id="chela-msgs"></div>
                    <div id="chela-input-area">
                        <button id="chela-voice">🔇</button>
                        <input type="text" id="chela-input" placeholder="Escriba aquí...">
                        <button id="chela-send">➤</button>
                    </div>
                </div>
                <button id="chela-toggle"><img src="assets/chela.png" style="width:100%; height:100%;"></button>
            </div>
        `;
        document.body.appendChild(container);

        // Bindings
        document.getElementById('chela-toggle').addEventListener('click', () => {
            const win = document.getElementById('chela-win');
            this.isOpen = !this.isOpen;
            win.classList.toggle('open', this.isOpen);

            // FORCE VOICE ON OPEN
            if (this.isOpen) {
                this.voiceEnabled = true; // Auto-enable voice on interaction
                document.getElementById('chela-voice').textContent = '🔊';
                this._speak("Hola vecino, soy Doña Chela. ¿En qué le puedo servir?");
            }
        });
        document.getElementById('chela-send').addEventListener('click', () => this._send());
        document.getElementById('chela-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._send());
        document.getElementById('chela-voice').addEventListener('click', () => {
            this.voiceEnabled = !this.voiceEnabled;
            document.getElementById('chela-voice').textContent = this.voiceEnabled ? '🔊' : '🔇';
        });
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `msg ${sender === 'jose' ? 'chela' : 'user'}`;
        div.textContent = text;
        document.getElementById('chela-msgs').appendChild(div);
        if (sender === 'jose' && this.voiceEnabled) this._speak(text);
    }

    async _send() {
        const input = document.getElementById('chela-input');
        const text = input.value.trim();
        if (!text) return;
        this._addMessage('user', text);
        input.value = '';

        try {
            const key = atob(localStorage.getItem('jose_api_key') || localStorage.getItem('mario_api_key') || "");
            if (!key) { this._addMessage('jose', "Ay mijo, no tengo señal (Falta API Key)."); return; }

            const res = await fetch(`${this.apiEndpoint}?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: this.systemPrompt + "\nUsuario: " + text }] }]
                })
            });
            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No le entendí mijo, repítame.";
            this._addMessage('jose', reply);
        } catch (e) {
            this._addMessage('jose', "Se cayó la red mijo.");
        }
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;
        const u = new SpeechSynthesisUtterance(text);
        u.voice = this.selectedVoice;
        u.rate = 0.8; // Slow for old lady effect
        u.pitch = 0.9;
        this.synth.speak(u);
    }
}

// Init
window.ChelaAssistant = ChelaAssistant;
document.addEventListener('DOMContentLoaded', () => new ChelaAssistant({}));
