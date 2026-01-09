/**
 * KARLA - AI Sales Assistant for ORION Tech
 * Client: Diego Ortiz (Political Figure - Colombia)
 * Bilingual (ES/EN) | Female Voice | Gemini AI Powered
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
        this.selectedVoice = null;
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
            const welcome = this.language === 'es'
                ? `Hola! Soy Karla de ORION Tech. Veo que ${this.clientName} está listo para conectar con miles de ciudadanos usando inteligencia artificial. ¿Te cuento cómo funciona?`
                : `Hi! I'm Karla from ORION Tech. I see ${this.clientName} is ready to connect with thousands of citizens using AI. Want me to explain how it works?`;
            this._addMessage('karla', welcome);
        }, 1500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const preferred = this.language === 'es'
            ? ['Microsoft Sabina', 'Paulina', 'Google español', 'Monica']
            : ['Microsoft Zira', 'Samantha', 'Google US English Female'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
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
                    <input type="text" id="karla-input" placeholder="Escribe tu mensaje...">
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
        if (this.isOpen) document.getElementById('karla-input').focus();
    }

    _addMessage(role, text) {
        const messagesDiv = document.getElementById('karla-messages');
        const msg = document.createElement('div');
        msg.className = `karla-msg ${role}`;
        msg.textContent = text;
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        this.messages.push({ role, text });
        if (role === 'karla' && this.voiceEnabled) this._speak(text);
        return msg;
    }

    async _getApiKey() {
        if (window.KARLA_KEYS && window.KARLA_KEYS.getKey) return window.KARLA_KEYS.getKey();
        return null;
    }

    async _sendMessage(textArg = null, retryCount = 0) {
        const input = document.getElementById('karla-input');
        const sendBtn = document.getElementById('karla-send');
        const text = textArg || input.value.trim();

        if (!text) return;

        if (!textArg) {
            // Only clear input if it came from UI
            input.value = '';
            this._addMessage('user', text);
            sendBtn.disabled = true;
        }

        const apiKey = this._getApiKey();
        if (!apiKey) {
            this._addMessage('karla', '⚠️ API Key no configurada. Contacta soporte.');
            sendBtn.disabled = false;
            return;
        }

        // Only show loading if first attempt
        let loadingMsg;
        if (retryCount === 0) {
            loadingMsg = this._addMessage('karla', '...');
        } else {
            // Find the last message (which should be "...")
            const msgs = document.getElementById('karla-messages').children;
            loadingMsg = msgs[msgs.length - 1];
            loadingMsg.textContent = '... (Connecting)';
        }

        try {
            const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: this.systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text }] }]
                })
            });

        } catch (error) {
            console.error('Karla API Fail. Using Offline Backup.', error);
            const offlineReply = this._getOfflineResponse(text);
            loadingMsg.textContent = offlineReply;
            this._speak(offlineReply);
        } finally {
            if (retryCount === 0 || !sendBtn.disabled) {
                sendBtn.disabled = false;
            }
        }
    }

    _getOfflineResponse(text) {
        const t = text.toLowerCase();
        // KARLA PERSONA: Friendly, efficient, focused on Diego Ortiz's goals
        if (t.includes('hola') || t.includes('hi')) return "¡Hola! Soy Karla. Tengo una propuesta para automatizar tu flujo de ventas. ¿Te interesa ver números?";
        if (t.includes('precio') || t.includes('costo') || t.includes('vale')) return "La inversión es de $1,500/mes, pero recuperas $5,000/mes en leads que hoy se pierden. El ROI es positivo desde el primer mes.";
        if (t.includes('implement') || t.includes('tiempo')) return "En 15 días dejamos todo rodando. Configuración, entrenamiento de IA y conexión a tu WhatsApp. Sin interrumpir tu operación actual.";
        if (t.includes('agendar') || t.includes('reunion') || t.includes('cita')) return "¡Claro! Puedo agendar una demo corta para mostrarte cómo funciona en vivo. ¿Qué día te queda mejor?";
        return "Ese es exactamente el tipo de problema que ORION resuelve automatizando la comunicación. ¿Me permites mostrarte un ejemplo rápido?";
    }

    _speak(text) {
        if (!this.synth || !this.selectedVoice || !this.voiceEnabled) return;
        const cleanText = text.replace(/[*_#`]/g, '').replace(/\n+/g, '. ');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.selectedVoice;
        utterance.lang = this.language === 'es' ? 'es-CO' : 'en-US';
        utterance.rate = 0.95;
        utterance.pitch = 1.1;
        this.synth.speak(utterance);
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        this._loadVoices();
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (window.KARLA_CONFIG) {
        window.karla = new KarlaAssistant(window.KARLA_CONFIG);
        console.log('✅ Karla AI Assistant initialized');
    }
});
