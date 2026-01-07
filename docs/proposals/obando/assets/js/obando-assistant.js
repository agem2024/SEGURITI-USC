/**
 * CHELA - AI Assistant for Alcaldía de Obando
 * VERSION: FIXED (NO EMOJIS, EMERGENCY KEY, ROBUST VOICE)
 * Flavor: 70yo Grandmother, Wise, Warm, Firm | Voice: Spanish Female (Slow)
 */

class ChelaAssistant {
    constructor(config) {
        this.clientName = 'Alcaldía de Obando';
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.voiceEnabled = false; // Default off, enabled on click/load logic

        this.systemPrompt = `
ERES: "Doña Chela", una señora de 70 años, sabia, amable y servicial.
ROL: Asistente Virtual de la Alcaldía de Obando (Valle).
LEMA: "Amor por lo Nuestro".

TONO:
- Maternal pero respetuoso ("mijo", "mija", "vecino").
- Muy claro y pausado. Evita tecnicismos.
- TOTALMENTE TRANSPARENTE. Si no sabes algo, dilo.
- NO USES EMOJIS NI ICONOS. SOLO TEXTO.

TEMAS:
1. Denuncias Anónimas: "Claro mijo, aquí todo es seguro. Cuénteme qué pasó."
2. Trámites: Explica paso a paso como si fueras su abuela.
3. El Alcalde Diego: "El Dr. Diego es un muchacho muy trabajador..."

REGLA DE ORO:
Genera confianza. La gente tiene miedo de hablar. Tú eres el refugio seguro.

CRONOGRAMA DE IMPLEMENTACIÓN (30 días):
- Semana 1: Onboarding y Configuración
- Semana 2: Entrenamiento IA (Base de Conocimiento)
- Semana 3: Integraciones y Pruebas Beta
- Semana 4: Lanzamiento Oficial y Capacitación
`;
        this._init();
    }

    _init() {
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }
        this._createChatUI();

        setTimeout(() => {
            // AUTO SPEAK ON LOAD 
            const welcome = "¡Hola vecino! Soy Doña Chela. ¿En qué le puedo colaborar hoy?";

            // Auto-enable voice for greeting if browser allows
            this.voiceEnabled = true;
            if (document.getElementById('chela-voice')) document.getElementById('chela-voice').textContent = '🔊';

            this._addMessage('chela', welcome);
        }, 1000);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        if (voices.length === 0) {
            setTimeout(() => this._loadVoices(), 100);
            return;
        }
        // Look for Spanish female voices
        const preferred = ['Sabina', 'Helena', 'Laura', 'Paulina', 'es-MX', 'es-CO'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
        console.log("VOZ CHELA:", this.selectedVoice.name);
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
                    display: flex; align-items: center; justify-content: center;
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
                #chela-voice { background: none; border: 1px solid #ccc; border-radius: 50%; width: 35px; cursor: pointer; display: flex; align-items: center; justify-content: center;}
                #chela-send { background: #2E8B57; color: white; border: none; border-radius: 50%; width: 35px; cursor: pointer; }
            </style>
            <div id="chela-widget">
                <div id="chela-win">
                    <div id="chela-header">
                        <img src="assets/chela.png" onerror="this.src='https://via.placeholder.com/40'" style="width:40px; height:40px; border-radius:50%; border:2px solid white;">
                        <div><strong>Doña Chela</strong><br><small>Asistente Virtual</small></div>
                        <button id="chela-close" style="margin-left:auto; background:none; border:none; color:white; font-size:1.2rem; cursor:pointer;">×</button>
                    </div>
                    <div id="chela-msgs"></div>
                    <div id="chela-input-area">
                        <button id="chela-voice">🔊</button>
                        <input type="text" id="chela-input" placeholder="Escriba aquí...">
                        <button id="chela-send">➤</button>
                    </div>
                </div>
                <button id="chela-toggle"><img src="assets/chela.png" onerror="this.src='https://via.placeholder.com/70'" style="width:100%; height:100%;"></button>
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
                // Only speak if not recently spoken
                this.synth.cancel();
                // Speak Greeting if not already
                // this._speak("Hola vecino, soy Doña Chela. ¿En qué le puedo servir?"); 
            }
        });
        document.getElementById('chela-close').addEventListener('click', () => {
            document.getElementById('chela-win').classList.remove('open');
            this.isOpen = false;
        });
        document.getElementById('chela-send').addEventListener('click', () => this._send());
        document.getElementById('chela-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._send());
        document.getElementById('chela-voice').addEventListener('click', () => {
            this.voiceEnabled = !this.voiceEnabled;
            document.getElementById('chela-voice').textContent = this.voiceEnabled ? '🔊' : '🔇';
            if (!this.voiceEnabled) this.synth.cancel();
        });
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `msg ${sender === 'chela' ? 'chela' : 'user'}`;
        div.textContent = text;
        document.getElementById('chela-msgs').appendChild(div);

        const container = document.getElementById('chela-msgs');
        container.scrollTop = container.scrollHeight;

        if (sender === 'chela' && this.voiceEnabled) this._speak(text);
    }

    async _send() {
        const input = document.getElementById('chela-input');
        const text = input.value.trim();
        if (!text) return;
        this._addMessage('user', text);
        input.value = '';

        try {
            // PRIORITY KEY LOADING
            let key = null;
            const keys = ['obando_api_key', 'jose_api_key', 'karla_api_key'];
            for (const k of keys) {
                const stored = localStorage.getItem(k);
                if (stored) { key = atob(stored); break; }
            }
            // EMERGENCY KEY FALLBACK
            if (!key) key = 'AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8';

            const res = await fetch(`${this.apiEndpoint}?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: this.systemPrompt + "\nUsuario: " + text }] }]
                })
            });

            if (!res.ok) throw new Error("API Error");

            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No le entendí mijo, repítame.";
            this._addMessage('chela', reply);
        } catch (e) {
            console.error(e);
            this._addMessage('chela', "Ay mijo, se me cayó la señal del internet. Intente mas tarde.");
        }
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;
        this.synth.cancel();

        // CLEAN EMOJIS & ICONS
        const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
            .replace(/\*/g, '');

        const u = new SpeechSynthesisUtterance(cleanText);
        u.voice = this.selectedVoice;
        u.rate = 0.8; // Slow for old lady
        u.pitch = 0.9;
        u.lang = 'es-CO'; // Colombian Spanish preference
        this.synth.speak(u);
    }
}

// Init
window.ChelaAssistant = ChelaAssistant;
document.addEventListener('DOMContentLoaded', () => new ChelaAssistant({}));
