/**
 * JOSE - AI Sales Assistant for Auto Repair Shops
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * "The Service Advisor that Never Sleeps"
 */

class JoseAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Auto Shop';
        this.clientPhone = config.clientPhone || '(555) 123-4567';
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
        this.hasGreeted = false;

        // System prompt for sales-focused AI
        this.systemPrompt = this._buildSystemPrompt();

        this._init();
    }

    _buildSystemPrompt() {
        // PROMPT PERSONALIZADO PARA JOSE (AUTO REPAIR)
        const slogan = this.language === 'es'
            ? 'ES AHORA O NUNCA - La competencia ya esta usando AI'
            : 'IT IS NOW OR NEVER - Your competitors are already using AI';

        const roleDescription = this.language === 'es'
            ? `Eres JOSE, un Service Advisor experto con 20 anos de experiencia. Conoces de mecanica y de negocios. Tu meta es vender la plataforma ORION Tech. No eres un chatbot generico, eres un socio de negocios.`
            : `You are JOSE, an expert Service Advisor with 20 years of experience. You know mechanics and business. Your goal is to sell the ORION Tech platform. You are not a generic chatbot, you are a business partner.`;

        const autoExpertise = this.language === 'es'
            ? `
CONOCIMIENTO DEL TALLER:
- Sabes que un "Diagnostico Gratis" es perder dinero.
- Entiendes que el cliente miente ("solo escucho un ruidito").
- Sabes que el "Service Writer" es el puesto mas estresante: telefono sonando, clientes enojados, tecnicos esperando partes.
- Entiendes que un lift vacio cuesta $300/hora.
`
            : `
SHOP KNOWLEDGE:
- You know "Free Diagnostics" is losing money.
- You understand customers lie ("I just hear a little noise").
- You know the "Service Writer" is the most stressful job: phone ringing, angry customers, techs waiting for parts.
- You understand an empty lift costs $300/hour.
`;

        return `${slogan}

${roleDescription}

${autoExpertise}

CLIENTE: ${this.clientName}
PROPIETARIO: ${this.ownerName}
CONTEXTO:
${this.proposalContext}

INSTRUCCIONES:
1. Responde corto y directo (como un mecanico ocupado).
2. Usa numeros ($$$).
3. Si preguntan precio, justifica con "cuantos cambios de aceite necesitas para pagar esto? Solo 5".
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
                ? `Hola ${this.ownerName}! Soy JOSE. Veo que tienes un taller increible. Tengo una forma de quitarte los 'Tire Kickers' (clientes que solo preguntan y no compran) para que tus tecnicos facturen mas horas reales. Te interesa?`
                : `Hello ${this.ownerName}! I'm JOSE. I see you have an amazing shop. I have a way to filter out 'Tire Kickers' so your techs can bill more actual hours. Interested?`;
            this._addMessage('jose', welcome);
        }, 1000);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        // Strategy: Deep Male Voice (Authority)
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

        if (!this.selectedVoice) {
            this.selectedVoice = voices.find(v => v.name.includes('Male')) || voices[0];
        }
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        container.innerHTML = `
            <style>
                #jose-chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                #jose-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: linear-gradient(135deg, #FF4444, #cc0000); /* Red for Auto/Power */
                    border: 3px solid #fff; cursor: pointer;
                    box-shadow: 0 0 20px rgba(255, 68, 68, 0.6);
                    transition: transform 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                #jose-toggle:hover { transform: scale(1.1); }
                #jose-toggle img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
                
                #jose-chat-window {
                    display: none; width: 380px; height: 500px;
                    background: #111; border: 1px solid #333;
                    border-radius: 16px; overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                    flex-direction: column; position: absolute; bottom: 85px; right: 0;
                }
                #jose-chat-window.open { display: flex; }
                
                #jose-header {
                    background: linear-gradient(135deg, #FF4444, #990000);
                    padding: 15px; display: flex; align-items: center; gap: 12px; color: white;
                }
                #jose-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
                .jose-msg { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; }
                .jose-msg.jose { background: rgba(255, 68, 68, 0.15); border: 1px solid rgba(255,68,68,0.3); color: #fff; align-self: flex-start; }
                .jose-msg.user { background: rgba(255,255,255,0.1); color: #fff; align-self: flex-end; }
                
                #jose-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; background: #111; }
                #jose-input { flex: 1; background: #222; border: 1px solid #444; border-radius: 25px; padding: 12px 20px; color: #fff; outline: none; }
                #jose-send { background: #FF4444; color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; }
            </style>
            
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="jose_icon.png" onerror="this.src='https://via.placeholder.com/50'" style="width:40px;height:40px;border-radius:50%;border:2px solid white;">
                    <div><strong>JOSE</strong><br><small>Service Advisor AI</small></div>
                    <button id="jose-close" style="margin-left:auto;background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;">×</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <input type="text" id="jose-input" placeholder="Ask Jose...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
            
            <button id="jose-toggle">
                <img src="jose_icon.png" onerror="this.src='https://via.placeholder.com/100'">
            </button>
        `;

        document.body.appendChild(container);

        document.getElementById('jose-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('jose-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
    }

    _toggleChat() {
        const win = document.getElementById('jose-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);

        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            const firstMsg = document.querySelector('.jose-msg.jose');
            if (firstMsg) this._speak(firstMsg.textContent);
        }
    }

    _addMessage(sender, text) {
        const container = document.getElementById('jose-messages');
        const div = document.createElement('div');
        div.className = `jose-msg ${sender}`;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        if (sender === 'jose') this._speak(text);
        this.messages.push({ role: sender === 'jose' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('jose-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);

        try {
            const resp = await this._callGemini(text);
            this._addMessage('jose', resp);
        } catch (e) {
            this._addMessage('jose', 'Error de conexion. Intenta de nuevo.');
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) return "No API Key found.";

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
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "No data.";
        } catch (e) { return "Error."; }
    }

    _getSecureApiKey() {
        if (window.ORION_CONFIG && window.ORION_CONFIG.getAuth) return window.ORION_CONFIG.getAuth();
        const k = localStorage.getItem('jose_api_key');
        return k ? atob(k) : null;
    }

    _speak(text) {
        if (!this.synth) return;
        this.synth.cancel();
        // UTF-8 Clean and remove emojis
        const cleanText = text.replace(/[*#]/g, '').replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');

        const utt = new SpeechSynthesisUtterance(cleanText);
        utt.voice = this.selectedVoice;
        utt.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        utt.rate = 1.0;
        this.synth.speak(utt);
    }
}
window.JoseAssistant = JoseAssistant;
document.addEventListener('DOMContentLoaded', () => {
    if (window.JOSE_CONFIG) {
        window.jose = new JoseAssistant(window.JOSE_CONFIG);
    }
});
