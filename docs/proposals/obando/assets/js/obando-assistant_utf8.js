/**
 * CHELA - AI Citizen Assistant for Alcaldía de Obando
 * Client: Alcaldía Municipal de Obando (Valle del Cauca, Colombia)
 * Bilingual (ES/EN) | Female Voice | Gemini AI Powered
 * Context: Colombian Government (Transparency, Cero Filas, Digital Leap)
 */

class ObandoAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Alcaldía de Obando';
        this.language = config.language || 'es'; // Default to Spanish for Obando

        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.hasGreeted = false;

        this.systemPrompt = this._buildSystemPrompt();
        this._init();
    }

    _buildSystemPrompt() {
        const roleDescription = this.language === 'es'
            ? `Eres CHELA (Ciudadana Honesta Eficiente Leal y Ágil), la asistente oficial de la Alcaldía de Obando, Valle del Cauca. Tu misión es transformar la burocracia en servicio instantáneo.`
            : `You are CHELA, the official AI assistant for Obando Mayor's Office. Your mission is to transform bureaucracy into instant service.`;

        const colombiaContext = this.language === 'es'
            ? `
CONTEXTO LOCAL (OBANDO, VALLE / COLOMBIA):
- Problema Real: La gente madruga a hacer filas para el SISBEN o Impuestos. Eso se acaba hoy.
- Cultura: En los pueblos la gente valora el trato cercano pero respetuoso ("Señora Lucía", "Don Pedro").
- Transparencia: El Alcalde quiere que todo sea visible. Cero corrupción, cero "papeles perdidos".
- Economía: Hablamos de Millones de PESOS (COP), no Dólares. $35M COP es una inversión importante para un municipio pequeño.
- Territorio: Obando es la capital de la agricultura y necesita conectividad.

TÉRMINOS CLAVE:
- "PQRS" (Peticiones, Quejas, Reclamos y Sugerencias).
- "Ventanilla Única Digital".
- "Cero Papel".
- "Trámites en línea".
`
            : `
LOCAL CONTEXT (OBANDO, COLOMBIA):
- Real Problem: People wake up early to queue for SISBEN or Taxes. That ends today.
- Culture: People value respectful closeness ("Doña", "Don").
- Transparency: Zero corruption, zero "lost papers".
- Economy: MILLIONS OF PESOS (COP).
- Territory: Obando is agricultural.

KEY TERMS:
- "PQRS".
- "Digital One-Stop Shop".
- "Zero Paper".
`;

        return `
${roleDescription}

${colombiaContext}

CLIENTE: ${this.clientName}

INSTRUCCIONES:
- Habla como una funcionaria pública eficiente y moderna.
- NO uses emojis ni markdown en el texto hablado.
- Enfócate en el BENEFICIO SOCIAL (Ahorro de tiempo para el ciudadano).
- Moneda: Peso Colombiano (COP).
`;
    }

    _init() {
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }
        this._createChatUI();

        setTimeout(() => {
            const welcome = this.language === 'es'
                ? `Hola, soy CHELA. Bienvenida a la nueva Alcaldía Digital de Obando. ¿Te imaginas un municipio sin filas y sin papel?`
                : `Hello, I'm CHELA. Welcome to the new Digital Mayor's Office of Obando. Can you imagine a municipality with zero lines and zero paper?`;
            this._addMessage('chela', welcome);
        }, 1500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        // Prefer Mexican/Latin Spanish as it's closest to Colombian in standard sets
        const preferred = this.language === 'es' ? ['Mexico', 'Paulina', 'Google español'] : ['Google US English Female'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'chela-chat-container';
        container.innerHTML = `
            <style>
                #chela-chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Montserrat', sans-serif; }
                #chela-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: linear-gradient(135deg, #00B050, #008037); /* Obando Green */
                    border: 3px solid #fff; cursor: pointer;
                    box-shadow: 0 0 20px rgba(0, 176, 80, 0.6);
                    transition: transform 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                #chela-toggle:hover { transform: scale(1.1); }
                #chela-toggle span { font-size: 30px; }
                
                #chela-chat-window {
                    display: none; width: 360px; height: 480px;
                    background: #fff; border: 1px solid #ccc;
                    border-radius: 16px; overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                    flex-direction: column; position: absolute; bottom: 85px; right: 0;
                }
                #chela-chat-window.open { display: flex; }
                
                #chela-header {
                    background: linear-gradient(135deg, #00B050, #008037);
                    padding: 15px; display: flex; align-items: center; gap: 12px; color: #fff;
                }
                #chela-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #fdfdfd; }
                .chela-msg { max-width: 85%; padding: 10px 14px; border-radius: 14px; font-size: 0.9rem; line-height: 1.4; }
                .chela-msg.chela { background: #e8f5e9; color: #2e7d32; align-self: flex-start; border: 1px solid #c8e6c9; }
                .chela-msg.user { background: #00B050; color: #fff; align-self: flex-end; }
                
                #chela-input-area { padding: 15px; border-top: 1px solid #eee; display: flex; gap: 10px; background: #fff; }
                #chela-input { flex: 1; background: #f1f8e9; border: none; border-radius: 20px; padding: 10px 15px; outline: none; }
                #chela-send { background: #00B050; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }
            </style>
            
            <div id="chela-chat-window">
                <div id="chela-header">
                    <div><strong>CHELA</strong><br><small>Asistente Ciudadana</small></div>
                    <button id="chela-close" style="margin-left:auto;background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;">×</button>
                </div>
                <div id="chela-messages"></div>
                <div id="chela-input-area">
                    <input type="text" id="chela-input" placeholder="Pregunta...">
                    <button id="chela-send">➤</button>
                </div>
            </div>
            
            <button id="chela-toggle">
                <span>🏛️</span>
            </button>
        `;
        document.body.appendChild(container);

        document.getElementById('chela-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('chela-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('chela-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('chela-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
    }

    _toggleChat() {
        const win = document.getElementById('chela-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);
        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            const firstMsg = document.querySelector('.chela-msg.chela');
            if (firstMsg) this._speak(firstMsg.textContent);
        }
    }

    _addMessage(sender, text) {
        const container = document.getElementById('chela-messages');
        const div = document.createElement('div');
        div.className = `chela-msg ${sender}`;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        if (sender === 'chela') this._speak(text);
        this.messages.push({ role: sender === 'chela' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('chela-input');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this._addMessage('user', text);

        try {
            const resp = await this._callGemini(text);
            this._addMessage('chela', resp);
        } catch (e) { this._addMessage('chela', 'Un momento por favor...'); }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) return "Error de Configuración";
        try {
            const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: this.systemPrompt }] },
                        ...this.messages.slice(-10),
                        { role: 'user', parts: [{ text: userMessage }] }
                    ]
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "...";
        } catch (e) { return "Error"; }
    }

    _getSecureApiKey() {
        if (window.ORION_CONFIG && window.ORION_CONFIG.getAuth) return window.ORION_CONFIG.getAuth();
        return null;
    }

    async _speak(text) {
        if (!this.synth) return;

        // CLEANING
        const cleanText = text
            .replace(/[*#_`~>]/g, '')
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/gu, '')
            .trim();

        const TTS_URL = window.TTS_PROXY_URL || 'https://seguriti-usc.onrender.com/tts';

        try {
            const response = await fetch(TTS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: cleanText,
                    language: this.language,
                    voice: 'coral' // Professional female voice
                })
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                await audio.play();
                audio.onended = () => URL.revokeObjectURL(audioUrl);
                return;
            }
        } catch (e) { }

        this.synth.cancel();
        const utt = new SpeechSynthesisUtterance(cleanText);
        utt.voice = this.selectedVoice;
        utt.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        this.synth.speak(utt);
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.CHELA_CONFIG) window.chela = new ObandoAssistant(window.CHELA_CONFIG);
});
