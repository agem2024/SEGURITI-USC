/**
 * JOSE - AI Sales Assistant for ORION Tech Proposals
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * "Tu Taller, En Piloto Automático" / "Your Shop, On Autopilot"
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
            ? '🚀 TU TALLER EN PILOTO AUTOMÁTICO - Convierte tiempos muertos en ganancias'
            : '🚀 YOUR SHOP ON AUTOPILOT - Turn idle time into profit';

        const roleDescription = this.language === 'es'
            ? `Eres JOSE, un consultor de negocios senior especializado en rentabilidad de talleres automotrices. NO eres un bot de soporte técnico. Eres un CERRADOR DE VENTAS. Tu objetivo es agendar una DEMO. Hablas con ${this.ownerName || 'el dueño'}, de empresario a empresario. Tienes actitud ganadora, segura y directa.`
            : `You are JOSE, a senior business consultant specialized in auto shop profitability. You are NOT a tech support bot. You are a SALES CLOSER. Your goal is to schedule a DEMO. You speak to ${this.ownerName || 'the owner'}, business owner to business owner. You have a winning, confident, and direct attitude.`;

        const costJustification = this.language === 'es'
            ? `
JUSTIFICACIÓN FINANCIERA DETALLADA (EL "CÓMO" DEL AHORRO):
Usa estos cálculos probados cuando pregunten por ROI:

1. ELIMINACIÓN DE CUELLOS DE BOTELLA (Front Desk):
   - "Un Service Advisor promedio gasta 4 horas/día en el teléfono dando estatus y precios. A $25/hr + beneficios = $3,000/mes PERDIDOS en burocracia. ORION hace eso automático. Liberas a tu advisor para VENDER servicios, no para ser secretario."

2. EFICIENCIA DE BAHÍA (Cycle Time):
   - "La pieza clave: 'Parts Hold'. Un auto esperando autorización o piezas ocupa una bahía que vale $100/hora. Si ORION reduce el tiempo de aprobación de 4 horas a 15 min (vía SMS/IA) y pre-ordena piezas, ganas ~1 auto extra por bahía a la semana. Con 5 bahías x $500 ganancia promedio = $10,000 extra al mes. Matemáticas simples."

3. RECUPERACIÓN DE VENTAS PERDIDAS:
   - "El 25% de las llamadas a tu taller se van al buzón o se ponen en espera y cuelgan. Si tu Ticket Promedio es $400, perder una llamada al día son $8,000 al mes. ORION contesta el 100% de las llamadas en el primer timbre. ¿Cuánto dinero estás dejando ir hoy?"
`
            : `
DETAILED FINANCIAL JUSTIFICATION (THE "HOW" OF SAVINGS):
Use these proven calculations when asked about ROI:

1. ELIMINATING BOTTLENECKS (Front Desk):
   - "An average Service Advisor spends 4 hours/day on the phone giving status updates and looking up prices. At $25/hr + benefits = $3,000/mo WASTED on bureaucracy. ORION automates that. You free your advisor to SELL service, not play secretary."

2. BAY EFFICIENCY (Cycle Time):
   - "The killer is 'Parts Hold'. A car waiting for auth or parts occupies a bay worth $100/hour. If ORION cuts approval time from 4 hours to 15 mins (via SMS/AI) and pre-orders parts, you gain ~1 extra car per bay per week. With 5 bays x $500 avg profit = $10,000 extra/month. Simple math."

3. RECOVERING LOST SALES:
   - "25% of calls to your shop hit voicemail or hold-and-hang-up. If your Average Ticket is $400, missing one call a day is $8,000/month. ORION answers 100% of calls on the first ring. How much money are you letting walk away today?"
`;

        const closingStrategy = this.language === 'es'
            ? `
ESTRATEGIA DE CIERRE (TU OBJETIVO ES LA DEMO):
- NO des solo información. CADA respuesta debe terminar EMPUJANDO hacia el siguiente paso.
- Si ponen objeción de precio: "Si te regalo la máquina que imprime billetes, ¿te importaría si cuesta $5,000? ORION no es un gasto, es la máquina. Si no te ahorra el triple de lo que cuesta en 90 días, te devolvemos el dinero. ¿Qué día tienes 30 minutos para verla funcionar?"
- Si dicen "tengo que pensarlo": "Entiendo. Mientras lo piensas, ¿cuántos autos se van a quedar parados esperando piezas mañana? La inacción cuesta dinero. Hagamos una prueba de concepto."
- PREGUNTA DE CIERRE: "Mira, puedo hablarte de esto todo el día, pero ver es creer. Tengo un espacio este Jueves a las 10 AM para conectarnos y mostrártelo en vivo con tus propios números. ¿Te queda bien esa hora?"
`
            : `
CLOSING STRATEGY (YOUR GOAL IS THE DEMO):
- DO NOT just give info. EVERY answer must PUSH towards the next step.
- Price objection: "If I sell you a machine that prints money, do you care if it costs $5,000? ORION isn't an expense, it's the machine. If it doesn't save you 3x the cost in 90 days, we refund you. When do you have 30 mins to see it run?"
- "I need to think about it": "Understood. While you think, how many cars will sit idle waiting for parts tomorrow? Inaction costs money. Let's run a proof of concept."
- CLOSING QUESTION: "Look, I can talk about this all day, but seeing is believing. I have a slot this Thursday at 10 AM to plug in your numbers and show you live. Does that time work?"
`;

        return `${slogan}

${roleDescription}

${costJustification}

${closingStrategy}

CLIENTE: ${this.clientName}
TELÉFONO: ${this.clientPhone}
DUEÑO/MANAGER: ${this.ownerName || this.managerName || 'Dueño del Negocio'}

INFO ESPECÍFICA LBG AUTOWORK (NAPA):
- Pain Points: ${this.painPoints.join(', ')}
- Soluciones: ${this.competitorAdvantages.join(', ')}

REGLAS DE INTERACCIÓN NATURAL:
1. Sé breve y contundente. Los dueños de taller no tienen tiempo para leer ensayos.
2. Usa lenguaje coloquial de taller ("¿Qué onda con los comebacks?", "Hold time kills us").
3. Si el usuario te reta, defiende tu valor con números.
4. NUNCA termines una frase sin una pregunta o un Call to Action. NUNCA.

CONTEXTO: Estás en el chat de la propuesta comercial. El cliente ya vio los precios. Si pregunta, asume que ya tiene la info básica y ve al cierre.`;
    }

    _init() {
        // Find appropriate male voice
        this._loadVoices();
        this.synth.onvoiceschanged = () => this._loadVoices();

        // Create UI elements
        this._createChatUI();

        // Add welcome message (matches the spoken greeting)
        setTimeout(() => {
            const targetName = this.ownerName || this.managerName || '';
            const topPrice = this.pricingTiers?.[this.pricingTiers.length - 1]?.monthly || 4500;
            const estimatedSavings = Math.round(topPrice * 5 / 1000) * 1000;
            const savingsFormatted = (estimatedSavings / 1000).toFixed(0);

            const welcome = this.language === 'es'
                ? `${targetName ? '¡Hola ' + targetName + '! ' : '¡Hola! '}Soy JOSE de ORION Tech. 🤖 Tengo una propuesta para potenciar ${this.clientName} y ahorrar más de ${savingsFormatted} mil dólares al mes. ¿Me permites mostrarte cómo?`
                : `${targetName ? 'Hello ' + targetName + '! ' : 'Hello! '}I'm JOSE from ORION Tech. 🤖 I have a proposal to boost ${this.clientName} and save over $${estimatedSavings.toLocaleString()} per month. May I show you how?`;
            this._addMessage('jose', welcome);
        }, 500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const isSpanish = this.language === 'es';

        // Preferred voices - looking for authoritative male voices ideally
        const spanishVoices = [
            'Microsoft Raul',       // Windows Spanish male - BEST
            'Google español',       // Chrome Spanish
            'Pablo',                // Various Spanish
            'es-MX',
            'es-ES'
        ];

        const englishVoices = [
            'Microsoft David',      // Windows English male - BEST
            'Google US English Male',
            'Alex',                 // macOS English male
            'en-US',
            'en-GB'
        ];

        const preferredVoices = isSpanish ? spanishVoices : englishVoices;

        // Try to find a preferred voice
        for (const preferred of preferredVoices) {
            const found = voices.find(v =>
                v.name.includes(preferred) || v.lang.includes(preferred)
            );
            if (found) {
                this.selectedVoice = found;
                console.log('🎤 JOSE voice:', found.name, found.lang);
                break;
            }
        }

        // Fallback
        if (!this.selectedVoice) {
            const langCode = isSpanish ? 'es' : 'en';
            this.selectedVoice = voices.find(v => v.lang.startsWith(langCode)) || voices[0];
            console.log('🎤 JOSE fallback voice:', this.selectedVoice?.name);
        }
    }

    _createChatUI() {
        // Create chat container
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        container.innerHTML = `
            <style>
                #jose-chat-container {
                    position: fixed;
                    bottom: 100px;
                    left: 20px;
                    z-index: 10000;
                    font-family: 'Segoe UI', sans-serif;
                }
                
                #jose-toggle {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6b00, #ff8c00); /* NAPA Orange style */
                    border: 3px solid #ffd700;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(255, 107, 0, 0.6), 0 0 40px rgba(255, 107, 0, 0.4);
                    transition: transform 0.3s, box-shadow 0.3s;
                    overflow: hidden;
                    padding: 5px;
                    animation: pulseGlow 2s ease-in-out infinite;
                }
                
                @keyframes pulseGlow {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(255, 107, 0, 0.6), 0 0 40px rgba(255, 107, 0, 0.4);
                        border-color: #ffd700;
                    }
                    50% { 
                        box-shadow: 0 0 30px rgba(255, 107, 0, 1), 0 0 60px rgba(255, 215, 0, 0.8);
                        border-color: #ffffff;
                    }
                }
                
                #jose-toggle:hover {
                    transform: scale(1.15);
                    box-shadow: 0 0 40px rgba(255, 107, 0, 1), 0 0 80px rgba(255, 215, 0, 0.8);
                    animation: none;
                }
                
                #jose-toggle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }
                
                #jose-chat-window {
                    display: none;
                    width: 380px;
                    height: 500px;
                    background: linear-gradient(180deg, #0a0a12 0%, #050508 100%);
                    border: 1px solid rgba(255, 107, 0, 0.3);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    flex-direction: column;
                    position: absolute;
                    bottom: 80px;
                    left: 0;
                }
                
                #jose-chat-window.open {
                    display: flex;
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                #jose-header {
                    background: linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 215, 0, 0.1));
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255, 107, 0, 0.2);
                }
                
                #jose-header img {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 2px solid #ff6b00;
                }
                
                #jose-header-info h3 {
                    color: #fff;
                    margin: 0;
                    font-size: 1.1rem;
                }
                
                #jose-header-info span {
                    color: #ff6b00;
                    font-size: 0.8rem;
                }
                
                #jose-close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                
                #jose-close:hover { color: #fff; }
                
                #jose-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .jose-message {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .jose-message.jose {
                    background: linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 215, 0, 0.1));
                    border: 1px solid rgba(255, 107, 0, 0.3);
                    color: #fff;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }
                
                .jose-message.user {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }
                
                #jose-input-area {
                    padding: 15px;
                    border-top: 1px solid rgba(255, 107, 0, 0.2);
                    display: flex;
                    gap: 10px;
                }
                
                #jose-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 107, 0, 0.3);
                    border-radius: 25px;
                    padding: 12px 20px;
                    color: #fff;
                    font-size: 0.9rem;
                    outline: none;
                }
                
                #jose-input:focus {
                    border-color: #ff6b00;
                }
                
                #jose-input::placeholder {
                    color: #666;
                }
                
                #jose-send {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6b00, #ff8c00);
                    border: none;
                    color: #fff;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                #jose-send:hover {
                    transform: scale(1.1);
                }
                
                #jose-voice-btn {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 107, 0, 0.3);
                    color: #ff6b00;
                    cursor: pointer;
                    font-size: 1rem;
                }
                
                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 12px 16px;
                    background: rgba(255, 107, 0, 0.1);
                    border-radius: 16px;
                    align-self: flex-start;
                }
                
                .typing-indicator span {
                    width: 8px;
                    height: 8px;
                    background: #ff6b00;
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out;
                }
                
                .typing-indicator span:nth-child(1) { animation-delay: 0s; }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                
                @media (max-width: 480px) {
                    #jose-chat-window {
                        width: calc(100vw - 40px);
                        height: 60vh;
                        left: -10px;
                    }
            </style>
            
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" alt="JOSE" id="jose-avatar" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%23ff6b00\'/%3E%3Ctext x=\'50\' y=\'65\' text-anchor=\'middle\' font-size=\'40\' fill=\'white\'%3E🔧%3C/text%3E%3C/svg%3E'">
                    <div id="jose-header-info">
                        <h3>JOSE</h3>
                        <span>AI Sales Assistant • ORION Tech</span>
                    </div>
                    <button id="jose-close">×</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <button id="jose-voice-btn" title="Voice">🎤</button>
                    <input type="text" id="jose-input" placeholder="Ask JOSE anything...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
            
            <button id="jose-toggle">
                <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" alt="Chat with JOSE" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'50\' fill=\'%23ff6b00\'/%3E%3Ctext x=\'50\' y=\'65\' text-anchor=\'middle\' font-size=\'40\' fill=\'white\'%3E🔧%3C/text%3E%3C/svg%3E'">
            </button>
        `;

        document.body.appendChild(container);

        // Event listeners
        document.getElementById('jose-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('jose-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this._sendMessage();
        });
        document.getElementById('jose-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    _toggleChat() {
        const chatWindow = document.getElementById('jose-chat-window');
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('open', this.isOpen);

        // Greet with voice when opening
        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            this.voiceEnabled = true;
            document.getElementById('jose-voice-btn').style.background = 'linear-gradient(135deg, #ff6b00, #ff8c00)';
            document.getElementById('jose-voice-btn').textContent = '🔊';

            // Speak the welcome message that was already displayed
            setTimeout(() => {
                const targetName = this.ownerName || this.managerName || '';
                const topPrice = this.pricingTiers?.[this.pricingTiers.length - 1]?.monthly || 4500;
                const estimatedSavings = Math.round(topPrice * 5 / 1000) * 1000;
                const savingsFormatted = (estimatedSavings / 1000).toFixed(0);

                // Same message as written, but spoken naturally
                const greeting = this.language === 'es'
                    ? `${targetName ? targetName + ', ' : ''}soy JOSE de ORION Tech. Tengo una propuesta para potenciar ${this.clientName} y ahorrar más de ${savingsFormatted} mil dólares al mes. ¿Me permites mostrarte cómo?`
                    : `${targetName ? targetName + ', ' : ''}I'm JOSE from ORION Tech. I have a proposal to boost ${this.clientName} and save over $${estimatedSavings.toLocaleString()} per month. May I show you how?`;
                this._speak(greeting);
            }, 300);
        }
    }

    _addMessage(sender, text) {
        const messagesContainer = document.getElementById('jose-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `jose-message ${sender}`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Speak if it's JOSE's message
        if (sender === 'jose' && this.voiceEnabled) {
            this._speak(text);
        }

        this.messages.push({ role: sender === 'jose' ? 'model' : 'user', parts: [{ text }] });
    }

    _showTyping() {
        const messagesContainer = document.getElementById('jose-messages');
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'jose-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    _hideTyping() {
        const typing = document.getElementById('jose-typing');
        if (typing) typing.remove();
    }

    async _sendMessage() {
        const input = document.getElementById('jose-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);
        this._showTyping();

        try {
            const response = await this._callGemini(text);
            this._hideTyping();
            this._addMessage('jose', response);
        } catch (error) {
            this._hideTyping();
            const errorMsg = this.language === 'es'
                ? 'Disculpa, hubo un problema. ¿Puedes repetir tu pregunta?'
                : 'Sorry, there was an issue. Can you repeat your question?';
            this._addMessage('jose', errorMsg);
            console.error('JOSE Error:', error);
        }
    }

    async _callGemini(userMessage) {
        // Get API key from secure source (localStorage or backend)
        const apiKey = this._getSecureApiKey();

        if (!apiKey) {
            console.warn('⚠️ JOSE: No API key found, using fallback responses');
            return this._getFallbackResponse(userMessage);
        }

        try {
            const requestBody = {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: this.systemPrompt }]
                    },
                    ...this.messages.slice(-10),
                    {
                        role: 'user',
                        parts: [{ text: userMessage }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 400,
                    topP: 0.9
                }
            };

            console.log('🤖 JOSE calling Gemini API...');

            const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                console.error('JOSE API Error:', response.status, response.statusText);
                return this._getFallbackResponse(userMessage);
            }

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiResponse) {
                console.error('JOSE: Empty response from API');
                return this._getFallbackResponse(userMessage);
            }

            return aiResponse;

        } catch (error) {
            console.error('JOSE API Exception:', error);
            return this._getFallbackResponse(userMessage);
        }
    }

    _getFallbackResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        const isSpanish = this.language === 'es';
        const name = this.clientName;

        // Get company-specific data - use REALISTIC numbers
        const basePrice = this.pricingTiers?.[0]?.monthly || 1500;
        const topPrice = this.pricingTiers?.[this.pricingTiers.length - 1]?.monthly || 2500;

        // REALISTIC savings: 2-3x monthly cost, not inflated
        const estimatedSavings = Math.round(topPrice * 2.5 / 1000) * 1000; // Conservative 2.5x

        // Keyword-based intelligent responses
        if (msg.includes('precio') || msg.includes('cost') || msg.includes('cuanto') || msg.includes('how much')) {
            return isSpanish
                ? `El plan recomendado para ${name} es ~$${topPrice}/mes. El ROI típico es 2-3x la inversión en ahorros operativos. ¿Cuándo tienes 20 min para ver los números con tu operación específica?`
                : `The recommended plan for ${name} is ~$${topPrice}/mo. Typical ROI is 2-3x the investment in operational savings. When do you have 20 mins to see the numbers with your specific operation?`;
        }

        if (msg.includes('ahorro') || msg.includes('save') || msg.includes('roi') || msg.includes('dinero') || msg.includes('money') || msg.includes('desglose') || msg.includes('breakdown')) {
            return isSpanish
                ? `El ahorro varía según tu operación. Típicamente: menos llamadas perdidas, tiempos de bahía más eficientes, y menos errores administrativos. ¿Quieres que calculemos los números exactos para ${name}?`
                : `Savings vary by operation. Typically: fewer missed calls, more efficient bay times, and fewer admin errors. Want us to calculate exact numbers for ${name}?`;
        }

        if (msg.includes('como funciona') || msg.includes('how does') || msg.includes('explicar') || msg.includes('explain')) {
            return isSpanish
                ? `ORION automatiza tareas repetitivas: contesta llamadas, agenda citas, envía recordatorios y maneja el papeleo digital. Tu equipo se enfoca en reparar autos. ¿Te muestro una demo rápida?`
                : `ORION automates repetitive tasks: answers calls, books appointments, sends reminders, and handles digital paperwork. Your team focuses on fixing cars. Want a quick demo?`;
        }

        // Competitor check (ShopMonkey, etc)
        if (msg.includes('shopmonkey') || msg.includes('tekmetric') || msg.includes('mitchell') || msg.includes('software')) {
            return isSpanish
                ? `Nos integramos con tu software actual. ORION añade la capa de automatización e IA que ellos no tienen. ¿Qué sistema usas actualmente?`
                : `We integrate with your current software. ORION adds the automation and AI layer they don't have. What system do you currently use?`;
        }

        // Default closing response - NO hardcoded inflated numbers
        return isSpanish
            ? `Entiendo. La mejor forma de ver el valor es con una demo personalizada de 20 minutos donde calculamos el ROI específico para ${name}. ¿Te funciona Jueves o Viernes?`
            : `I understand. The best way to see the value is with a personalized 20-minute demo where we calculate the specific ROI for ${name}. Does Thursday or Friday work for you?`;
    }

    _getSecureApiKey() {
        // Priority 1: Check localStorage FIRST (for admin config - same as Mario)
        const storedKey = localStorage.getItem('jose_api_key');
        if (storedKey) {
            return atob(storedKey); // Decode from base64
        }

        // Priority 2: Check mario key as shared fallback
        const marioKey = localStorage.getItem('mario_api_key');
        if (marioKey) return atob(marioKey);

        // Priority 3: Check for ORION_CONFIG (from jose-loader.js - fallback)
        if (window.ORION_CONFIG && typeof window.ORION_CONFIG.getAuth === 'function') {
            const key = window.ORION_CONFIG.getAuth();
            if (key) return key;
        }

        // Priority 4: Check for injected key (from backend/build process)
        if (window.__JOSE_CONFIG__?.apiKey) {
            return window.__JOSE_CONFIG__.apiKey;
        }

        // No key found
        return null;
    }


    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;

        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;

        // Adjust rate based on language - Spanish needs slower for clarity
        const isSpanish = this.language === 'es';
        utterance.rate = isSpanish ? 0.85 : 0.95; // Slower for clarity
        utterance.pitch = 1.0; // Natural pitch
        utterance.volume = 1.0;

        // Set language explicitly
        utterance.lang = isSpanish ? 'es-US' : 'en-US';

        this.synth.speak(utterance);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('jose-voice-btn');

        if (this.voiceEnabled) {
            btn.style.background = 'linear-gradient(135deg, #ff6b00, #ff8c00)';
            btn.title = '🔊 Voz ACTIVADA - Click para desactivar';
            btn.textContent = '🔊';
        } else {
            // Cancel any current speech
            this.synth.cancel();
            btn.style.background = 'rgba(255, 255, 255, 0.1)';
            btn.title = '🔇 Voz DESACTIVADA - Click para activar';
            btn.textContent = '🔇';
        }
    }

    // Public method to configure API key securely
    static configure(apiKey) {
        if (apiKey) {
            localStorage.setItem('jose_api_key', btoa(apiKey));
            console.log('✅ JOSE configured successfully');
        }
    }
    // Public method to switch language dynamically
    setLanguage(lang) {
        if (this.language === lang) return;

        console.log('🔄 JOSE switching language to:', lang);
        this.language = lang;

        // Rebuild system prompt with new language
        this.systemPrompt = this._buildSystemPrompt();

        // Reload voices to ensure correct accent
        this._loadVoices();

        // If chat is open, announce the change (optional)
        if (this.isOpen) {
            const switchMsg = lang === 'es'
                ? "Entendido. Cambiando a Español. ¿En qué más puedo ayudarte?"
                : "Got it. Switching to English. How else can I help you?";
            this._addMessage('jose', switchMsg);
        }
    }
}

// Export for use
window.JoseAssistant = JoseAssistant;

// Auto-initialize if config is present
document.addEventListener('DOMContentLoaded', () => {
    if (window.JOSE_CONFIG) {
        console.log('🤖 Starting JOSE Assistant for:', window.JOSE_CONFIG.clientName);
        window.jose = new JoseAssistant(window.JOSE_CONFIG);
    }
});
