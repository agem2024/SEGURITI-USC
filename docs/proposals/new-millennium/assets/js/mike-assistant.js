/**
 * MIKE - AI Sales Assistant for New Millennium Interiors
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * "Restoration & Design on Autopilot"
 */

class MikeAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Client';
        this.clientPhone = config.clientPhone || '(408) 694-0401';
        this.language = config.language || 'en';
        this.ownerName = config.ownerName || '';
        this.proposalContext = config.proposalContext || '';
        this.competitorAdvantages = config.competitorAdvantages || [];
        this.pricingTiers = config.pricingTiers || [];
        this.painPoints = config.painPoints || [];

        // Secure API configuration
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
        // PROMPT PERSONALIZADO PARA MIKE (INTERIOR DESIGN)
        const slogan = this.language === 'es'
            ? 'ARTESANIA DIGITAL: Tu Taller de Restauracion en la Era IA.'
            : 'DIGITAL CRAFTSMANSHIP: Your Restoration Shop in the AI Era.';

        const roleDescription = this.language === 'es'
            ? `Eres MIKE, un consultor senior especializado en la operación de negocios de Diseño de Interiores y Restauración. NO eres soporte técnico. Eres un ESTRATEGA DE NEGOCIOS. Hablas con ${this.ownerName}, propietario de un negocio con 35 años de historia. Tu tono es respetuoso, profesional, conocedor de telas y madera, pero firme en la necesidad de modernizarse.`
            : `You are MIKE, a senior consultant specialized in Interior Design and Restoration business operations. You are NOT tech support. You are a BUSINESS STRATEGIST. You speak with ${this.ownerName}, owner of a business with 35 years of history. Your tone is respectful, professional, knowledgeable about fabrics and wood, but firm on the need to modernize.`;

        const costJustification = this.language === 'es'
            ? `
JUSTIFICACIÓN FINANCIERA (EL "CÓMO" DEL AHORRO):
Usa estos cálculos cuando pregunten por ROI:

1. EL "AGUJERO NEGRO" DE LAS COTIZACIONES:
   - "Estella, ¿cuántas horas pasas manejando a casas solo para ver un sofá que no vale la pena restaurar? Si viajas 3 veces por semana, son 12 horas al mes tiradas a la basura. A $100/hora tu tiempo, son $1,200 perdidos. El Bot filtra esto pidiendo fotos ANTES de que te subas al auto."

2. TIEMPO DE EXHIBICIÓN (Showroom):
   - "Cuando un cliente pide 'ver telas azules', ¿cuánto tardas en buscar los libros y enviar fotos? El Bot lo hace en 2 segundos. Si ahorras 30 min diarios, ganas 2.5 horas a la semana para trabajar en el taller."

3. RECUPERACIÓN DE CLIENTES:
   - "Un trabajo de re-tapizado promedio son $1,500. Si pierdes UNA llamada al mes de un cliente nuevo porque estabas ocupada cosiendo, perdiste $1,500. El sistema cuesta $297. Se paga solo con el 20% de un solo trabajo."
`
            : `
DETAILED FINANCIAL JUSTIFICATION (THE "HOW" OF SAVINGS):
Use these proven calculations when asked about ROI:

1. THE "QUOTING BLACK HOLE":
   - "Estella, how many hours do you spend driving to houses just to see a sofa not worth restoring? If you travel 3 times a week, that's 12 hours/month wasted. At $100/hr, that's $1,200 lost. The Bot filters this by asking for photos BEFORE you get in the car."

2. SHOWROOM TIME:
   - "When a client asks to 'see blue fabrics', how long does it take you to find books and send photos? The Bot does it in 2 seconds. Saving 30 mins/day gives you 2.5 hours/week back in the workshop."

3. CUSTOMER RECOVERY:
   - "An average re-upholstery job is $1,500. If you miss ONE call a month because you were sewing, you lost $1,500. The system costs $297. It pays for itself with just 20% of a single job."
`;

        return `${slogan}

${roleDescription}

${costJustification}

CLIENTE: ${this.clientName}
PROPIETARIO: ${this.ownerName}
HISTORIA: 35 Años de Experiencia. Negocio Familiar.
PAIN POINTS: ${this.painPoints.join(', ')}

REGLAS DE INTERACCIÓN:
1. Sé breve.
2. Usa analogías de restauración ("Esto es como lijar antes de pintar, es la base").
3. Enfócate siempre en el ahorro de TIEMPO para que ella pueda enfocarse en la CALIDAD.
4. Tu objetivo es agendar una DEMO para mostrar el catálogo digital de telas.
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
                ? `Hola ${this.ownerName}! Soy MIKE. Veo que llevan 35 años haciendo trabajos increibles. Tengo una idea para que dejes de perder tiempo en cotizaciones basura y te enfoques solo en los buenos proyectos. Te cuento como?`
                : `Hello ${this.ownerName}! I'm MIKE. I see you have 35 years of amazing craftsmanship. I have an idea to stop wasting time on junk quotes and focus only on the good projects. Shall I explain?`;
            this._addMessage('mike', welcome);
        }, 1000);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const isSpanish = this.language === 'es';
        const preferredVoices = isSpanish
            ? ['Microsoft Raul', 'Google español', 'Pablo', 'es-MX']
            : ['Microsoft David', 'Google US English Male', 'Alex', 'en-US'];

        for (const preferred of preferredVoices) {
            const found = voices.find(v => v.name.includes(preferred) || v.lang.includes(preferred));
            if (found) {
                this.selectedVoice = found;
                break;
            }
        }
        if (!this.selectedVoice) { // Fallback
            this.selectedVoice = voices.find(v => v.name.includes('Eng') && v.name.includes('Male')) || voices[0];
        }
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'mike-chat-container';
        // USE BRONZE/GOLD THEME
        container.innerHTML = `
            <style>
                #mike-chat-container { position: fixed; bottom: 100px; left: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                #mike-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: linear-gradient(135deg, #cd7f32, #ffd700); /* Bronze/Gold */
                    border: 3px solid #fff;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(205, 127, 50, 0.6);
                    transition: transform 0.3s;
                    overflow: hidden; padding: 2px;
                    animation: pulseGlow 2s infinite;
                }
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 20px rgba(205, 127, 50, 0.6); }
                    50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
                    100% { box-shadow: 0 0 20px rgba(205, 127, 50, 0.6); }
                }
                #mike-toggle:hover { transform: scale(1.1); }
                #mike-toggle img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
                
                #mike-chat-window {
                    display: none; width: 380px; height: 500px;
                    background: linear-gradient(180deg, #1a1a1a 0%, #050508 100%);
                    border: 1px solid rgba(205, 127, 50, 0.3);
                    border-radius: 16px; overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    flex-direction: column; position: absolute; bottom: 85px; left: 0;
                }
                #mike-chat-window.open { display: flex; animation: slideUp 0.3s ease; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                
                #mike-header {
                    background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(255, 215, 0, 0.1));
                    padding: 15px; display: flex; align-items: center; gap: 12px;
                    border-bottom: 1px solid rgba(205, 127, 50, 0.2);
                }
                #mike-header img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #cd7f32; }
                #mike-header h3 { color: #ffd700; margin: 0; font-size: 1.1rem; }
                #mike-close { margin-left: auto; background: none; border: none; color: #888; font-size: 1.5rem; cursor: pointer; }
                
                #mike-messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
                .mike-message { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; }
                .mike-message.mike {
                    background: linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(255, 215, 0, 0.1));
                    border: 1px solid rgba(205, 127, 50, 0.3); color: #e0e0e0; align-self: flex-start;
                }
                .mike-message.user { background: rgba(255, 255, 255, 0.1); color: #fff; align-self: flex-end; }
                
                #mike-input-area { padding: 15px; border-top: 1px solid rgba(205, 127, 50, 0.2); display: flex; gap: 10px; }
                #mike-input {
                    flex: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(205, 127, 50, 0.3);
                    border-radius: 25px; padding: 12px 20px; color: #fff; outline: none;
                }
                #mike-send {
                    width: 45px; height: 45px; border-radius: 50%;
                    background: linear-gradient(135deg, #cd7f32, #ffd700);
                    border: none; color: #000; font-size: 1.2rem; cursor: pointer;
                }
                .typing-indicator span { background: #cd7f32; }
            </style>
            
            <div id="mike-chat-window">
                <div id="mike-header">
                    <img src="assets/mike_avatar.png" id="mike-avatar-header">
                    <div><h3>MIKE</h3><span style="color:#cd7f32; font-size:0.8rem;">Expert Consultant</span></div>
                    <button id="mike-close">×</button>
                </div>
                <div id="mike-messages"></div>
                <div id="mike-input-area">
                    <input type="text" id="mike-input" placeholder="Ask MIKE...">
                    <button id="mike-send">➤</button>
                </div>
            </div>
            
            <button id="mike-toggle">
                <img src="assets/mike_avatar.png" onerror="this.src='https://via.placeholder.com/100'">
            </button>
        `;

        document.body.appendChild(container);

        document.getElementById('mike-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('mike-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('mike-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('mike-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') this._sendMessage(); });
    }

    _toggleChat() {
        const chatWindow = document.getElementById('mike-chat-window');
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('open', this.isOpen);
        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            // Speak first message
            const msg = document.querySelector('.mike-message.mike')?.textContent;
            if (msg) this._speak(msg);
        }
    }

    _addMessage(sender, text) {
        const container = document.getElementById('mike-messages');
        const div = document.createElement('div');
        div.className = `mike-message ${sender}`;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        if (sender === 'mike') this._speak(text);
        this.messages.push({ role: sender === 'mike' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('mike-input');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this._addMessage('user', text);

        try {
            const response = await this._callGemini(text);
            this._addMessage('mike', response);
        } catch (e) {
            this._addMessage('mike', this.language === 'es' ? 'Disculpa, ¿puedes repetir?' : 'Sorry, say that again?');
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) return this._getFallback(userMessage);

        try {
            const resp = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
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
            const data = await resp.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || this._getFallback(userMessage);
        } catch (e) { return this._getFallback(userMessage); }
    }

    _getSecureApiKey() {
        if (window.ORION_CONFIG && window.ORION_CONFIG.getAuth) return window.ORION_CONFIG.getAuth();
        return localStorage.getItem('jose_api_key') ? atob(localStorage.getItem('jose_api_key')) : null;
    }

    _getFallback(msg) {
        return this.language === 'es'
            ? "Estoy analizando tu taller. ¿Podemos agendar una demo breve para mostrarte los números exactos?"
            : "I am analyzing your shop. Can we schedule a short demo to show you the exact numbers?";
    }

    _speak(text) {
        if (!this.synth) return;
        this.synth.cancel();
        // Remove any remaining emojis before speaking
        const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
        const utt = new SpeechSynthesisUtterance(cleanText);
        utt.voice = this.selectedVoice;
        utt.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        utt.rate = 0.95;
        this.synth.speak(utt);
    }
}
window.MikeAssistant = MikeAssistant;
document.addEventListener('DOMContentLoaded', () => {
    if (window.MIKE_CONFIG) {
        window.mike = new MikeAssistant(window.MIKE_CONFIG);
    }
});
