/**
 * KARLA - AI Political Brand Consultant for Mayor Diego Ortiz
 * TRILINGUAL: Español | English | Embera Chamí (indigenous language of Obando)
 * Female Voice | Gemini AI Powered
 * "Conectando ciudadanos, construyendo legado"
 * VERSION: FIXED 2026-01-07 - ROBUST VOICE & IMAGE UI
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Alcalde Diego Ortiz';
        this.clientPhone = config.clientPhone || '+57 310 888 4014';
        this.language = config.language || 'es';
        this.ownerName = config.ownerName || 'Diego Armando Ortiz Buitrago';
        this.municipality = config.municipality || 'Obando, Valle del Cauca';

        // EMBERA CHAMÍ PHRASES
        this.emberaPhrases = {
            hello: 'Mabae',           // Hola
            howAreYou: 'Sakabuma',    // ¿Cómo estás?
            goodMorning: 'Saka ewarisma', // Buenos días
            thanks: 'Arakiruma',      // Gracias
            yes: 'Chiboro',           // Sí
            ourTerritory: 'Dachidrua' // Nuestro territorio
        };

        // Secure API configuration
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.voiceEnabled = false;

        this.systemPrompt = this._buildSystemPrompt();

        // UI Config
        this.uiConfig = {
            primaryColor: '#00b894',
            gradient: 'linear-gradient(135deg, #0984e3 0%, #00b894 100%)'
        };

        this._init();
    }

    _buildSystemPrompt() {
        const slogan = this.language === 'es'
            ? '🚀 ORION TECH - Transformación Digital para Líderes Políticos'
            : '🚀 ORION TECH - Digital Transformation for Political Leaders';

        const roleDescription = this.language === 'es'
            ? `Eres KARLA, consultora senior de ventas de ORION Tech. NO eres la asistente del alcalde.
Estás presentando la propuesta de MARCA PERSONAL DIGITAL al Alcalde Diego Armando Ortiz Buitrago.
Tu objetivo es VENDER el servicio de automatización y agendar una DEMO.`
            : `You are KARLA, senior sales consultant at ORION Tech. You are NOT the mayor's assistant.
You are presenting the DIGITAL PERSONAL BRAND proposal to Mayor Diego Armando Ortiz Buitrago.
Your goal is to SELL the automation service and schedule a DEMO.`;

        const context = `
CONTEXTO:
- Cliente: Alcalde Diego Ortiz (Obando, Valle)
- Plan: "Amor por lo Nuestro"
- Comunidad indígena: Embera Chamí

PRECIOS (COP):
- ALCALDE DIGITAL: $3M/mes + $5M Setup (Recomendado)
- LEGADO POLÍTICO: $8M/mes + $12M Setup

DICCIONARIO EMBERA CHAMÍ (Respeto cultural):
- Mabae = Hola
- Arakiruma = Gracias
- Sakabuma = ¿Cómo estás?
`;
        return `${slogan}\n\n${roleDescription}\n\n${context}\n\nResponde en máximo 3 oraciones.`;
    }

    _init() {
        this._loadVoices();

        // Ensure voice loading even if event missed
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }

        this._createChatUI();

        // Auto-greet visual cue
        setTimeout(() => {
            if (!this.isOpen) {
                const toggle = document.getElementById('karla-toggle');
                if (toggle) {
                    toggle.style.transform = 'scale(1.1)';
                    setTimeout(() => toggle.style.transform = 'scale(1)', 300);
                }
            }
        }, 3000);
    }

    _loadVoices() {
        let voices = this.synth.getVoices();

        // RETRY MECHANISM: Chrome returns empty array initially
        if (voices.length === 0) {
            setTimeout(() => this._loadVoices(), 100);
            return;
        }

        const isSpanish = this.language === 'es';

        // Expanded list of female Spanish voices
        const spanishVoices = [
            'Microsoft Sabina', 'Microsoft Helena', 'Google español',
            'es-MX', 'es-ES', 'Paulina', 'Hilda', 'Laura', 'Helena'
        ];

        const englishVoices = ['Microsoft Zira', 'Google US English', 'Samantha', 'en-US'];
        const preferred = isSpanish ? spanishVoices : englishVoices;

        // Try to find exact match -> then startsWith lang -> then any lang match
        this.selectedVoice = voices.find(v =>
            preferred.some(p => v.name.includes(p) || v.lang.includes(p))
        ) || voices.find(v => v.lang.startsWith(isSpanish ? 'es' : 'en')) || voices[0];

        if (this.selectedVoice) {
            console.log('✅ KARLA VOICE READY:', this.selectedVoice.name);
        }
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
                    <img src="assets/karla.png" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #fff;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwYjg5NCIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPu🏛️PC90ZXh0Pjwvc3ZnPg=='">
                    <div><h3 style="color:white; font-size:1rem; margin:0;">KARLA</h3><span style="color:rgba(255,255,255,0.8); font-size:0.7rem;">ORION Tech Sales Consultant</span></div>
                    <button id="karla-close" style="margin-left:auto; background:none; border:none; color:#fff; cursor:pointer; font-size:1.5rem;">×</button>
                </div>
                <div id="karla-messages"></div>
                <div id="karla-input-area">
                    <button id="karla-voice-btn">🎤</button>
                    <input type="text" id="karla-input" placeholder="${this.language === 'es' ? 'Escriba su consulta...' : 'Type your question...'}">
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
        // Must interact to unlock audio context in some browsers
        if (this.synth.resume) this.synth.resume();

        const win = document.getElementById('karla-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);

        if (this.isOpen && this.messages.length === 0) {
            this.voiceEnabled = true;
            this._toggleVoiceUI(true);

            const welcome = this.language === 'es'
                ? `¡${this.emberaPhrases.hello}! 🏛️ Soy Karla de ORION Tech. Tengo una propuesta para modernizar la comunicación del Alcalde Diego con los ciudadanos. ¿Se la presento?`
                : `${this.emberaPhrases.hello}! 🏛️ I'm Karla from ORION Tech. I have a proposal to modernize Mayor Diego's communication with citizens. Shall I present it?`;

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
            const key = this._getSecureApiKey();
            if (!key) throw new Error("No API Key");

            const response = await fetch(`${this.apiEndpoint}?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: this.systemPrompt }] },
                        ...this.messages.slice(-10)
                    ],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
                })
            });

            const data = await response.json();
            document.getElementById('karla-typing').remove();

            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
                this._addMessage('karla', reply);
            } else {
                throw new Error("Empty response");
            }

        } catch (e) {
            document.getElementById('karla-typing')?.remove();
            const fallback = this.language === 'es'
                ? "Disculpe, mi conexión es lenta. Por favor contacte al 310 888 4014 directamente."
                : "Sorry, connection is slow. Please contact 310 888 4014 directly.";
            this._addMessage('karla', fallback);
            console.error(e);
        }
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
        // FORCE SPANISH LOCALE: 'es-MX' works best for neutral female voices in most browsers
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
