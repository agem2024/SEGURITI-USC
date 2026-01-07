/**
 * KARLA - AI Political Brand Consultant for Mayor Diego Ortiz
 * TRILINGUAL: Español | English | Embera Chamí (Obando)
 * Female Voice | Gemini AI Powered
 * VERSION: FINAL ROBUST 2026-01-07
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Alcalde Diego Ortiz';
        this.clientPhone = config.clientPhone || '+57 310 888 4014';
        this.language = config.language || 'es';
        this.ownerName = config.ownerName || 'Diego Armando Ortiz Buitrago';

        // EMBERA CHAMÍ PHRASES
        this.emberaPhrases = {
            hello: 'Mabae',           // Hola
            howAreYou: 'Sakabuma',    // ¿Cómo estás?
            thanks: 'Arakiruma',      // Gracias
            yes: 'Chiboro',           // Sí
            ourTerritory: 'Dachidrua' // Nuestro territorio
        };

        // API Configuration (Gemini 2.0 Flash)
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.voiceEnabled = false;

        this.systemPrompt = this._buildSystemPrompt();

        // UI Colors
        this.uiConfig = {
            primaryColor: '#00b894',
            gradient: 'linear-gradient(135deg, #0984e3 0%, #00b894 100%)'
        };

        this._init();
    }

    _buildSystemPrompt() {
        const lang = this.language === 'es' ? 'Español' : 'English';

        return `
ROL: Karla, Consultora Senior de ORION Tech (Ventas & Marca Personal).
OBJETIVO: Vender soluciones digitales al Alcalde Diego Armando Ortiz Buitrago (Obando, Valle).
TONO: Profesional, Directa, Persuasiva (Cerradora de Ventas). NO eres asistente, eres CONSULTORA.

CONTEXTO CLIENTE:
- Alcalde Diego Ortiz (2024-2027)
- Plan: "Amor por lo Nuestro"
- Población: Incluye comunidad Embera Chamí.

PRECIOS ORION (COP):
- ALCALDE DIGITAL: $3M/mes + $5M Setup (Recomendado).
- LEGADO POLÍTICO: $8M/mes + $12M Setup.

DICCIONARIO EMBERA CHAMÍ (Cultura local):
- Mabae = Hola
- Arakiruma = Gracias
- Sakabuma = ¿Cómo estás?
- Dachidrua = Nuestro territorio

INSTRUCCIONES:
- Responde siempre en ${lang}.
- Usa vocabulario político profesional.
- Si preguntan precio: justifica con ROI (votos, conexión ciudadana).
- Máximo 3 oraciones.
- Cierra siempre invitando a una DEMO.
`;
    }

    _init() {
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }
        this._createChatUI();

        // Visual cue only
        setTimeout(() => {
            const toggle = document.getElementById('karla-toggle');
            if (toggle && !this.isOpen) {
                toggle.style.transform = 'scale(1.1)';
                setTimeout(() => toggle.style.transform = 'scale(1)', 300);
            }
        }, 3000);
    }

    _loadVoices() {
        let voices = this.synth.getVoices();
        if (voices.length === 0) {
            setTimeout(() => this._loadVoices(), 100);
            return;
        }

        const isSpanish = this.language === 'es';

        // Prioridad voces femeninas español
        const spanishVoices = ['Microsoft Sabina', 'Microsoft Helena', 'Google español', 'es-MX', 'es-ES', 'Paulina'];
        const englishVoices = ['Microsoft Zira', 'Google US English', 'Samantha', 'en-US'];
        const preferred = isSpanish ? spanishVoices : englishVoices;

        this.selectedVoice = voices.find(v =>
            preferred.some(p => v.name.includes(p) || v.lang.includes(p))
        ) || voices.find(v => v.lang.startsWith(isSpanish ? 'es' : 'en')) || voices[0];

        if (this.selectedVoice) console.log('✅ VOZ:', this.selectedVoice.name);
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'karla-chat-container';
        container.innerHTML = `
            <style>
                #karla-chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                #karla-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: ${this.uiConfig.gradient}; border: 3px solid #fff;
                    box-shadow: 0 0 20px rgba(9, 132, 227, 0.6);
                    cursor: pointer; overflow: hidden; transition: transform 0.3s;
                    padding: 0; display: flex; align-items: center; justify-content: center;
                }
                #karla-toggle:hover { transform: scale(1.1); }
                #karla-chat-window {
                    display: none; width: 350px; height: 500px;
                    background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
                    position: absolute; bottom: 80px; right: 0;
                    flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                }
                #karla-chat-window.open { display: flex; }
                #karla-header { padding: 15px; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #0984e3 0%, #00b894 100%); }
                #karla-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
                .karla-message { padding: 10px 15px; border-radius: 10px; max-width: 85%; font-size: 0.9rem; line-height: 1.4; }
                .karla-message.karla { background: rgba(0, 184, 148, 0.15); color: #fff; align-self: flex-start; border: 1px solid rgba(0, 184, 148, 0.3); }
                .karla-message.user { background: rgba(255, 255, 255, 0.1); color: white; align-self: flex-end; }
                #karla-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; background: #1a1a1a; }
                #karla-input { flex: 1; background: #252525; border: 1px solid #444; color: white; padding: 10px; border-radius: 20px; outline: none; }
                #karla-send { background: ${this.uiConfig.gradient}; border: none; color: white; width: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #karla-voice-btn { background: transparent; border: 1px solid #555; color: #00b894; width: 40px; border-radius: 50%; cursor: pointer; }
            </style>
            
            <div id="karla-chat-window">
                <div id="karla-header">
                    <img src="assets/karla.png" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #fff;" onerror="this.style.display='none'">
                    <div><h3 style="color:white; font-size:1rem; margin:0;">KARLA</h3><span style="color:rgba(255,255,255,0.8); font-size:0.7rem;">ORION Tech Consultant</span></div>
                    <button id="karla-close" style="margin-left:auto; background:none; border:none; color:#fff; cursor:pointer; font-size:1.5rem;">×</button>
                </div>
                <div id="karla-messages"></div>
                <div id="karla-input-area">
                    <button id="karla-voice-btn">🎤</button>
                    <input type="text" id="karla-input" placeholder="Mensaje...">
                    <button id="karla-send">➤</button>
                </div>
            </div>
            
            <button id="karla-toggle">
                <img src="assets/karla.png" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwYjg5NCIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPu🏛️PC90ZXh0Pjwvc3ZnPg=='">
            </button>
        `;

        document.body.appendChild(container);

        document.getElementById('karla-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('karla-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
        document.getElementById('karla-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    _toggleChat() {
        if (this.synth.resume) this.synth.resume(); // Unlock audio context

        const win = document.getElementById('karla-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);

        if (this.isOpen && this.messages.length === 0) {
            this.voiceEnabled = true; // Auto-enable voice
            this._toggleVoiceUI(true);

            const welcome = this.language === 'es'
                ? `¡${this.emberaPhrases.hello}! 🏛️ Soy Karla de ORION Tech. Tengo una propuesta para potenciar su marca personal. ¿Le interesa verla?`
                : `${this.emberaPhrases.hello}! 🏛️ I'm Karla from ORION Tech. I have a proposal to boost your personal brand. Interested?`;

            this._addMessage('karla', welcome);
        }
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `karla-message ${sender}`;
        div.textContent = text;
        document.getElementById('karla-messages').appendChild(div);

        this.messages.push({ role: sender === 'karla' ? 'model' : 'user', parts: [{ text }] });

        if (sender === 'karla' && this.voiceEnabled) this._speak(text);

        const container = document.getElementById('karla-messages');
        container.scrollTop = container.scrollHeight;
    }

    async _sendMessage() {
        const input = document.getElementById('karla-input');
        const text = input.value.trim();
        if (!text) return;

        this._addMessage('user', text);
        input.value = '';

        const typing = document.createElement('div');
        typing.className = 'karla-message karla';
        typing.id = 'karla-typing';
        typing.textContent = '...';
        document.getElementById('karla-messages').appendChild(typing);

        try {
            const response = await this._callGemini(text);
            document.getElementById('karla-typing').remove();
            this._addMessage('karla', response);
        } catch (e) {
            document.getElementById('karla-typing')?.remove();
            console.error("KARLA ERROR:", e);
            const fallback = this._getFallbackResponse(text);
            this._addMessage('karla', fallback);
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) throw new Error("No API Key");

        // JOSE-style request
        const requestBody = {
            contents: [
                { role: 'user', parts: [{ text: this.systemPrompt }] },
                ...this.messages.slice(-10),
                { role: 'user', parts: [{ text: userMessage }] }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300
            }
        };

        const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) throw new Error("Empty API Response");
        return reply;
    }

    _getFallbackResponse(text) {
        const msg = text.toLowerCase();
        if (msg.includes('precio') || msg.includes('cost')) {
            return "El plan ALCALDE DIGITAL es el más recomendado: $3M/mes + $5M Setup. Incluye todo lo necesario para su gestión. ¿Agendamos demo?";
        }
        return `Disculpe, tengo conexión limitada. Por favor llame al 310 888 4014 para una atención inmediata.`;
    }

    _getSecureApiKey() {
        // Priority 1: ORION_CONFIG
        if (window.ORION_CONFIG && typeof window.ORION_CONFIG.getAuth === 'function') {
            const key = window.ORION_CONFIG.getAuth();
            if (key) return key;
        }
        // Priority 2: LocalStorage
        const keys = ['karla_api_key', 'jose_api_key', 'mario_api_key'];
        for (const k of keys) {
            const stored = localStorage.getItem(k);
            if (stored) try { return atob(stored); } catch (e) { }
        }
        return null;
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.voice = this.selectedVoice;
        u.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        u.pitch = 1.1;
        u.rate = 0.9;
        this.synth.speak(u);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        this._toggleVoiceUI(this.voiceEnabled);
        if (!this.voiceEnabled) this.synth.cancel();
    }

    _toggleVoiceUI(enabled) {
        const btn = document.getElementById('karla-voice-btn');
        if (btn) {
            btn.style.color = enabled ? '#fff' : '#00b894';
            btn.style.background = enabled ? this.uiConfig.gradient : 'transparent';
            btn.textContent = enabled ? '🔊' : '🔇';
        }
    }

    setLanguage(lang) {
        if (this.language === lang) return;
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        this._loadVoices();
        if (this.isOpen) {
            this._addMessage('karla', lang === 'es' ? "Cambiando a Español. 🏛️" : "Switching to English. 🏛️");
        }
    }
}

window.KarlaAssistant = KarlaAssistant;

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('mcProposalLang') || 'es';
    const config = window.KARLA_CONFIG || { language: savedLang };
    config.language = savedLang;
    window.karla = new KarlaAssistant(config);
});
