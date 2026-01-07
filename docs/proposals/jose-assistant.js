/**
 * JOSE - AI Sales Assistant for ORION Tech Proposals
 * VERSION: FIXED (NO EMOJIS, EMERGENCY KEY, ROBUST VOICE)
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 */

class JoseAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Client';
        this.clientPhone = config.clientPhone || '(669) 234-2444';
        this.language = config.language || 'en';
        this.ownerName = config.ownerName || '';
        this.managerName = config.managerName || '';
        this.proposalContext = config.proposalContext || '';
        this.competitorAdvantages = config.competitorAdvantages || [];
        this.pricingTiers = config.pricingTiers || [];
        this.painPoints = config.painPoints || [];
        this.customSavings = config.customSavings || null;

        // Secure API configuration (proxied)
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.voiceEnabled = false;

        // System prompt for sales-focused AI
        this.systemPrompt = this._buildSystemPrompt();

        this._init();
    }

    _buildSystemPrompt() {
        // CLEAN PROMPT - NO EMOJIS
        const lang = this.language === 'es' ? 'Español' : 'English';

        return `
ROL: JOSE, Consultor de Negocios Senior (Automotriz).
OBJETIVO: Vender soluciones ORION Tech. Agendar DEMO.
TONO: Profesional, Directo, Autoridad en Negocios. De empresario a empresario.

INSTRUCCIONES CLAVE:
1. NO uses emojis ni iconos. Solo texto plano.
2. Se breve. Maximo 3 oraciones.
3. Si preguntan precio, justifica con ROI.
4. Siempre cierra con una pregunta o llamada a la accion.

CONTEXTO CLIENTE:
- Cliente: ${this.clientName}
- Dueño: ${this.ownerName}
- Pain Points: ${this.painPoints.join(', ')}

PRECIOS Y SOLUCIONES:
${this.pricingTiers.map(t => `- ${t.name}: $${t.monthly}/mes + $${t.setup} setup`).join('\n')}

ESTRATEGIA DE CIERRE:
- Objecion Precio: Enfocate en el costo de NO tomar accion (llamadas perdidas, tiempos muertos).
- Objecion Tiempo: "La inaccion cuesta dinero. Hagamos una demo rapida."

IDIOMA DE RESPUESTA: ${lang}
`;
    }

    _init() {
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }
        this._createChatUI();

        // Safe delay for Voice Init & Autoplay
        setTimeout(() => {
            const targetName = this.ownerName || this.managerName || '';
            let savingsMsgEs = "";
            let savingsMsgEn = "";

            if (this.customSavings) {
                savingsMsgEs = `ahorrar más de ${this.customSavings} dólares al mes`;
                savingsMsgEn = `save over $${this.customSavings} per month`;
            } else {
                const topPrice = this.pricingTiers?.[this.pricingTiers.length - 1]?.monthly || 4500;
                const estimatedSavings = Math.round(topPrice * 5 / 1000) * 1000;
                savingsMsgEs = `ahorrar más de ${(estimatedSavings / 1000).toFixed(0)} mil dólares al mes`;
                savingsMsgEn = `save over $${(estimatedSavings / 1000).toFixed(0)}k per month`;
            }

            const welcome = this.language === 'es'
                ? `${targetName ? 'Hola ' + targetName + '. ' : 'Hola. '}Soy JOSE de ORION Tech. Tengo una propuesta para ${savingsMsgEs} en ${this.clientName}. ¿Te explico cómo?`
                : `${targetName ? 'Hello ' + targetName + '. ' : 'Hello. '}I'm JOSE from ORION Tech. I have a proposal to ${savingsMsgEn} for ${this.clientName}. Shall I explain?`;

            // ONE-TIME CLICK RESUME (Fix "Ya no hablan")
            const resumeAudio = () => { if (this.synth.paused) this.synth.resume(); };
            document.body.addEventListener('click', resumeAudio, { once: true, capture: true });

            this._addMessage('jose', welcome);
        }, 2000);
    }

    _loadVoices() {
        let voices = this.synth.getVoices();
        if (voices.length === 0) {
            setTimeout(() => this._loadVoices(), 100);
            return;
        }

        const isSpanish = this.language === 'es';

        // MALE VOICES STRATEGY
        const raul = voices.find(v => v.name.includes('Raul'));
        const david = voices.find(v => v.name.includes('David'));
        const googleEs = voices.find(v => v.name.includes('Google español'));
        const googleEn = voices.find(v => v.name.includes('Google US English'));
        const alex = voices.find(v => v.name.includes('Alex'));

        if (isSpanish) {
            this.selectedVoice = raul || googleEs;
            if (!this.selectedVoice) {
                // Fallback Spanish Male check
                this.selectedVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Pablo') || v.name.includes('Male')));
            }
        } else {
            this.selectedVoice = david || googleEn || alex;
            if (!this.selectedVoice) {
                this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Male') || v.name.includes('Guy')));
            }
        }

        if (!this.selectedVoice) this.selectedVoice = voices[0];
        console.log('VOZ JOSE:', this.selectedVoice ? this.selectedVoice.name : 'Default');
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        container.innerHTML = `
            <style>
                #jose-chat-container { position: fixed; bottom: 100px; left: 20px; z-index: 10000; font-family: 'Segoe UI', sans-serif; }
                #jose-toggle { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #ff6b00, #ff8c00); border: 3px solid #ffd700; cursor: pointer; box-shadow: 0 0 20px rgba(255, 107, 0, 0.6); transition: transform 0.3s; padding: 0; display:flex; align-items:center; justify-content:center; }
                #jose-toggle:hover { transform: scale(1.15); }
                #jose-toggle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
                #jose-chat-window { display: none; width: 380px; height: 500px; background: #0a0a12; border: 1px solid rgba(255, 107, 0, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); flex-direction: column; position: absolute; bottom: 80px; left: 0; }
                #jose-chat-window.open { display: flex; }
                #jose-header { background: linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 215, 0, 0.1)); padding: 15px; display: flex; align-items: center; gap: 12px; }
                #jose-header img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #ff6b00; object-fit: cover; }
                #jose-messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
                .jose-message { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; color: #fff; }
                .jose-message.jose { background: rgba(255, 107, 0, 0.15); border: 1px solid rgba(255, 107, 0, 0.3); align-self: flex-start; }
                .jose-message.user { background: rgba(255, 255, 255, 0.1); align-self: flex-end; }
                #jose-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; background: #0a0a12; }
                #jose-input { flex: 1; background: #1a1a1a; border: 1px solid #444; border-radius: 25px; padding: 12px 20px; color: #fff; outline: none; }
                #jose-send { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #ff6b00, #ff8c00); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #jose-voice-btn { width: 35px; height: 35px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 107, 0, 0.5); color: #ff6b00; cursor: pointer; display:flex; align-items:center; justify-content:center;}
            </style>
            
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" onerror="this.style.display='none'">
                    <div><h3 style="color:white; margin:0; font-size:1rem;">JOSE</h3><span style="color:#ff6b00; font-size:0.7rem;">AI Sales Assistant</span></div>
                    <button id="jose-close" style="margin-left:auto; background:none; border:none; color:#fff; cursor:pointer; font-size:1.5rem;">×</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <button id="jose-voice-btn">🎤</button>
                    <input type="text" id="jose-input" placeholder="Mensaje...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
            
            <button id="jose-toggle">
                <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" onerror="this.style.display='none'; this.parentElement.innerHTML='J'">
            </button>
        `;

        document.body.appendChild(container);

        document.getElementById('jose-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('jose-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
        document.getElementById('jose-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    _toggleChat() {
        if (this.synth.resume) this.synth.resume();
        const win = document.getElementById('jose-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);

        if (this.isOpen) { // Ensure voice is ready when opened
            this.voiceEnabled = true;
            this._toggleVoiceUI(true);
        }
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `jose-message ${sender}`;
        div.textContent = text;
        document.getElementById('jose-messages').appendChild(div);

        if (this.messages.length > 20) this.messages.shift();
        this.messages.push({ role: sender === 'jose' ? 'model' : 'user', parts: [{ text }] });

        if (sender === 'jose') this._speak(text); // Speak always if message is added (control via voiceEnabled in _speak)

        const container = document.getElementById('jose-messages');
        container.scrollTop = container.scrollHeight;
    }

    async _sendMessage() {
        const input = document.getElementById('jose-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);

        const typing = document.createElement('div');
        typing.className = 'jose-message jose';
        typing.id = 'jose-typing';
        typing.textContent = '...';
        document.getElementById('jose-messages').appendChild(typing);

        try {
            const response = await this._callGemini(text);
            document.getElementById('jose-typing').remove();
            this._addMessage('jose', response);
        } catch (e) {
            document.getElementById('jose-typing')?.remove();
            console.error('API FAIL:', e);
            const fallback = this._getFallbackResponse(text);
            this._addMessage('jose', fallback);
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) throw new Error("Missing API Key");

        const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: this.systemPrompt }] },
                    ...this.messages.slice(-10),
                    { role: 'user', parts: [{ text: userMessage }] }
                ],
                generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) throw new Error("Empty JSON");
        return reply;
    }

    _getFallbackResponse(text) {
        const msg = text.toLowerCase();
        if (msg.includes('precio')) return "El plan recomendado es el FLEET: $2,500/mes. Te ahorrara 3 veces eso en el primer mes. Vemos los numeros?";
        return "Entiendo. La tecnologia de Orion esta diseñada para hacer crecer tu taller. Te gustaria ver una demo rapida?";
    }

    _getSecureApiKey() {
        if (window.ORION_CONFIG && typeof window.ORION_CONFIG.getAuth === 'function') {
            const k = window.ORION_CONFIG.getAuth();
            if (k) return k;
        }
        const keys = ['jose_api_key', 'karla_api_key', 'mario_api_key'];
        for (const k of keys) {
            const stored = localStorage.getItem(k);
            if (stored) try { return atob(stored); } catch (e) { }
        }
        // EMERGENCY KEY
        return 'AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8';
    }

    _speak(text) {
        if (!this.synth) return;
        // Default voiceEnabled is false initially for Jose unless toggled, BUT WE WANT AUTOPLAY
        // Actually for Jose/Elisa autoplay is key.
        // We will assume enabled if it's the Welcome message (called from init) OR if toggle is on.
        // Simplified: Use internal voiceEnabled flag.

        // AUTO-ENABLE FOR WELCOME:
        if (!this.voiceEnabled && text.includes('JOSE')) this.voiceEnabled = true;

        if (!this.voiceEnabled) return;

        this.synth.cancel();

        // CLEAN EMOJIS
        const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
            .replace(/\*/g, '');

        const u = new SpeechSynthesisUtterance(cleanText);
        u.voice = this.selectedVoice;
        u.lang = this.language === 'es' ? 'es-US' : 'en-US';
        u.pitch = 1.0; u.rate = 1.0;
        this.synth.speak(u);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        this._toggleVoiceUI(this.voiceEnabled);
        if (!this.voiceEnabled) this.synth.cancel();
    }

    _toggleVoiceUI(enabled) {
        const btn = document.getElementById('jose-voice-btn');
        if (btn) {
            btn.style.background = enabled ? 'linear-gradient(135deg, #ff6b00, #ff8c00)' : 'transparent';
            btn.textContent = enabled ? '🔊' : '🔇';
        }
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        this._loadVoices();
        if (this.isOpen) this._addMessage('jose', lang === 'es' ? "Cambiando idioma..." : "Switching language...");
    }
}

window.JoseAssistant = JoseAssistant;

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('mcProposalLang') || 'en';
    const config = window.JOSE_CONFIG || {};
    config.language = savedLang;
    window.jose = new JoseAssistant(config);
});
