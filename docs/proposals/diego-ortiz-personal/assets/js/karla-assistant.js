/**
 * KARLA V2 - AI Sales Assistant for Diego Ortiz
 * Fixed: Bilingual offline DB, voice per language, complete API handling
 * Client: Diego Ortiz (Political Figure - Colombia)
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Diego Ortiz';
        this.language = config.language || 'es';
        this.proposalContext = config.proposalContext || '';
        this.pricingTiers = config.pricingTiers || [];

        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.voiceES = null;
        this.voiceEN = null;
        this.voiceEnabled = true;

        this.systemPrompt = this._buildSystemPrompt();
        this._init();
    }

    _buildSystemPrompt() {
        const pricingTable = this.pricingTiers.length > 0
            ? this.pricingTiers.map(t => `${t.name}: $${t.monthly} COP/mes + $${t.setup} Setup`).join('\n')
            : `INICIO: $2M COP/mes + $5M Setup
ALCALDE DIGITAL: $4M COP/mes + $8M Setup (Recomendado)
LÍDER REGIONAL: $8M COP/mes + $15M Setup
LEGADO POLÍTICO: $15M COP/mes + $25M Setup`;

        if (this.language === 'en') {
            return `
You are KARLA, Sales Advisor at ORION Tech Colombia.
Your goal: Sell the personal branding automation platform for politicians.

CLIENT: ${this.clientName}
TYPE: Colombian political figure (Councilman, Mayor candidate)
COUNTRY: Colombia
CURRENCY: Colombian Pesos (COP)

PRICING 2026:
${pricingTable}

CONTEXT:
${this.proposalContext}

POLITICAL VALUE PROPOSITION:
- Diego AI: WhatsApp bot that responds to citizens 24/7
- Automatic PQRS registration (Petitions, Complaints, Claims, Suggestions)
- Community sentiment analysis
- Automatic management reports
- Email/SMS campaigns to communicate achievements
- Citizen interaction metrics dashboard

RULES:
- Respond ONLY in English
- Be professional but approachable
- Focus on citizen connection and modernization
- Always mention specific prices when asked
- Guide towards scheduling a demo call
`;
        }

        return `
Eres KARLA, asesora de ventas de ORION Tech Colombia.
Tu objetivo: Vender la plataforma de automatización para marca personal política.

CLIENTE: ${this.clientName}
TIPO: Personaje político colombiano (Concejal, aspirante a Alcalde)
PAÍS: Colombia
MONEDA: Pesos Colombianos (COP)

PRECIOS 2026:
${pricingTable}

CONTEXTO:
${this.proposalContext}

PROPUESTA DE VALOR POLÍTICA:
- Diego AI: Bot WhatsApp que responde ciudadanos 24/7
- Registro automático de PQRS (Peticiones, Quejas, Reclamos, Sugerencias)
- Análisis de sentimiento de la comunidad
- Reportes de gestión automáticos
- Campañas de email/SMS para comunicar logros
- Dashboard de métricas de interacción ciudadana

MANEJO DE OBJECIONES:
- "Es muy caro": El plan INICIO a $2M COP/mes es menos que el salario de un asistente. Trabaja 24/7 sin descanso.
- "No confío en la tecnología": ORION maneja alcaldías reales como Obando. Tenemos experiencia con gobierno.
- "Después de las elecciones": La visibilidad ahora es crítica. Mientras más rápido active, más ciudadanos conecta.
- "Necesito pensarlo": Le ofrecemos un piloto de 30 días con el plan INICIO.

REGLAS:
- Responde en español colombiano (tuteo, "parcero" ocasional)
- Sé profesional pero cercana
- Enfócate en conexión con ciudadanos y modernización
- Siempre menciona precios específicos cuando pregunten
- No uses emojis excesivos
- Guía hacia agendar una llamada de demostración
`;
    }

    _init() {
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }
        this._createChatUI();

        setTimeout(() => {
            const welcome = this._getGreeting();
            this._addMessage('karla', welcome);
        }, 1500);
    }

    _getGreeting() {
        return this.language === 'en'
            ? `Hi! I'm Karla from ORION Tech. I see ${this.clientName} is ready to connect with thousands of citizens using AI. Want me to explain how it works?`
            : `¡Hola! Soy Karla de ORION Tech. Veo que ${this.clientName} está listo para conectar con miles de ciudadanos usando inteligencia artificial. ¿Te cuento cómo funciona?`;
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        // Spanish voices
        this.voiceES = voices.find(v => v.name.includes('Sabina') || v.name.includes('Paulina') || v.name.includes('Monica'));
        if (!this.voiceES) this.voiceES = voices.find(v => v.lang.startsWith('es-'));
        if (!this.voiceES) this.voiceES = voices.find(v => v.lang.startsWith('es'));

        // English voices
        this.voiceEN = voices.find(v => v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Alex'));
        if (!this.voiceEN) this.voiceEN = voices.find(v => v.lang.startsWith('en-'));
        if (!this.voiceEN) this.voiceEN = voices.find(v => v.lang.startsWith('en'));

        console.log('🔊 Karla Voces:', { ES: this.voiceES?.name, EN: this.voiceEN?.name });
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'karla-chat-container';
        container.innerHTML = `
            <style>
                #karla-chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                #karla-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: linear-gradient(135deg, #a855f7, #7c3aed);
                    border: 3px solid #fff; cursor: pointer;
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
                    transition: transform 0.3s;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                }
                #karla-toggle:hover { transform: scale(1.1); }
                #karla-toggle img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
                
                #karla-chat-window {
                    display: none; width: 380px; height: 500px;
                    background: #0a0a0a; border: 1px solid #333;
                    border-radius: 16px; overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                    flex-direction: column; position: absolute; bottom: 85px; right: 0;
                }
                #karla-chat-window.open { display: flex; }
                
                #karla-header {
                    background: linear-gradient(135deg, #a855f7, #7c3aed);
                    padding: 15px; display: flex; align-items: center; gap: 12px; color: white;
                }
                #karla-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
                .karla-msg { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; }
                .karla-msg.karla { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168,85,247,0.3); color: #fff; align-self: flex-start; }
                .karla-msg.user { background: rgba(255,255,255,0.1); color: #fff; align-self: flex-end; }
                
                #karla-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; background: #0a0a0a; }
                #karla-input { flex: 1; background: #1a1a1a; border: 1px solid #444; border-radius: 25px; padding: 12px 20px; color: #fff; outline: none; }
                #karla-send { background: #a855f7; color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; font-size: 18px; }
                #karla-send:disabled { background: #666; cursor: not-allowed; }
            </style>
            
            <div id="karla-chat-window">
                <div id="karla-header">
                    <img src="assets/karla.png" onerror="this.src='https://via.placeholder.com/50?text=K'" style="width:40px;height:40px;border-radius:50%;border:2px solid white;">
                    <div><strong>KARLA</strong><br><small>ORION Sales AI</small></div>
                    <button id="karla-close" style="margin-left:auto;background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;">×</button>
                </div>
                <div id="karla-messages"></div>
                <div id="karla-input-area">
                    <input type="text" id="karla-input" placeholder="${this.language === 'en' ? 'Type your message...' : 'Escribe tu mensaje...'}">
                    <button id="karla-send">➤</button>
                </div>
            </div>
            
            <button id="karla-toggle">
                <img src="assets/karla.png" onerror="this.src='https://via.placeholder.com/100?text=KARLA'">
            </button>
        `;
        document.body.appendChild(container);

        document.getElementById('karla-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('karla-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this._sendMessage();
        });
    }

    _toggleChat() {
        this.isOpen = !this.isOpen;
        document.getElementById('karla-chat-window').classList.toggle('open', this.isOpen);
        if (this.isOpen) {
            document.getElementById('karla-input').focus();
            document.getElementById('karla-input').placeholder = this.language === 'en' ? 'Type your message...' : 'Escribe tu mensaje...';
        }
    }

    _addMessage(role, text) {
        const messagesDiv = document.getElementById('karla-messages');
        const msg = document.createElement('div');
        msg.className = `karla-msg ${role}`;
        msg.textContent = text;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        this.messages.push({ role, text });
        if (role === 'karla' && this.voiceEnabled && text !== '...') this._speak(text);
        return msg;
    }

    _getApiKey() {
        if (window.KARLA_KEYS && window.KARLA_KEYS.getKey) return window.KARLA_KEYS.getKey();
        if (window.__MARIO_CONFIG__ && window.__MARIO_CONFIG__.apiKey) return window.__MARIO_CONFIG__.apiKey;
        return null;
    }

    // --- BILINGUAL OFFLINE DATABASE ---
    _getOfflineResponse(text) {
        const t = text.toLowerCase();

        if (this.language === 'en') {
            if (t.includes('hello') || t.includes('hi')) return `Hi! I'm Karla from ORION Tech. I have a proposal to automate ${this.clientName}'s citizen communication. Interested in seeing the numbers?`;
            if (t.includes('price') || t.includes('cost')) return "The investment starts at $2M COP/month, but you recover $5M/month in leads that would otherwise be lost. Positive ROI from day one.";
            if (t.includes('time') || t.includes('implement')) return "In 15 days we have everything running. Configuration, AI training, and WhatsApp connection. Without interrupting your current operation.";
            if (t.includes('schedule') || t.includes('meeting') || t.includes('demo')) return "Absolutely! I can schedule a short demo to show you how it works live. What day works best for you?";
            if (t.includes('what') || t.includes('how')) return "ORION automates citizen communication via WhatsApp AI, registers PQRS automatically, and provides sentiment analytics. Would you like a quick example?";
            return "That's exactly the type of problem ORION solves by automating communication. May I show you a quick example?";
        }

        // Spanish (default)
        if (t.includes('hola') || t.includes('buenas')) return `¡Hola! Soy Karla de ORION Tech. Tengo una propuesta para automatizar la comunicación de ${this.clientName} con los ciudadanos. ¿Te interesa ver números?`;
        if (t.includes('precio') || t.includes('costo') || t.includes('vale') || t.includes('cuanto')) return "La inversión inicia en $2M COP/mes, pero recuperas $5M/mes en leads que hoy se pierden. El ROI es positivo desde el primer día.";
        if (t.includes('implement') || t.includes('tiempo') || t.includes('demora')) return "En 15 días dejamos todo rodando. Configuración, entrenamiento de IA y conexión a WhatsApp. Sin interrumpir tu operación actual.";
        if (t.includes('agendar') || t.includes('reunion') || t.includes('cita') || t.includes('demo')) return "¡Claro! Puedo agendar una demo corta para mostrarte cómo funciona en vivo. ¿Qué día te queda mejor?";
        if (t.includes('que') || t.includes('como')) return "ORION automatiza la comunicación ciudadana vía WhatsApp AI, registra PQRS automáticamente y da analíticas de sentimiento. ¿Te muestro un ejemplo rápido?";
        if (t.includes('diego') || t.includes('alcalde')) return "Diego Ortiz conectará con miles de ciudadanos 24/7 a través de nuestro bot de WhatsApp. Es la nueva política digital.";
        return "Ese es exactamente el tipo de problema que ORION resuelve automatizando la comunicación. ¿Me permites mostrarte un ejemplo rápido?";
    }

    async _sendMessage() {
        const input = document.getElementById('karla-input');
        const sendBtn = document.getElementById('karla-send');
        const text = input.value.trim();

        if (!text) return;

        input.value = '';
        this._addMessage('user', text);
        sendBtn.disabled = true;

        const apiKey = this._getApiKey();
        if (!apiKey) {
            // No API key: use offline response directly
            console.warn('No API Key. Modo Offline.');
            setTimeout(() => {
                this._addMessage('karla', this._getOfflineResponse(text));
                sendBtn.disabled = false;
            }, 500);
            return;
        }

        const loadingMsg = this._addMessage('karla', '...');

        try {
            const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: this.systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text }] }]
                })
            });

            if (!response.ok) throw new Error('API_FAIL_' + response.status);

            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || this._getOfflineResponse(text);
            loadingMsg.textContent = reply;
            this._speak(reply);

        } catch (error) {
            console.warn('Karla API Error. Using Offline.', error);
            const offlineReply = this._getOfflineResponse(text);
            loadingMsg.textContent = offlineReply;
            this._speak(offlineReply);
        } finally {
            sendBtn.disabled = false;
        }
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;
        this.synth.cancel();

        const cleanText = text.replace(/[*_#`]/g, '').replace(/\n+/g, '. ');
        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Use appropriate voice based on language
        if (this.language === 'en') {
            utterance.voice = this.voiceEN;
            utterance.lang = 'en-US';
        } else {
            utterance.voice = this.voiceES;
            utterance.lang = 'es-CO';
        }

        utterance.rate = 0.95;
        utterance.pitch = 1.1;
        this.synth.speak(utterance);
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        console.log('✅ Karla Language set to:', lang);
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (window.KARLA_CONFIG) {
        window.karla = new KarlaAssistant(window.KARLA_CONFIG);
        console.log('✅ Karla V2 AI Assistant initialized');
    }
});
