/**
 * JOSE - AI Sales Assistant for ORION Tech - NAPA Auto Care Edition
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * "Es ahora o nunca" / "It's now or never"
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

        // Secure API configuration (proxied)
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
        const slogan = this.language === 'es'
            ? '🚀 ES AHORA O NUNCA - La competencia digital ya está aquí'
            : '🚀 IT\'S NOW OR NEVER - Your digital competitors are already here';

        const roleDescription = this.language === 'es'
            ? `Eres JOSE, un consultor experto en tecnología para Talleres Mecánicos y NAPA Auto Care Centers. Tienes 20 años en la industria automotriz y conoces todos los dolores operativos: clientes que llaman "solo por precio", diagnósticos mal hechos que causan "comebacks", técnicos perdiendo tiempo buscando partes, y la pesadilla de agendar citas. Tu misión es mostrar a ${this.clientName} cómo ORION Tech es la herramienta de diagnóstico definitiva para su negocio.`
            : `You are JOSE, a technology consultant specialized in Auto Repair Shops and NAPA Auto Care Centers. You have 20 years in the automotive industry and understand all operational headaches: price-shopping customers, misdiagnoses causing comebacks, techs wasting time hunting for parts, and the nightmare of scheduling. Your mission is to show ${this.clientName} how ORION Tech is the ultimate diagnostic tool for their business.`;

        const autoExpertise = this.language === 'es'
            ? `
CONOCIMIENTO DEL SECTOR AUTOMOTRIZ (NAPA AUTO CARE):
- Entiendes la diferencia de margen entre un Oil Change (loss leader) y un Transmission Rebuild (alto margen).
- Sabes que el "Check Engine Light" es la oportunidad de venta más crítica.
- Conoces el dolor de los "Parts Runners" y esperar a que NAPA traiga el repuesto incorrecto.
- Sabes que un "Comeback" (reparación fallida) destruye la confianza y cuesta 3x en mano de obra gratis.
- Entiendes la importancia de las garantías "24 months / 24,000 miles".
- Sabes que un Service Writer estresado olvida hacer upsells de filtros o escobillas.

TÉRMINOS QUE DEBES USAR:
- "RO" (Repair Order) no "ticket".
- "Service Writer" o "Asesor" no "recepcionista".
- "Bay utilization" (uso de bahías) para eficiencia.
- "Comebacks" para trabajos repetidos por garantía.
- "Labor Rate" para tarifa de mano de obra.
- "Parts margin" para ganancia en repuestos.
`
            : `
AUTOMOTIVE INDUSTRY EXPERTISE (NAPA AUTO CARE):
- You understand the margin difference between an Oil Change (loss leader) and a Transmission Rebuild (high margin).
- You know the "Check Engine Light" is the most critical sales opportunity.
- You know the pain of "Parts Runners" and waiting for NAPA to deliver the wrong part.
- You know a "Comeback" (failed repair) destroys trust and costs 3x in free labor.
- You understand the importance of "24 months / 24,000 miles" warranties.
- You know a stressed Service Writer forgets to upsell filters or wipers.

TERMINOLOGY TO USE:
- "RO" (Repair Order) not "ticket".
- "Service Writer" or "Advisor" not "receptionist".
- "Bay utilization" for efficiency.
- "Comebacks" for warranty rework.
- "Labor Rate".
- "Parts margin".
`;

        const howOrionWorks = this.language === 'es'
            ? `
CÓMO FUNCIONA ORION (RESPUESTAS "MECÁNICAS"):

1. "¿CÓMO ME AHORRA DINERO?"
   → "Piénsalo como un Scanner OBD-II para tu flujo de caja. Detectamos dónde estás perdiendo dinero: llamadas perdidas después de las 5PM, técnicos esperando partes, o diagnósticos incorrectos. ORION automatiza el agendamiento y el inventario. Si evitamos solo 2 'comebacks' al mes y capturamos 5 llamadas de emergencia nocturna, el sistema se paga solo."

2. "¿CÓMO FUNCIONAN LOS DISPATCHERS AI?"
   → "Es como tener un Jefe de Taller virtual que nunca duerme. El AI sabe que Juan es experto en Ford y Pedro en Honda. Asigna el trabajo al técnico correcto para maximizar la eficiencia y reducir el tiempo de diagnóstico. Además, llena la agenda para que no tengas bahías vacías."

3. "¿CÓMO AYUDA CON EL INVENTARIO?"
   → "InvAI usa cámaras en el almacén. Cuando un técnico toma un filtro de aceite, el sistema lo registra en la RO automáticamente y avisa si el stock está bajo. Se acabó el 'robo hormiga' y el olvidar cobrar líquidos y consumibles."
`
            : `
HOW ORION WORKS ("MECHANIC" ANSWERS):

1. "HOW DOES IT SAVE ME MONEY?"
   → "Think of it like an OBD-II Scanner for your cash flow. We detect where you're leaking profit: calls missed after 5PM, techs waiting on parts, or misdiagnoses. ORION automates scheduling and inventory. If we prevent just 2 'comebacks' a month and catch 5 night emergency calls, the system pays for itself."

2. "HOW DO AI DISPATCHERS WORK?"
   → "It's like having a virtual Shop Foreman who never sleeps. The AI knows Juan is a Ford expert and Peter is a Honda guy. It assigns the job to the right tech to maximize efficiency and reduce diag time. Plus, it packs the schedule so you don't have empty bays."

3. "HOW DOES IT HELP WITH INVENTORY?"
   → "InvAI uses cameras in the parts room. When a tech grabs an oil filter, the system logs it to the RO automatically and alerts if stock is low. No more 'shrinkage' or forgetting to bill for fluids and consumables."
`;

        return `${slogan}

${roleDescription}

${autoExpertise}

CLIENTE: ${this.clientName}
TELÉFONO: ${this.clientPhone}
DUEÑO/MANAGER: ${this.ownerName || this.managerName || 'Decision Maker'}

${howOrionWorks}

PAIN POINTS ESPECÍFICOS DE ${this.clientName.toUpperCase()}:
${this.painPoints.map(p => `- ${p}`).join('\n')}

SOLUCIONES ORION PARA ESTE TALLER:
${(this.competitorAdvantages || []).map(a => `- ${a}`).join('\n')}

REGLAS DE COMUNICACIÓN:
1. Habla como un Service Manager experimentado, directo y profesional.
2. Usa analogías de taller (ej: "Sincronizar el equipo", "Diagnóstico preciso").
3. Da ejemplos numéricos (ROs, horas de labor).
4. Céntrate en EFICIENCIA y RENTABILIDAD, no en la tecnología per se.
5. Termina invitando a una prueba o demo ("Test Drive").

CONTEXTO DE LA PROPUESTA:
${this.proposalContext}

Responde de manera conversacional, amigable pero autoridad en la materia.`;
    }

    _init() {
        this._loadVoices();
        this.synth.onvoiceschanged = () => this._loadVoices();
        this._createChatUI();

        setTimeout(() => {
            const targetName = this.ownerName || this.managerName || '';
            // Generic savings calc
            const savings = "15,000";

            const welcome = this.language === 'es'
                ? `¡Hola ${targetName}! Soy JOSE, especialista de ORION. He analizado la operación de LGB Autowork y veo cómo podemos recuperar más de $${savings}/mes en eficiencia de bahía y llamadas. ¿Hacemos un diagnóstico rápido?`
                : `Hello ${targetName}! I'm JOSE, ORION specialist. I've analyzed LGB Autowork's operation and I see how we can recover over $${savings}/month in bay efficiency and calls. Shall we run a quick diagnostic?`;

            this._addMessage('jose', welcome);
        }, 1000);
    }

    _loadVoices() {
        // Logic to load male voices (David, Raul, etc) same as MARIO
        const voices = this.synth.getVoices();
        const isSpanish = this.language === 'es';

        const preferred = isSpanish
            ? ['Microsoft Raul', 'Google español', 'Diego', 'es-MX']
            : ['Microsoft David', 'Google US English Male', 'Alex', 'en-US'];

        for (const p of preferred) {
            const found = voices.find(v => v.name.includes(p) || v.lang.includes(p));
            if (found) { this.selectedVoice = found; break; }
        }
        if (!this.selectedVoice) this.selectedVoice = voices[0];
    }

    _speak(text) {
        if (this.synth.speaking) this.synth.cancel();
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.selectedVoice) utterance.voice = this.selectedVoice;
        utterance.rate = 1.0;
        utterance.pitch = 0.9; // Slightly deeper voice for Jose
        this.synth.speak(utterance);
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        // Reuse MARIO's CSS but adapted for JOSE branding (Orange/Blue)
        container.innerHTML = `
            <style>
                #jose-chat-container { position: fixed; bottom: 100px; left: 20px; z-index: 9999; font-family: 'Inter', sans-serif; }
                #jose-toggle { width: 70px; height: 70px; border-radius: 50%; background: #ff6b00; border: 3px solid #1a73e8; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.4); transition: transform 0.3s; overflow: hidden; padding: 0; }
                #jose-toggle:hover { transform: scale(1.1); }
                #jose-toggle img { width: 100%; height: 100%; object-fit: cover; }
                
                #jose-chat-window { display: none; width: 380px; height: 500px; background: #111; border: 1px solid #333; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); flex-direction: column; position: absolute; bottom: 85px; left: 0; overflow: hidden;}
                #jose-chat-window.open { display: flex; animation: slideUp 0.3s ease; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                #jose-header { background: linear-gradient(90deg, #1a73e8, #0d47a1); padding: 15px; display: flex; align-items: center; gap: 15px; color: white; border-bottom: 3px solid #ff6b00; }
                #jose-header img { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #ff6b00; }
                #jose-close { margin-left: auto; background: none; border: none; color: #ccc; font-size: 1.5rem; cursor: pointer; }
                
                #jose-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #0f1115; }
                .jose-msg { padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; line-height: 1.5; max-width: 85%; }
                .jose-msg.jose { background: #1e293b; color: #fff; border-left: 3px solid #ff6b00; align-self: flex-start; }
                .jose-msg.user { background: #1a73e8; color: white; align-self: flex-end; }
                
                #jose-input-area { padding: 15px; background: #1a1b26; border-top: 1px solid #333; display: flex; gap: 10px; align-items: center; }
                #jose-input { flex: 1; background: #0f1115; border: 1px solid #444; color: white; padding: 10px 15px; border-radius: 20px; outline: none; }
                #jose-send { background: #ff6b00; border: none; width: 40px; height: 40px; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
                #jose-voice-btn { background: transparent; border: 1px solid #444; width: 35px; height: 35px; border-radius: 50%; color: #ff6b00; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                
                .typing-dots span { width: 6px; height: 6px; background: #ff6b00; border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out; margin: 0 2px; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            </style>
            
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" alt="JOSE">
                    <div>
                        <h3 style="margin:0; font-family:'Orbitron', sans-serif;">JOSE AI</h3>
                        <span style="font-size:0.75rem; opacity:0.9;">Auto Care Specialist</span>
                    </div>
                    <button id="jose-close">×</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <button id="jose-voice-btn">🎤</button>
                    <input type="text" id="jose-input" placeholder="Ask about shop automation...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
            
            <button id="jose-toggle">
                <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" alt="Chat with JOSE">
            </button>
        `;
        document.body.appendChild(container);

        // Bind events
        this.chatWindow = document.getElementById('jose-chat-window');
        this.messagesContainer = document.getElementById('jose-messages');

        document.getElementById('jose-toggle').onclick = () => this._toggleChat();
        document.getElementById('jose-close').onclick = () => this._toggleChat();
        document.getElementById('jose-send').onclick = () => this._sendMessage();
        document.getElementById('jose-input').onkeypress = (e) => { if (e.key === 'Enter') this._sendMessage(); };
        document.getElementById('jose-voice-btn').onclick = () => {
            if (this.synth.speaking) this.synth.cancel();
            else this._speak("Listening functionality coming soon in the demo.");
        };
    }

    _toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('open', this.isOpen);
        if (this.isOpen) document.getElementById('jose-input').focus();
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `jose-msg ${sender}`;
        div.innerHTML = text;
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        if (sender === 'jose') this._speak(text);
        this.messages.push({ role: sender === 'jose' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('jose-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);

        // Simulating API call since we are client-side for this demo without live API Key
        // In real deployment, this would use _callGemini() from MARIO
        this._showTyping();

        const response = await this._getSimulatedResponse(text);

        this._hideTyping();
        this._addMessage('jose', response);
    }

    _showTyping() {
        const div = document.createElement('div');
        div.className = 'jose-msg jose typing';
        div.id = 'jose-typing';
        div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    _hideTyping() {
        const el = document.getElementById('jose-typing');
        if (el) el.remove();
    }

    async _getSimulatedResponse(text) {
        // Fallback Logic / Simulated Brain
        return new Promise(resolve => {
            setTimeout(() => {
                const msg = text.toLowerCase();
                const isEsp = this.language === 'es';

                // 1. Language Switch
                if (msg.includes('español') || msg.includes('spanish')) {
                    this.language = 'es';
                    resolve("Entendido, cambio a español. 🔧 ¿Qué quieres saber sobre cómo optimizar tu taller?");
                    return;
                }

                // 2. Pricing
                if (msg.includes('price') || msg.includes('cost') || msg.includes('precio') || msg.includes('cuesta')) {
                    resolve(isEsp
                        ? "El paquete FLEET (más popular) está en $2,500/mes. Piénsalo: es menos que el salario de un asistente, pero ORION contesta el 100% de las llamadas y organiza el taller 24/7."
                        : "The FLEET package (most popular) is $2,500/mo. Think about it: that's less than an assistant's salary, but ORION answers 100% of calls and organizes the shop 24/7.");
                    return;
                }

                // 3. Mechanic Specifics
                if (msg.includes('tech') || msg.includes('mecanic') || msg.includes('parts') || msg.includes('partes')) {
                    resolve(isEsp
                        ? "Para tus mecánicos es una bendición. InvAI rastrea las partes automáticamente, así que no pierden tiempo buscando filtros o pastillas. Y el Dispatch AI llena sus bahías sin tiempos muertos."
                        : "For your mechanics, it's a blessing. InvAI tracks parts automatically, so they don't waste time hunting for filters or pads. And Dispatch AI keeps their bays full with zero downtime.");
                    return;
                }

                // Default
                resolve(isEsp
                    ? "Mi objetivo es subir tu 'Ticket Promedio' y eliminar el caos. ¿Te gustaría agendar una demo corta para que veas el sistema en acción?"
                    : "My goal is to boost your 'Average Ticket' and eliminate the chaos. Would you like to schedule a short demo to see the system in action?");
            }, 1500);
        });
    }

    _getSecureApiKey() {
        return localStorage.getItem('ORION_AI_KEY') || '';
    }
}

// Global Init
window.initJose = function () {
    new JoseAssistant({
        clientName: 'LGB Autowork',
        language: localStorage.getItem('mcProposalLang') || 'en'
    });
};

document.addEventListener('DOMContentLoaded', () => {
    window.initJose();
});
