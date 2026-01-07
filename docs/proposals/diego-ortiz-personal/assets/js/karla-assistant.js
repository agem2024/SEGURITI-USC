/**
 * KARLA - AI Political Brand Consultant for Mayor Diego Ortiz
 * TRILINGUAL: Español | English | Embera Chamí (Obando)
 * Female Voice | Gemini AI Powered
 * CLONED FROM FUNCTIONAL JOSE ASSISTANT
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Alcalde Diego Ortiz';
        this.clientPhone = config.clientPhone || '+57 310 888 4014';
        this.language = config.language || 'es';
        this.ownerName = config.ownerName || 'Diego Armando Ortiz Buitrago';

        // Secure API configuration (proxied)
        // EXACT SAME ENDPOINT AS JOSE - DO NOT CHANGE
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;

        // System prompt for sales-focused AI
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
- Si preguntan precio: justifica con ROI (votos, conexión ciudadana).
- Máximo 3 oraciones.
- Cierra siempre invitando a una DEMO.
`;
    }

    _init() {
        // Find appropriate FEMALE voice
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }

        // Create UI elements
        this._createChatUI();

        // Add welcome message (matches the spoken greeting)
        setTimeout(() => {
            const welcome = this.language === 'es'
                ? `¡Mabae! 🏛️ Soy Karla de ORION Tech. Tengo una propuesta para potenciar la marca personal del Alcalde Diego y conectar con los ciudadanos 24/7. ¿Me permite mostrarle cómo?`
                : `Mabae! 🏛️ I'm Karla from ORION Tech. I have a proposal to boost Mayor Diego's personal brand and connect with citizens 24/7. May I show you how?`;
            this._addMessage('karla', welcome);
        }, 500);
    }

    _loadVoices() {
        // RETRY MECHANISM (Crucial for Chrome)
        let voices = this.synth.getVoices();
        if (voices.length === 0) {
            setTimeout(() => this._loadVoices(), 100);
            return;
        }

        const isSpanish = this.language === 'es';

        // 1. FEMALE PRIORITIES
        const femaleNames = [
            'Sabina', 'Helena', 'Paulina', 'Laura', 'Hilda', 'Google español', // ES
            'Samantha', 'Zira', 'Google US English' // EN
        ];

        // 2. MALE EXCLUSIONS
        const maleNames = ['David', 'Raul', 'Pablo', 'Stefan', 'Mark', 'George', 'Jose'];

        let bestVoice = null;
        const langCode = isSpanish ? 'es' : 'en';

        // Filter valid voices for language
        const validVoices = voices.filter(v => v.lang.startsWith(langCode));

        // Find best female
        bestVoice = validVoices.find(v => femaleNames.some(n => v.name.includes(n)));

        // If not, find any non-male
        if (!bestVoice) {
            bestVoice = validVoices.find(v => !maleNames.some(m => v.name.includes(m)));
        }

        this.selectedVoice = bestVoice || validVoices[0] || voices[0];

        if (this.selectedVoice) {
            console.log('✅ VOZ KARLA:', this.selectedVoice.name);
        }
    }

    _createChatUI() {
        // Create chat container
        const container = document.createElement('div');
        container.id = 'karla-chat-container';
        container.innerHTML = `
            <style>
                #karla-chat-container {
                    position: fixed; bottom: 100px; right: 20px; z-index: 10000;
                    font-family: 'Segoe UI', sans-serif;
                }
                #karla-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: linear-gradient(135deg, #0984e3 0%, #00b894 100%);
                    border: 3px solid #fff;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(9, 132, 227, 0.6);
                    transition: transform 0.3s;
                    overflow: hidden; padding: 0;
                }
                #karla-toggle:hover { transform: scale(1.15); }
                #karla-toggle img { width: 100%; height: 100%; object-fit: cover; }
                
                #karla-chat-window {
                    display: none; width: 380px; height: 500px;
                    background: #1a1a1a; border: 1px solid #333;
                    border-radius: 16px; overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    flex-direction: column;
                    position: absolute; bottom: 80px; right: 0;
                }
                #karla-chat-window.open { display: flex; }
                
                #karla-header {
                    background: linear-gradient(135deg, #0984e3 0%, #00b894 100%);
                    padding: 15px; display: flex; align-items: center; gap: 12px;
                }
                #karla-header img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #fff; object-fit: cover; }
                #karla-messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
                
                .karla-message { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; }
                .karla-message.karla { background: rgba(0, 184, 148, 0.15); color: #fff; align-self: flex-start; border: 1px solid rgba(0, 184, 148, 0.3); }
                .karla-message.user { background: rgba(255, 255, 255, 0.1); color: #fff; align-self: flex-end; }
                
                #karla-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; background: #1a1a1a; }
                #karla-input { flex: 1; background: #252525; border: 1px solid #444; border-radius: 25px; padding: 12px 20px; color: #fff; outline: none; }
                #karla-send { width: 45px; height: 45px; border-radius: 50%; background: linear-gradient(135deg, #0984e3 0%, #00b894 100%); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #karla-voice-btn { width: 35px; height: 35px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 1px solid #555; color: #00b894; cursor: pointer; }
            </style>
            
            <div id="karla-chat-window">
                <div id="karla-header">
                    <img src="assets/karla.png" style="width:40px; height:40px; object-fit:cover;" onerror="this.style.display='none'">
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
                <img src="assets/karla.png" onerror="this.style.display='none'; this.parentElement.innerHTML='🏛️'">
            </button>
        `;

        document.body.appendChild(container);

        document.getElementById('karla-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('karla-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this._sendMessage();
        });
        document.getElementById('karla-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    _toggleChat() {
        if (this.synth.resume) this.synth.resume(); // Unlock audio

        const chatWindow = document.getElementById('karla-chat-window');
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('open', this.isOpen);

        // Greet with voice when opening (COPIED FROM JOSE)
        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            this.voiceEnabled = true;

            const vBtn = document.getElementById('karla-voice-btn');
            if (vBtn) {
                vBtn.style.background = this.uiConfig.gradient;
                vBtn.textContent = '🔊';
            }

            // Speak the welcome message
            setTimeout(() => {
                const welcome = this.language === 'es'
                    ? `¡Mabae! 🏛️ Soy Karla de ORION Tech. Tengo una propuesta para potenciar la marca personal del Alcalde Diego. ¿Me permite mostrarle?`
                    : `Mabae! 🏛️ I'm Karla from ORION Tech. I have a proposal to boost Mayor Diego's personal brand. May I show you?`;
                this._speak(welcome);
            }, 300);
        }
    }

    _addMessage(sender, text) {
        const messagesContainer = document.getElementById('karla-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `karla-message ${sender}`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (sender === 'karla' && this.voiceEnabled) {
            this._speak(text);
        }

        this.messages.push({ role: sender === 'karla' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('karla-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);

        // Typing indicator
        const typing = document.createElement('div');
        typing.className = 'karla-message karla';
        typing.id = 'karla-typing';
        typing.textContent = '...';
        document.getElementById('karla-messages').appendChild(typing);

        try {
            const response = await this._callGemini(text);
            document.getElementById('karla-typing').remove();
            this._addMessage('karla', response);
        } catch (error) {
            document.getElementById('karla-typing')?.remove();
            console.error('KARLA Error:', error);
            const fallback = this._getFallbackResponse(text);
            this._addMessage('karla', fallback);
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();

        if (!apiKey) {
            console.warn('⚠️ KARLA: No API key found');
            return this._getFallbackResponse(userMessage);
        }

        try {
            const requestBody = {
                contents: [
                    { role: 'user', parts: [{ text: this.systemPrompt }] },
                    ...this.messages.slice(-10),
                    { role: 'user', parts: [{ text: userMessage }] }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 400,
                    topP: 0.9
                }
            };

            const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                console.error('KARLA API Error:', response.status);
                return this._getFallbackResponse(userMessage);
            }

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiResponse) {
                console.error('KARLA: Empty response');
                return this._getFallbackResponse(userMessage);
            }

            return aiResponse;

        } catch (error) {
            console.error('KARLA API Exception:', error);
            return this._getFallbackResponse(userMessage);
        }
    }

    _getFallbackResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        // Fallback simple
        if (msg.includes('precio')) {
            return "El plan ALCALDE DIGITAL es el más recomendado: $3M/mes + $5M Setup. ¿Le gustaría ver una demo?";
        }
        return `Disculpe, mi conexión está lenta. Por favor contacte al 310 888 4014 para atención inmediata.`;
    }

    _getSecureApiKey() {
        // Priority 1: ORION_CONFIG (from jose-loader.js)
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
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;

        const isSpanish = this.language === 'es';
        utterance.rate = isSpanish ? 0.9 : 1.0;
        utterance.pitch = 1.1; // Female tone
        utterance.volume = 1.0;
        utterance.lang = isSpanish ? 'es-MX' : 'en-US';

        this.synth.speak(utterance);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('karla-voice-btn');

        if (this.voiceEnabled) {
            btn.style.background = this.uiConfig.gradient;
            btn.textContent = '🔊';
        } else {
            this.synth.cancel();
            btn.style.background = 'transparent';
            btn.textContent = '🔇';
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
    if (window.KARLA_CONFIG) {
        window.karla = new KarlaAssistant(window.KARLA_CONFIG);
    } else {
        // Fallback config if not in HTML
        window.karla = new KarlaAssistant({ language: 'es' });
    }
});
