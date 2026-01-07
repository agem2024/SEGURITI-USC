/**
 * KARLA - AI Political Brand Consultant
 * VERSION: V2 - FINAL RESCUE (Windows Voice + Emergency Key)
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Alcalde Diego Ortiz';
        this.clientPhone = config.clientPhone || '+57 310 888 4014';
        this.language = config.language || 'es';
        this.ownerName = config.ownerName || 'Diego Armando Ortiz Buitrago';

        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.voiceEnabled = false;

        this.systemPrompt = this._buildSystemPrompt();
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
- Si preguntan precio: justifica con ROI.
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

        setTimeout(() => {
            const welcome = this.language === 'es'
                ? `¡Mabae! 🏛️ Soy Karla de ORION Tech. Tengo una propuesta para potenciar la marca personal del Alcalde Diego y conectar con los ciudadanos 24/7. ¿Me permite mostrarle cómo?`
                : `Mabae! 🏛️ I'm Karla from ORION Tech. I have a proposal to boost Mayor Diego's personal brand and connect with citizens 24/7. May I show you how?`;
            this._addMessage('karla', welcome);
        }, 500);
    }

    _loadVoices() {
        let voices = this.synth.getVoices();
        if (voices.length === 0) {
            setTimeout(() => this._loadVoices(), 100);
            return;
        }

        const isSpanish = this.language === 'es';

        // ESTRATEGIA DE SELECCIÓN DE VOZ (WINDOWS/CHROME)
        const sabina = voices.find(v => v.name.includes('Sabina'));
        const helena = voices.find(v => v.name.includes('Helena'));
        const googleEs = voices.find(v => v.name.includes('Google español'));
        const zira = voices.find(v => v.name.includes('Zira'));
        const googleEn = voices.find(v => v.name.includes('Google US English'));

        if (isSpanish) {
            this.selectedVoice = sabina || googleEs || helena;
            if (!this.selectedVoice) {
                this.selectedVoice = voices.find(v => v.lang.startsWith('es') && !v.name.includes('Raul') && !v.name.includes('Pablo'));
            }
        } else {
            this.selectedVoice = zira || googleEn;
            if (!this.selectedVoice) {
                this.selectedVoice = voices.find(v => v.lang.startsWith('en') && !v.name.includes('David') && !v.name.includes('Mark'));
            }
        }

        if (!this.selectedVoice) {
            console.warn('⚠️ NO VOICE FOUND, USING DEFAULT');
            this.selectedVoice = voices[0];
        } else {
            console.log('✅ VOZ KARLA ACTIVADA:', this.selectedVoice.name);
        }
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'karla-chat-container';
        container.innerHTML = `
            <style>
                #karla-chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Segoe UI', sans-serif; }
                #karla-toggle { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #0984e3 0%, #00b894 100%); border: 3px solid #fff; cursor: pointer; box-shadow: 0 0 20px rgba(9, 132, 227, 0.6); transition: transform 0.3s; padding: 0; display:flex; align-items:center; justify-content:center; }
                #karla-toggle:hover { transform: scale(1.15); }
                #karla-toggle img { width: 100%; height: 100%; object-fit: cover; border-radius:50%;}
                #karla-chat-window { display: none; width: 380px; height: 500px; background: #1a1a1a; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); flex-direction: column; position: absolute; bottom: 80px; right: 0; }
                #karla-chat-window.open { display: flex; }
                #karla-header { background: linear-gradient(135deg, #0984e3 0%, #00b894 100%); padding: 15px; display: flex; align-items: center; gap: 12px; }
                #karla-header img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #fff; object-fit: cover; }
                #karla-messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
                .karla-message { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; }
                .karla-message.karla { background: rgba(0, 184, 148, 0.15); color: #fff; align-self: flex-start; border: 1px solid rgba(0, 184, 148, 0.3); }
                .karla-message.user { background: rgba(255, 255, 255, 0.1); color: #fff; align-self: flex-end; }
                #karla-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; background: #1a1a1a; }
                #karla-input { flex: 1; background: #252525; border: 1px solid #444; border-radius: 25px; padding: 12px 20px; color: #fff; outline: none; }
                #karla-send { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #0984e3 0%, #00b894 100%); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #karla-voice-btn { width: 35px; height: 35px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 1px solid #555; color: #00b894; cursor: pointer; display:flex; align-items:center; justify-content:center;}
            </style>
            
            <div id="karla-chat-window">
                <div id="karla-header">
                    <img src="assets/karla.png" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwYjg5NCIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPu🏛️PC90ZXh0Pjwvc3ZnPg=='">
                    <div><h3 style="color:white; margin:0; font-size:1rem;">KARLA</h3><span style="color:rgba(255,255,255,0.8); font-size:0.7rem;">ORION Tech Consultant</span></div>
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
                <img src="assets/karla.png" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwYjg5NCIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPu🏛️PC90ZXh0Pjwvc3ZnPg=='">
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
        if (this.synth.resume) this.synth.resume();
        const win = document.getElementById('karla-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);

        if (this.isOpen && this.messages.length === 0) {
            this.voiceEnabled = true;
            this._toggleVoiceUI(true);
        } else if (this.isOpen && this.messages.length === 1) { // Re-enable voice if reopened and only welcome exists
            this.voiceEnabled = true;
            this._toggleVoiceUI(true);
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

        input.value = '';
        this._addMessage('user', text);

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
            console.error('API FAIL:', e);
            const fallback = this._getFallbackResponse(text);
            this._addMessage('karla', fallback + ` (Debug: ${e.message})`);
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
        if (msg.includes('precio')) return "El plan ALCALDE DIGITAL es el recomendado: $3M/mes + setup. ¿Agendamos?";
        return "Disculpe, conexión lenta. Llame al 310 888 4014.";
    }

    _getSecureApiKey() {
        if (window.ORION_CONFIG && typeof window.ORION_CONFIG.getAuth === 'function') {
            const k = window.ORION_CONFIG.getAuth();
            if (k) return k;
        }
        const keys = ['karla_api_key', 'jose_api_key'];
        for (const k of keys) {
            const stored = localStorage.getItem(k);
            if (stored) try { return atob(stored); } catch (e) { }
        }
        // EMERGENCY KEY
        console.warn('⚠️ USING EMERGENCY KEY');
        return 'AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8';
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.voice = this.selectedVoice;
        u.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        u.pitch = 1.1; u.rate = 1.0;
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
            btn.style.background = enabled ? 'linear-gradient(135deg, #0984e3 0%, #00b894 100%)' : 'transparent';
            btn.textContent = enabled ? '🔊' : '🔇';
        }
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        this._loadVoices();
        if (this.isOpen) this._addMessage('karla', lang === 'es' ? "Cambiando idioma..." : "Switching language...");
    }
}

window.KarlaAssistant = KarlaAssistant;

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('mcProposalLang') || 'es';
    const config = window.KARLA_CONFIG || {};
    config.language = savedLang;
    window.karla = new KarlaAssistant(config);
});
