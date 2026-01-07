/**
 * ELISA - AI Beauty Consultant for ORION Tech Proposals
 * Bilingual (EN/ES) | Female Voice | Gemini AI Powered
 * "Tu Belleza, En Piloto Automático" / "Your Beauty Business, On Autopilot"
 * VERSION: FIXED 2026-01-07
 */

class ElisaAssistant {
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
        this.hasGreeted = false;
        this.voiceEnabled = false;

        // System prompt for sales-focused AI
        this.systemPrompt = this._buildSystemPrompt();

        // Configuration for UI
        this.uiConfig = {
            primaryColor: '#c9a962', // Gold
            gradient: 'linear-gradient(135deg, #d4a5c9 0%, #c9a962 100%)',
            iconUrl: 'https://agem2024.github.io/SEGURITI-USC/proposals/mungela%20glow/elisa_avatar.png'
        };

        this._init();
    }

    _buildSystemPrompt() {
        const slogan = this.language === 'es'
            ? '✨ TU SALÓN EN PILOTO AUTOMÁTICO - Maximiza cada cita'
            : '✨ YOUR SALON ON AUTOPILOT - Maximize every appointment';

        const roleDescription = this.language === 'es'
            ? `Eres ELISA, consultora experta en negocios de belleza y cosmetología. Eres sofisticada, empática pero enfocada en negocios. Tu objetivo es agendar una DEMO. Conoces los dolores de los salones: "No-shows" (clientes que no llegan), estilistas con tiempos muertos, inventario de productos perdido, dificultad para re-agendar. Tu "vibe" es profesional, chic y eficiente.`
            : `You are ELISA, an expert beauty business consultant. You are sophisticated, empathetic but business-focused. Your goal is to schedule a DEMO. You know salon pain points: No-shows, stylists with idle time, lost product inventory, difficulty rebooking. Your vibe is professional, chic, and efficient.`;

        const industryExpertise = this.language === 'es'
            ? `
EXPERIENCIA EN INDUSTRIA DE BELLEZA:
- Sabes que un "No-show" cuesta $100-$300 directos.
- Entiendes que el dinero real está en el "Rebooking" y el "Upsell" de productos (Shampoo, Tratamientos).
- Conoces el caos de gestionar citas por WhatsApp mientras atiendes a un cliente.
- Sabes que una silla vacía es el activo más caro del salón.
- Entiendes la importancia de la "Consulta de Imagen" antes de la cita para evitar correcciones largas.
`
            : `
BEAUTY INDUSTRY EXPERTISE:
- You know a "No-show" costs $100-$300 directly.
- You understand the real money is in "Rebooking" and Product "Upsells".
- You know the chaos of managing WhatsApp bookings while working on a client.
- You know an empty chair is the most expensive asset in the salon.
- You understand the importance of "Image Consultation" before the appointment to avoid long corrections.
`;

        const costJustification = this.language === 'es'
            ? `
JUSTIFICACIÓN FINANCIERA:
1. ELIMINACIÓN DE NO-SHOWS:
   - "Un No-Show de color completo = $150 perdidos. Si tienes 3 a la semana = $1,800/mes. ELISA cobra depósitos automáticos y envía 3 recordatorios. Resultado: 90% reducción de No-Shows."

2. REBOOKING AUTOMÁTICO:
   - "El 60% de clientes NO re-agendan en el salón. ELISA envía WhatsApp automático 6 semanas después del servicio. Resultado: +30% frecuencia de visita = $5,000 extra/mes."

3. VENTA DE PRODUCTO (RETAIL):
   - "ELISA recomienda productos específicos post-servicio via WhatsApp con link de compra. Tus estilistas ya no tienen que 'vender'. Resultado: +25% en ventas de producto."
`
            : `
FINANCIAL JUSTIFICATION:
1. ELIMINATING NO-SHOWS:
   - "A full color No-Show = $150 lost. 3 per week = $1,800/mo. ELISA takes auto-deposits and sends 3 reminders. Result: 90% No-Show reduction."

2. AUTO-REBOOKING:
   - "60% of clients DON'T rebook at the salon. ELISA sends auto-WhatsApp 6 weeks after service. Result: +30% visit frequency = $5,000 extra/mo."

3. RETAIL SALES:
   - "ELISA recommends specific products post-service via WhatsApp with purchase link. Your stylists don't have to 'sell'. Result: +25% product sales."
`;

        const closingStrategy = this.language === 'es'
            ? `
ESTRATEGIA DE CIERRE:
- "Si te digo que puedo llenar 5 huecos vacíos al mes que hoy pierdes, ¿cuánto vale eso? A $150 por servicio = $750. ELISA cuesta menos que eso. ¿Cuándo tienes 20 minutos para ver la demo?"
- Objeción de precio: "Querida, una silla vacía cuesta $100/hora. ELISA llena esas sillas. La pregunta no es si puedes pagarlo, es si puedes seguir perdiendo ese dinero."
- "Tengo que pensarlo": "Entiendo. Mientras lo piensas, ¿cuántas citas se van a perder esta semana por falta de seguimiento? Hagamos una prueba de 2 semanas sin riesgo."
`
            : `
CLOSING STRATEGY:
- "If I tell you I can fill 5 empty gaps per month that you're losing today, what's that worth? At $150/service = $750. ELISA costs less than that. When do you have 20 mins for a demo?"
- Price objection: "Dear, an empty chair costs $100/hour. ELISA fills those chairs. The question isn't whether you can afford it, it's whether you can keep losing that money."
- "I need to think": "Understood. While you think, how many appointments will be lost this week from lack of follow-up? Let's do a 2-week risk-free trial."
`;

        return `${slogan}

${roleDescription}

${industryExpertise}

${costJustification}

${closingStrategy}

CLIENTE: ${this.clientName}
TELÉFONO: ${this.clientPhone}
DUEÑO/MANAGER: ${this.ownerName || this.managerName || 'Owner'}

PAIN POINTS DE ${this.clientName.toUpperCase()}:
${this.painPoints.join(', ')}

SOLUCIONES ORION:
${(this.competitorAdvantages || []).map(a => `- ${a}`).join('\n')}

REGLAS DE COMUNICACIÓN:
1. Tono: Sofisticado, Amable, Profesional. (No "Bro", No "Amigo", usa "Estimado/a", "Querida").
2. Enfatiza la EXPERIENCIA DEL CLIENTE (Customer Experience).
3. Siempre conecta la solución con AUMENTO DE TICKET y RETENCIÓN.
4. Siempre termina con una pregunta para avanzar.

CONTEXTO ADICIONAL:
${this.proposalContext}

Responde de forma breve y concisa. Máximo 2-3 oraciones. Siempre termina con una pregunta.`;
    }

    _init() {
        // Find appropriate female voice
        this._loadVoices();
        this.synth.onvoiceschanged = () => this._loadVoices();

        // Create UI elements
        this._createChatUI();

        // Add welcome message
        setTimeout(() => {
            const targetName = this.ownerName || this.managerName || '';
            const topPrice = this.pricingTiers?.[this.pricingTiers.length - 1]?.monthly || 4500;
            const estimatedSavings = Math.round(topPrice * 6 / 1000) * 1000;
            const savingsFormatted = (estimatedSavings / 1000).toFixed(0);

            const welcome = this.language === 'es'
                ? `${targetName ? '¡Hola ' + targetName + '! ' : '¡Hola! '}Soy ELISA de ORION Tech. ✨ Tengo una propuesta para elevar la experiencia en ${this.clientName} y generar más de ${savingsFormatted}k extra al mes. ¿Te muestro cómo?`
                : `${targetName ? 'Hello ' + targetName + '! ' : 'Hello! '}I'm ELISA from ORION Tech. ✨ I have a proposal to elevate the experience at ${this.clientName} and generate over $${estimatedSavings.toLocaleString()} extra per month. Shall I show you how?`;
            this._addMessage('elisa', welcome);
        }, 500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const isSpanish = this.language === 'es';

        // Preferred voices - looking for female, clear, pleasant voices
        const spanishVoices = [
            'Microsoft Sabina',     // Mexican Spanish Female
            'Microsoft Helena',     // Spanish Female
            'Google español',       // Often female default
            'es-MX',
            'es-ES'
        ];

        const englishVoices = [
            'Microsoft Zira',       // US English Female
            'Google US English',    // Often female
            'Samantha',             // macOS
            'en-US',
            'en-GB'
        ];

        const preferredVoices = isSpanish ? spanishVoices : englishVoices;

        // Try to find a preferred voice
        for (const preferred of preferredVoices) {
            const found = voices.find(v =>
                (v.name.includes(preferred) || v.lang.includes(preferred)) &&
                !v.name.includes('David') && !v.name.includes('Raul') && !v.name.includes('Mark')
            );
            if (found) {
                this.selectedVoice = found;
                console.log('🎤 ELISA voice:', found.name, found.lang);
                break;
            }
        }

        // Fallback
        if (!this.selectedVoice) {
            const langCode = isSpanish ? 'es' : 'en';
            this.selectedVoice = voices.find(v => v.lang.startsWith(langCode)) || voices[0];
            console.log('🎤 ELISA fallback voice:', this.selectedVoice?.name);
        }
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'elisa-chat-container';
        container.innerHTML = `
            <style>
                #elisa-chat-container {
                    position: fixed;
                    bottom: 100px;
                    left: 20px;
                    z-index: 10000;
                    font-family: 'Inter', sans-serif;
                }
                
                #elisa-toggle {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: ${this.uiConfig.gradient};
                    border: 3px solid #fff;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(212, 165, 201, 0.6);
                    transition: transform 0.3s, box-shadow 0.3s;
                    overflow: hidden;
                    padding: 0;
                    animation: pulseGlow 2s ease-in-out infinite;
                }
                
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(212, 165, 201, 0.6); border-color: #fff; }
                    50% { box-shadow: 0 0 30px rgba(201, 169, 98, 0.8); border-color: #f0f0f0; }
                }
                
                #elisa-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 40px rgba(212, 165, 201, 0.8);
                }
                
                #elisa-chat-window {
                    display: none;
                    width: 380px;
                    height: 550px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    flex-direction: column;
                    position: absolute;
                    bottom: 90px;
                    left: 0;
                }
                
                #elisa-chat-window.open {
                    display: flex;
                    animation: slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                #elisa-header {
                    background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 100%);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid #333;
                }
                
                #elisa-header img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid ${this.uiConfig.primaryColor};
                    object-fit: cover;
                }
                
                #elisa-header-info h3 {
                    color: #fff;
                    margin: 0;
                    font-size: 1.1rem;
                    font-family: 'Orbitron', sans-serif;
                }
                
                #elisa-header-info span {
                    color: ${this.uiConfig.primaryColor};
                    font-size: 0.8rem;
                }
                
                #elisa-close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                
                #elisa-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    background: #121212;
                }
                
                .elisa-message {
                    max-width: 80%;
                    padding: 14px 18px;
                    border-radius: 18px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .elisa-message.elisa {
                    background: linear-gradient(135deg, rgba(212, 165, 201, 0.1), rgba(201, 169, 98, 0.1));
                    border: 1px solid rgba(201, 169, 98, 0.2);
                    color: #fff;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }
                
                .elisa-message.user {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }
                
                #elisa-input-area {
                    padding: 20px;
                    border-top: 1px solid #333;
                    display: flex;
                    gap: 10px;
                    background: #1a1a1a;
                }
                
                #elisa-input {
                    flex: 1;
                    background: #252525;
                    border: 1px solid #444;
                    border-radius: 30px;
                    padding: 12px 20px;
                    color: #fff;
                    outline: none;
                    transition: border-color 0.3s;
                }
                
                #elisa-input:focus {
                    border-color: ${this.uiConfig.primaryColor};
                }
                
                #elisa-send {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: ${this.uiConfig.gradient};
                    border: none;
                    color: #000;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #elisa-voice-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid #444;
                    color: ${this.uiConfig.primaryColor};
                    cursor: pointer;
                    font-size: 1.1rem;
                }
                
                @media (max-width: 480px) {
                    #elisa-chat-window {
                        width: calc(100vw - 40px);
                        height: 60vh;
                        left: -10px;
                    }
                }
            </style>
            
            <div id="elisa-chat-window">
                <div id="elisa-header">
                    <img src="${this.uiConfig.iconUrl}" 
                         alt="ELISA" 
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Ccircle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23d4a5c9\\'/%3E%3Ctext x=\\'50\\' y=\\'65\\' text-anchor=\\'middle\\' font-size=\\'40\\' fill=\\'white\\'%3E✨%3C/text%3E%3C/svg%3E'">
                    <div id="elisa-header-info">
                        <h3>ELISA</h3>
                        <span>AI Beauty Consultant</span>
                    </div>
                    <button id="elisa-close">×</button>
                </div>
                <div id="elisa-messages"></div>
                <div id="elisa-input-area">
                    <button id="elisa-voice-btn" title="Voice">🎤</button>
                    <input type="text" id="elisa-input" placeholder="Ask Elisa...">
                    <button id="elisa-send">➤</button>
                </div>
            </div>
            
            <button id="elisa-toggle">
               <img src="${this.uiConfig.iconUrl}" 
                         alt="Chat" 
                         style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"
                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Ccircle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23d4a5c9\\'/%3E%3Ctext x=\\'50\\' y=\\'65\\' text-anchor=\\'middle\\' font-size=\\'40\\' fill=\\'white\\'%3E✨%3C/text%3E%3C/svg%3E'">
            </button>
        `;

        document.body.appendChild(container);

        // Event listeners
        document.getElementById('elisa-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('elisa-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('elisa-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('elisa-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this._sendMessage();
        });
        document.getElementById('elisa-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    _toggleChat() {
        const chatWindow = document.getElementById('elisa-chat-window');
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('open', this.isOpen);

        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            this.voiceEnabled = true;
            const btn = document.getElementById('elisa-voice-btn');
            btn.style.background = this.uiConfig.gradient;
            btn.style.color = '#000';
            btn.textContent = '🔊';

            setTimeout(() => {
                const targetName = this.ownerName || this.managerName || '';
                const greeting = this.language === 'es'
                    ? `${targetName ? targetName + ', ' : ''}soy ELISA de ORION Tech. Puedo llenar tu agenda y vender más productos mientras tú duermes. ¿Te cuento cómo?`
                    : `${targetName ? targetName + ', ' : ''}I'm ELISA from ORION Tech. I can fill your calendar and sell more products while you sleep. Shall I tell you how?`;
                this._speak(greeting);
            }, 500);
        }
    }

    _addMessage(sender, text) {
        const messagesContainer = document.getElementById('elisa-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `elisa-message ${sender}`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (sender === 'elisa' && this.voiceEnabled) {
            this._speak(text);
        }

        this.messages.push({ role: sender === 'elisa' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('elisa-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);

        // Typing indicator
        const messagesContainer = document.getElementById('elisa-messages');
        const typing = document.createElement('div');
        typing.innerHTML = '...';
        typing.className = 'elisa-message elisa';
        typing.id = 'elisa-typing';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await this._callGemini(text);
            document.getElementById('elisa-typing')?.remove();
            this._addMessage('elisa', response);
        } catch (error) {
            document.getElementById('elisa-typing')?.remove();
            const errorMsg = this.language === 'es' ? 'Un momento, estoy pensando...' : 'One moment, I am thinking...';
            this._addMessage('elisa', errorMsg);
            console.error('ELISA Error:', error);
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) {
            console.warn('⚠️ ELISA: No API key found, using fallback responses');
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
                    maxOutputTokens: 300,
                    topP: 0.9
                }
            };

            console.log('✨ ELISA calling Gemini API...');

            const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                console.error('ELISA API Error:', response.status, response.statusText);
                return this._getFallbackResponse(userMessage);
            }

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiResponse) {
                console.error('ELISA: Empty response from API');
                return this._getFallbackResponse(userMessage);
            }

            return aiResponse;

        } catch (error) {
            console.error('ELISA API Exception:', error);
            return this._getFallbackResponse(userMessage);
        }
    }

    _getFallbackResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        const isSpanish = this.language === 'es';
        const name = this.clientName;
        const topPrice = this.pricingTiers?.[this.pricingTiers.length - 1]?.monthly || 4500;
        const estimatedSavings = Math.round(topPrice * 6 / 1000) * 1000;

        if (msg.includes('precio') || msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('cuanto')) {
            return isSpanish
                ? `El dinero es claro: ORION cuesta $${topPrice}/mes, pero recuperas más de $${estimatedSavings.toLocaleString()} eliminando no-shows y llenando huecos. ¿Prefieres seguir perdiendo o invertir en tecnología?`
                : `The money is clear: ORION costs $${topPrice}/mo, but you recover over $${estimatedSavings.toLocaleString()} by eliminating no-shows and filling gaps. Would you rather keep losing or invest in technology?`;
        }

        if (msg.includes('ahorro') || msg.includes('save') || msg.includes('roi') || msg.includes('money') || msg.includes('dinero')) {
            return isSpanish
                ? `Números para ${name}:\n🚫 No-Shows eliminados: ~$2,500/mes\n💄 Venta de producto: ~$1,500/mes\n📅 Re-agendamiento: ~$3,000/mes\n\nTotal: $${estimatedSavings.toLocaleString()}/mes extra. ¿Cuándo puedes ver la demo?`
                : `Numbers for ${name}:\n🚫 No-Shows eliminated: ~$2,500/mo\n💄 Retail sales: ~$1,500/mo\n📅 Rebooking: ~$3,000/mo\n\nTotal: $${estimatedSavings.toLocaleString()}/mo extra. When can you see the demo?`;
        }

        if (msg.includes('agenda') || msg.includes('booking') || msg.includes('reserv') || msg.includes('como funciona') || msg.includes('how does')) {
            return isSpanish
                ? `Soy tu asistente 24/7. Manejo agenda, cobro depósitos y recuerdo a tus clientes que regresen. Tú te enfocas en hacerlas hermosas. ¿Quieres ver una demo rápida?`
                : `I'm your 24/7 assistant. I manage bookings, collect deposits, and remind clients to return. You focus on making them beautiful. Want a quick demo?`;
        }

        if (msg.includes('fresha') || msg.includes('vagaro') || msg.includes('booksy') || msg.includes('software')) {
            return isSpanish
                ? `Ellos son agendas digitales, pero NO venden. ELISA es una vendedora activa que busca al cliente para que regrese. ¿Quieres que tu software espere o que venda?`
                : `They're digital calendars, but they DON'T sell. ELISA is an active salesperson who chases clients to return. Do you want your software to wait or to sell?`;
        }

        return isSpanish
            ? `Entiendo. Pero ${name} merece ser líder del mercado. Si pudieras eliminar espacios vacíos mañana, ¿lo harías? Tengo espacio para demo el Jueves.`
            : `I understand. But ${name} deserves to be the market leader. If you could eliminate empty slots tomorrow, would you? I have a demo slot Thursday.`;
    }

    _getSecureApiKey() {
        // Priority 1: Check for ORION_CONFIG (from jose-loader.js)
        if (window.ORION_CONFIG && typeof window.ORION_CONFIG.getAuth === 'function') {
            const key = window.ORION_CONFIG.getAuth();
            if (key) return key;
        }

        // Priority 2: Check for injected key
        if (window.__ELISA_CONFIG__?.apiKey) {
            return window.__ELISA_CONFIG__.apiKey;
        }

        // Priority 3: Check localStorage
        const elisaKey = localStorage.getItem('elisa_api_key');
        if (elisaKey) return atob(elisaKey);

        const joseKey = localStorage.getItem('jose_api_key');
        if (joseKey) return atob(joseKey);

        return null;
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;

        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;

        // Adjust rate based on language - Spanish needs slower for clarity
        const isSpanish = this.language === 'es';
        utterance.rate = isSpanish ? 0.85 : 0.95;
        utterance.pitch = 1.1; // Slightly higher for female voice
        utterance.volume = 1.0;

        // *** FIX: Set language explicitly to fix pronunciation ***
        utterance.lang = isSpanish ? 'es-MX' : 'en-US';

        this.synth.speak(utterance);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('elisa-voice-btn');

        if (this.voiceEnabled) {
            btn.style.background = this.uiConfig.gradient;
            btn.style.color = '#000';
            btn.title = '🔊 Voz ACTIVADA - Click para desactivar';
            btn.textContent = '🔊';
        } else {
            this.synth.cancel();
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.color = this.uiConfig.primaryColor;
            btn.title = '🔇 Voz DESACTIVADA - Click para activar';
            btn.textContent = '🔇';
        }
    }

    static configure(apiKey) {
        if (apiKey) {
            localStorage.setItem('elisa_api_key', btoa(apiKey));
            console.log('✅ ELISA configured successfully');
        }
    }

    setLanguage(lang) {
        if (this.language === lang) return;

        console.log('🔄 ELISA switching language to:', lang);
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        this._loadVoices();

        if (this.isOpen) {
            const switchMsg = lang === 'es'
                ? "Entendido. Cambiando a Español. ✨"
                : "Got it. Switching to English. ✨";
            this._addMessage('elisa', switchMsg);
        }
    }
}

// Export for use
window.ElisaAssistant = ElisaAssistant;

// Auto-initialize if config is present
document.addEventListener('DOMContentLoaded', () => {
    if (window.ELISA_CONFIG) {
        console.log('✨ Starting ELISA Assistant for:', window.ELISA_CONFIG.clientName);
        window.elisa = new ElisaAssistant(window.ELISA_CONFIG);
    }
});
