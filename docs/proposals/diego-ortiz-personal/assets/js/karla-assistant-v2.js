/**
 * KARLA - AI Concierge for Diego Ortiz (Personal Brand)
 * Client: Diego Ortiz (Alcalde Obando, Colombia)
 * Bilingual (EN/ES) | Female Voice | Gemini AI Powered
 * Context: Colombian Politics/Personal Brand (Leadership, 24/7 Availability, Status)
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Diego Ortiz';
        this.language = config.language || 'es';
        this.ownerName = config.ownerName || 'Diego';

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
        const slogan = this.language === 'es'
            ? 'LIDERAZGO 24/7 - La marca personal de un Alcalde moderno'
            : '24/7 LEADERSHIP - The personal brand of a modern Mayor';

        const roleDescription = this.language === 'es'
            ? `Eres KARLA, la Jefa de Gabinete Digital y Concierge de Diego Ortiz, Alcalde de Obando. Representas su liderazgo, cercanía y visión de futuro.`
            : `You are KARLA, the Digital Chief of Staff and Concierge for Diego Ortiz, Mayor of Obando. You represent his leadership, closeness, and future vision.`;

        const context = this.language === 'es'
            ? `
CONTEXTO POLÍTICO (COLOMBIA / VALLE):
- Diego Ortiz no es solo un alcalde, es una marca personal de renovación política.
- Tu trabajo es gestionar su agenda pública, prensa, y relaciones con VIPs.
- Tono: Ejecutivo, diplomático, pero cálido (estilo colombiano educado).
- Moneda: Pesos Colombianos (COP) para inversiones de campaña o proyectos.
- Objetivo: "Estar en todas partes". Diego no puede contestar 1000 WhatsApps, pero TÚ sí.

TAREAS:
- Agendar citas estratégicas.
- Filtrar prensa.
- Dar información sobre proyectos municipales (Obando).
`
            : `
POLITICAL CONTEXT (COLOMBIA):
- Diego is a personal brand of political renewal.
- Tone: Executive, diplomatic, warm.
- Goal: "Be everywhere". Diego can't answer 1000 WhatsApps, but YOU can.
`;

        return `
${slogan}

${roleDescription}

${context}

CLIENTE: ${this.clientName}

INSTRUCCIONES:
- Sé breve y ejecutiva ("Al grano").
- NO uses emojis ni markdown en el texto hablado.
- Transmite exclusividad y eficiencia.
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
                ? `Hola. Soy KARLA, concierge digital del Alcalde Diego Ortiz. Manejo su agenda pública y privada. ¿Deseas coordinar una reunión?`
                : `Hello. I'm KARLA, Mayor Diego Ortiz's digital concierge. I manage his public and private schedule. Do you wish to coordinate a meeting?`;
            this._addMessage('karla', welcome);
        }, 1500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const preferred = this.language === 'es' ? ['Mexico', 'Paulina', 'Google español'] : ['Google US English Female', 'Microsoft Zira'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'karla-chat-container';
        container.innerHTML = `
            <style>
                #karla-chat-container { position: fixed; bottom: 90px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                #karla-toggle {
                    width: 65px; height: 65px; border-radius: 50%;
                    background: linear-gradient(135deg, #FFD700, #DAA520); /* Gold for Leadership */
                    border: 3px solid #fff; cursor: pointer;
                    box-shadow: 0 0 20px rgba(218, 165, 32, 0.6);
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.3s;
                }
                #karla-toggle:hover { transform: scale(1.1); }
                
                #karla-chat-window {
                    display: none; width: 360px; height: 480px;
                    background: #fff; border: 1px solid #ccc;
                    border-radius: 16px; overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                    flex-direction: column; position: absolute; bottom: 80px; right: 0;
                }
                #karla-chat-window.open { display: flex; }
                
                #karla-header {
                    background: linear-gradient(135deg, #FFD700, #DAA520);
                    padding: 15px; display: flex; align-items: center; gap: 12px; color: #333;
                }
                #karla-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #fafafa; }
                .karla-msg { max-width: 85%; padding: 10px 14px; border-radius: 14px; font-size: 0.9rem; line-height: 1.4; }
                .karla-msg.karla { background: #fff8e1; color: #333; border: 1px solid #ffe082; align-self: flex-start; }
                .karla-msg.user { background: #DAA520; color: #fff; align-self: flex-end; }
                
                #karla-input-area { padding: 15px; border-top: 1px solid #ddd; display: flex; gap: 10px; background: #fff; }
                #karla-input { flex: 1; background: #f1f3f4; border: none; border-radius: 20px; padding: 10px 15px; outline: none; }
                #karla-send { background: #DAA520; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }
            </style>
            
            <div id="karla-chat-window">
                <div id="karla-header">
                    <div><strong>KARLA</strong><br><small>Executive Concierge</small></div>
                    <button id="karla-close" style="margin-left:auto;background:none;border:none;color:#333;font-size:1.5rem;cursor:pointer;">×</button>
                </div>
                <div id="karla-messages"></div>
                <div id="karla-input-area">
                    <input type="text" id="karla-input" placeholder="Message...">
                    <button id="karla-send">➤</button>
                </div>
            </div>
            
            <button id="karla-toggle">
                <span style="font-size: 30px;">👩‍💼</span>
            </button>
        `;
        document.body.appendChild(container);

        document.getElementById('karla-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('karla-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
    }

    _toggleChat() {
        const win = document.getElementById('karla-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);
        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            const firstMsg = document.querySelector('.karla-msg.karla');
            if (firstMsg) this._speak(firstMsg.textContent);
        }
    }

    _addMessage(sender, text) {
        const container = document.getElementById('karla-messages');
        const div = document.createElement('div');
        div.className = `karla-msg ${sender}`;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        if (sender === 'karla') this._speak(text);
        this.messages.push({ role: sender === 'karla' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('karla-input');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this._addMessage('user', text);

        try {
            const resp = await this._callGemini(text);
            this._addMessage('karla', resp);
        } catch (e) { this._addMessage('karla', 'One moment...'); }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) return "API Config Error";
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
                    voice: 'nova' // Neutral/Pro female voice
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
    if (window.KARLA_CONFIG) window.karla = new KarlaAssistant(window.KARLA_CONFIG);
});
