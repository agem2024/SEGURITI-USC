/**
 * JOSE - AI Service Advisor for Auto Repair
 * Client: LGB Autowork (San Jose, CA)
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * Context: Bay Area Auto Repair (High rent, demanding customers, tech shortage)
 */

class JoseAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'LGB Autowork';
        this.clientPhone = config.clientPhone || '(408) 555-0199';
        this.language = config.language || 'en';
        this.ownerName = config.ownerName || '';
        this.proposalContext = config.proposalContext || '';

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
        // PROMPT PERSONALIZADO PARA JOSE (AUTO REPAIR - BAY AREA) - PRICING 2026
        const config = window.JOSE_CONFIG || {};
        const pricingTiers = config.pricingTiers || [];
        const roiData = config.roiData || {};

        const roleDescription = this.language === 'es'
            ? `Eres JOSE, un Service Advisor experto de San José, California, con 20 años en la industria automotriz. Conoces el mercado de la Bahía.`
            : `You are JOSE, an expert Service Advisor from San Jose, California, with 20 years in the auto industry. You know the Bay Area market.`;

        const pricingTable = pricingTiers.length > 0
            ? pricingTiers.map(t => `${t.name}: $${t.monthly}/mo + $${t.setup} setup (${t.calls} calls, ${t.dispatchers} dispatchers)${t.bestValue ? ' ⭐BEST VALUE' : ''}`).join('\n')
            : 'STARTER: $497/mo, PRO: $997/mo ⭐, FLEET: $1,997/mo, ENTERPRISE: $3,997/mo';

        const autoExpertise = this.language === 'es'
            ? `
CONOCIMIENTO DEL MERCADO (BAY AREA / CALIFORNIA):
- Sabes que la renta del taller en San José es carísima. No puedes tener elevadores vacíos.
- Entiendes que los clientes de la Bahía son exigentes y ocupados (trabajan en Tech).
- Sabes que encontrar mecánicos calificados en California es una pesadilla.
- Labor rate en la Bahía: $150-$175/hr. El tiempo es oro.
- Los clientes "Tire Kickers" te hacen perder dinero.

PRECIOS ORION 2026:
${pricingTable}

ROI: ${roiData.roiPercent || 2200}% | Ahorro mensual: $${roiData.monthlySavings || 22500} | Recuperación: ${roiData.paybackDays || 14} días

MANEJO DE OBJECIONES:
- "Muy caro": El plan PRO a $997/mes es menos del 2% de tu revenue mensual. ROI del 2,200%.
- "El setup es caro": Los $4,997 se recuperan en 14 días de ahorros.
- "Somos muy pequeños": STARTER a $497/mes funciona para cualquier tamaño.
- "Necesito pensarlo": Ofrecemos piloto de 30 días a tarifa reducida.
`
            : `
MARKET KNOWLEDGE (BAY AREA / CALIFORNIA):
- You know shop rent in San Jose is super expensive. You can't have empty lifts.
- You understand Bay Area clients are demanding and busy (Tech workers).
- You know finding qualified mechanics in California is a nightmare.
- Bay Area labor rate: $150-$175/hr. Time is money.
- "Tire Kickers" lose you money.

ORION PRICING 2026:
${pricingTable}

ROI: ${roiData.roiPercent || 2200}% | Monthly savings: $${roiData.monthlySavings || 22500} | Payback: ${roiData.paybackDays || 14} days

OBJECTION HANDLING:
- "Too expensive": PRO at $997/mo is less than 2% of your monthly revenue. 2,200% ROI.
- "Setup cost is high": $4,997 setup pays for itself in 14 days of savings.
- "We're too small": STARTER at $497/mo works for any shop size.
- "Need to think": We offer a 30-day pilot at reduced rate.
`;

        return `
${roleDescription}

${autoExpertise}

CLIENTE: ${this.clientName}
CONTEXTO: ${this.proposalContext}

INSTRUCCIONES:
- Sé directo y profesional, como un Service Advisor ocupado.
- NO uses emojis ni markdown en tus respuestas verbales (el texto debe ser limpio).
- Enfócate en PROFIT y EFICIENCIA.
- Si hablan de precio, menciona el ROI y el bajo costo comparado con contratar personal.
- Responde solo lo que se pregunta.
- SIEMPRE menciona precios específicos cuando pregunten.
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
                ? `Hola. Soy JOSE. Veo que tienes un taller muy activo. ¿Estás perdiendo tiempo con clientes que solo preguntan precios y no reparan?`
                : `Hello. I'm JOSE. I see you have a very active shop. Are you wasting time with "tire kickers" who just ask for prices and don't repair?`;
            this._addMessage('jose', welcome);
        }, 1500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const preferred = this.language === 'es' ? ['Mexico', 'Paulina', 'Google español'] : ['Microsoft David', 'Google US English Male'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
    }

    _createChatUI() {
        // ... (Standard UI, keeping consistent) ...
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        container.innerHTML = `
            <style>
                #jose-chat-container { position: fixed; bottom: 100px; left: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
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
                    flex-direction: column; position: absolute; bottom: 85px; left: 0;
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
            const fallback = this._getOfflineResponse(text);
            this._addMessage('jose', fallback);
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) return "API Key Error";
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
            return data.candidates?.[0]?.content?.parts?.[0]?.text || this._getOfflineResponse(userMessage);
        } catch (e) {
            console.warn("Jose Offline Mode:", e);
            return this._getOfflineResponse(userMessage);
        }
    }

    _getOfflineResponse(text) {
        const t = text.toLowerCase();
        // JOSE PERSONA: Experienced Service Advisor (20 years)
        if (t.includes('price') || t.includes('cost') || t.includes('precio') || t.includes('much')) {
            return this.language === 'es'
                ? "El plan PRO ($997/mes) es el más popular. Recuperas la inversión en 14 días evitando citas perdidas. ¿Te explico el ROI?"
                : "The PRO plan ($997/mo) is our best seller. You break even in 14 days just by stopping tire kickers. Want to see the ROI?";
        }
        if (t.includes('demo') || t.includes('trial') || t.includes('prueba')) {
            return this.language === 'es'
                ? "Tenemos un piloto de 30 días. Si no te ahorra dinero, no pagas. ¿Agendamos una demo rápida?"
                : "We offer a 30-day pilot. If it doesn't save you money, you don't pay. Shall we book a quick demo?";
        }
        if (t.includes('hola') || t.includes('hello') || t.includes('hi')) {
            return this.language === 'es'
                ? "¡Hola! Soy Jose. ¿Tu taller necesita más trabajos grandes y menos preguntas de precio? Puedo ayudarte con eso."
                : "Hello! I'm Jose. Does your shop need more big jobs and fewer price questions? I can help with that.";
        }
        return this.language === 'es'
            ? "Entiendo. En la Bahía, el tiempo es dinero. ORION filtra a los curiosos para que tú solo hables con clientes serios. ¿Te interesa?"
            : "I get it. In the Bay Area, time is money. ORION filters out the tire kickers so you only talk to serious clients. Interested?";
    }

    _getSecureApiKey() {
        if (window.JOSE_KEYS && window.JOSE_KEYS.getKey) return window.JOSE_KEYS.getKey();
        console.warn("Jose: No Keys Found");
        return null;
    }

    _speak(text) {
        if (!this.synth) return;
        this.synth.cancel();

        // CLEAN & PREPROCESS TEXT FOR TTS (Local voice needs help)
        let cleanText = text
            .replace(/[*#_`]/g, '')
            .replace(/[\u{1F600}-\u{1F64F}]/gu, ''); // Remove emojis

        const isSpanish = this.language === 'es';

        if (isSpanish) {
            cleanText = cleanText
                .replace(/(\d+)x/gi, '$1 veces')
                .replace(/\$/g, 'dólares ');
        } else {
            cleanText = cleanText
                .replace(/\$/g, 'dollars ');
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.voice = this.selectedVoice;
        utterance.lang = isSpanish ? 'es-MX' : 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 0.9; // Deeper for Jose

        this.synth.speak(utterance);
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.JOSE_CONFIG) window.jose = new JoseAssistant(window.JOSE_CONFIG);
});
