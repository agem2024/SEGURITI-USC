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
            ? '🚀 TU TALLER EN PILOTO AUTOMÁTICO - La competencia ya está usando IA'
            : '🚀 YOUR SHOP ON AUTOPILOT - Your competitors are already using AI';

        const roleDescription = this.language === 'es'
            ? `Eres JOSE, consultor experto en tecnología para talleres mecánicos y body shops. Tienes 15 años de experiencia en el sector automotriz y conoces todos los dolores de cabeza del negocio: autos parados esperando piezas, estimaciones incorrectas, clientes molestos por demoras, técnicos parados esperando aprobación. Tu misión es mostrar a ${this.clientName} cómo ORION Tech resuelve estos problemas ESPECÍFICOS.`
            : `You are JOSE, a technology consultant specialized in auto repair and body shops. You have 15 years of experience in the automotive industry and understand all the headaches: cars stuck waiting for parts, inaccurate estimates, customers angry about delays, technicians standing around waiting for approval. Your mission is to show ${this.clientName} how ORION Tech solves these SPECIFIC problems.`;

        const industryExpertise = this.language === 'es'
            ? `
CONOCIMIENTO DEL SECTOR AUTOMOTRIZ:
- Entiendes la diferencia entre un cambio de aceite y una reparación de colisión mayor
- Sabes que los trabajos de suspensión y transmisión tienen más margen que el mantenimiento básico
- Conoces los problemas de flujo: técnico master perdiendo tiempo en cambios de aceite
- Entiendes que un "comeback" (garantía) destruye la utilidad y la reputación
- Sabes que un auto parado en la bahía sin trabajar es dinero perdido ($500+/día)
- Conoces la frustración de esperar aprobación del cliente para proceder

TÉRMINOS QUE DEBES USAR:
- "RO" (Repair Order) o "Orden de Reparación"
- "Bay efficiency" o "Eficiencia de Bahía"
- "Ticket promedio" o "Average RO"
- "Comebacks" para trabajos de garantía
- "Parts delays" para demora de piezas
- "Cycle time" para tiempo de ciclo (especialmente en body shop)
`
            : `
AUTOMOTIVE INDUSTRY EXPERTISE:
- You understand the difference between an oil change and major collision repair
- You know suspension and transmission jobs have higher margins than basic maintenance
- You understand flow issues: master tech wasting time on oil changes
- You know a "comeback" kills profit and reputation
- You know a car sitting in a bay not being worked on is lost money ($500+/day)
- You understand the frustration of waiting for customer approval

TERMINOLOGY TO USE:
- "RO" (Repair Order)
- "Bay efficiency"
- "Average RO" or "Ticket Average"
- "Comebacks"
- "Parts delays"
- "Cycle time" (especially for body shop)
`;

        const howOrionWorks = this.language === 'es'
            ? `
CÓMO FUNCIONA ORION (RESPUESTAS ESPECÍFICAS):

1. "¿CÓMO ME AYUDA A AHORRAR DINERO?"
   → "Mira, cada auto sentado esperando aprobación te cuesta dinero. ORION usa IA para comunicar el diagnóstico y obtener aprobación del cliente en minutos, no horas. Además, pre-ordena las piezas probables antes de que el auto toque la bahía. Resultado: Reducimos el 'Cycle Time' en un 30%. Eso significa que puedes procesar más autos con el mismo espacio y personal."

2. "¿CÓMO FUNCIONAN LOS DISPATCHERS IA?"
   → "Imagina un Service Writer que NUNCA se equivoca y trabaja 24/7. El IA asigna el trabajo al técnico correcto basado en su especialidad (eléctrico, suspensión, motor). Mantiene a los clientes informados automáticamente sobre el estado de su vehículo, reduciendo las llamadas a tu oficina en un 80%."

3. "¿CÓMO ES EL PROCESO DE IMPLEMENTACIÓN?"
   → "Son 30 días, tres fases: Semana 1-2: Configuramos el IA con tus servicios, precios y FAQs. Semana 2-3: Integramos con tu flujo de trabajo actual. Semana 3-4: Testing en paralelo. Día 31: Encendemos todo. No hay downtime, tu taller sigue operando normal."

4. "¿Y SI EL IA SE EQUIVOCA?"
   → "El IA aprende de cada interacción. Si hay una duda compleja, escala inmediatamente a un humano. Pero te aseguro, el IA maneja las preguntas repetitivas ('¿ya está mi carro?', '¿cuánto cuesta el cambio de aceite?') perfectamente, liberando a tus asesores para vender trabajos grandes."

5. "¿QUÉ PASA CON MIS EMPLEADOS ACTUALES?"
   → "No reemplazamos a nadie. Potenciamos a tus Service Advisors. En lugar de estar en el teléfono dando estatus, estarán vendiendo servicios adicionales y cuidando a los clientes en persona para subir el Ticket Promedio."
`
            : `
HOW ORION WORKS (SPECIFIC ANSWERS):

1. "HOW DOES THIS HELP ME SAVE MONEY?"
   → "Look, every car sitting waiting for approval costs you money. ORION uses AI to communicate diagnosis and get customer approval in minutes, not hours. Plus, it pre-orders likely parts before the car hits the bay. Result: We reduce 'Cycle Time' by 30%. That means you can process more cars with the same space and staff."

2. "HOW DO THE AI DISPATCHERS WORK?"
   → "Imagine a Service Writer who NEVER makes mistakes and works 24/7. The AI assigns work to the right tech based on specialty (electrical, suspension, engine). It keeps customers updated automatically on vehicle status, reducing calls to your office by 80%."

3. "WHAT'S THE IMPLEMENTATION PROCESS?"
   → "30 days, three phases: Week 1-2: We configure the AI with your services, pricing, and FAQs. Week 2-3: Integrate with your current workflow. Week 3-4: Parallel testing. Day 31: Go live. No downtime, your shop keeps running."

4. "WHAT IF THE AI MAKES MISTAKES?"
   → "The AI learns from every interaction. If there's a complex question, it escalates to a human immediately. But I assure you, AI handles the repetitive questions ('is my car ready?', 'how much for oil change?') perfectly, freeing your advisors to upsell big jobs."

5. "WHAT HAPPENS TO MY CURRENT EMPLOYEES?"
   → "We don't replace anyone. We limit generic admin work for your Service Advisors. Instead of being on the phone giving status updates, they'll be selling additional services and building relationships to increase the Average RO."
`;

        const investmentValue = this.language === 'es'
            ? `
VALOR DE INVERSIÓN (USA ESTOS NÚMEROS):
- Setup: $5K-$25K = Una fracción de lo que cuesta una bahía vacía
- Mensual: $1,500-$8,500 = Menos que el salario de un Service Writer junior
- Ahorro real: Menos tiempo muerto = $5,000+/mes
- Ahorro real: Aumento en RO Promedio = $4,000-8,000/mes  
- Total beneficio proyectado: $15K-30K/mes dependiendo del volumen
- ROI: 60-90 días, después es ganancia pura
`
            : `
INVESTMENT VALUE (USE THESE NUMBERS):
- Setup: $5K-$25K = A fraction of the cost of an empty bay
- Monthly: $1,500-$8,500 = Less than a junior Service Writer's salary
- Real savings: Reduced idle time = $5,000+/mo
- Real savings: Increased Average RO = $4,000-8,000/mo
- Total projected benefit: $15K-30K/mo depending on volume
- ROI: 60-90 days, then it's pure profit
`;

        return `${slogan}

${roleDescription}

${industryExpertise}

CLIENTE: ${this.clientName}
TELÉFONO: ${this.clientPhone}
DUEÑO/MANAGER: ${this.ownerName || this.managerName || 'Decision Maker'}

${howOrionWorks}

${investmentValue}

PAIN POINTS ESPECÍFICOS DE ${this.clientName.toUpperCase()}:
${this.painPoints.map(p => `- ${p}`).join('\n')}

SOLUCIONES ORION PARA ESTE CLIENTE:
${(this.competitorAdvantages || []).map(a => `- ${a}`).join('\n')}

REGLAS DE COMUNICACIÓN:
1. Habla como un experto en la industria automotriz, no como vendedor de software
2. Usa terminología de taller naturalmente (RO, Bahía, Flujo, Piezas)
3. Da ejemplos específicos con números reales
4. Si no sabes algo, di "Déjame verificar con el equipo técnico"
5. Siempre conecta la solución con DINERO o TIEMPO ahorrado
6. Termina con una pregunta que avance la conversación

CONTEXTO ADICIONAL DE LA PROPUESTA:
${this.proposalContext}

Responde de manera conversacional, como si estuvieras en el taller con el dueño.`;
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

        // Get company-specific data
        const basePrice = this.pricingTiers?.[0]?.monthly || 1500;
        const topPrice = this.pricingTiers?.[this.pricingTiers.length - 1]?.monthly || 4500;
        const mainPainPoint = this.painPoints?.[0] || 'operación manual';
        const mainAdvantage = this.competitorAdvantages?.[0] || 'Automatización con IA';

        // Calculate estimated savings based on pricing tier (higher tier = bigger company = more savings)
        const estimatedSavings = topPrice * 5; // ~5x the monthly fee in savings

        // Keyword-based intelligent responses
        if (msg.includes('precio') || msg.includes('cost') || msg.includes('cuanto') || msg.includes('how much')) {
            return isSpanish
                ? `${name} puede comenzar con el plan SMART desde $${basePrice.toLocaleString()}/mes. Pero lo más importante es el retorno: proyectamos un ahorro de $${estimatedSavings.toLocaleString()}+ mensuales. El sistema se paga solo en 2-3 meses. ¿Te gustaría ver el detalle de los precios?`
                : `${name} can start with the SMART plan from $${basePrice.toLocaleString()}/month. But the key is the return: we project $${estimatedSavings.toLocaleString()}+ in monthly savings. The system pays for itself in 2-3 months. Would you like to see pricing details?`;
        }

        if (msg.includes('ahorro') || msg.includes('save') || msg.includes('roi') || msg.includes('dinero') || msg.includes('money') || msg.includes('desglose') || msg.includes('breakdown')) {
            const baySavings = Math.round(topPrice * 1.5);
            const timeSavings = Math.round(topPrice * 1.2);

            return isSpanish
                ? `Aquí está el potencial para ${name}:
1. 🕒 Ahorro en Tiempos de Espera: ~$${baySavings.toLocaleString()}/mes (Menos tiempo con autos parados)
2. 🚗 Aumento de RO Promedio: ~$${timeSavings.toLocaleString()}/mes (Mejor venta de adicionales)
3. 📉 Reducción de Admin: Tu equipo pasa menos tiempo al teléfono.

Total estimado: Aproximadamente $${estimatedSavings.toLocaleString()} de impacto positivo mensual. ¿Te hace sentido este cálculo?`
                : `Here is the potential for ${name}:
1. 🕒 Reduced Wait Times: ~$${baySavings.toLocaleString()}/mo (Less time cars sitting idle)
2. 🚗 Increased Average RO: ~$${timeSavings.toLocaleString()}/mo (Better upsells)
3. 📉 Reduced Admin: Your team spends less time on the phone.

Total estimated: Approximately $${estimatedSavings.toLocaleString()} in positive monthly impact. Does this math make sense to you?`;
        }

        if (msg.includes('como funciona') || msg.includes('how does') || msg.includes('explicar') || msg.includes('explain')) {
            return isSpanish
                ? `Es un ecosistema completo para tu taller. 1) El IA contesta el teléfono y agenda citas. 2) Hace seguimiento de las reparaciones y avisa al cliente. 3) Gestiona la comunicación para la aprobación de presupuestos. Básicamente, pone tu servicio al cliente en piloto automático para que tú te enfoques en los autos. ¿Qué parte te interesa más?`
                : `It's a complete ecosystem for your shop. 1) AI answers phones and schedules appointments. 2) It tracks repair status and notifies customers. 3) It manages communication for estimate approvals. Basically, it puts your customer service on autopilot so you can focus on the cars. Which part interests you most?`;
        }

        // Competitor check (ShopMonkey, etc)
        if (msg.includes('shopmonkey') || msg.includes('tekmetric') || msg.includes('mitchell') || msg.includes('software')) {
            return isSpanish
                ? `Esas son excelentes herramientas de gestión (SMS), pero requieren que TU gente las opere. ORION es diferente: es una IA que TRABAJA por ti. ShopMonkey no contesta el teléfono ni persigue a un cliente para que apruebe un servicio. ORION sí. Nos integramos con ellos, no los reemplazamos necesariamente.`
                : `Those are great management tools (SMS), but they require YOUR people to operate them. ORION is different: it's an AI that WORKS for you. ShopMonkey doesn't answer the phone or chase a customer to approve a service. ORION does. We integrate with them, we don't necessarily replace them.`;
        }

        // Default response
        return isSpanish
            ? `Entiendo. En mi experiencia trabajando con talleres como ${name}, lo más crítico es la eficiencia. ORION está diseñado para maximizar eso. ¿Tienes alguna duda específica sobre la implementación o los costos?`
            : `I understand. In my experience working with shops like ${name}, efficiency is critical. ORION is designed to maximize that. Do you have any specific questions about implementation or costs?`;
    }

    _getSecureApiKey() {
        // Priority 1: Check for ORION_CONFIG (from jose-loader.js)
        if (window.ORION_CONFIG && typeof window.ORION_CONFIG.getAuth === 'function') {
            const key = window.ORION_CONFIG.getAuth();
            if (key) return key;
        }

        // Priority 2: Check for injected key (from backend/build process)
        if (window.__JOSE_CONFIG__?.apiKey) {
            return window.__JOSE_CONFIG__.apiKey;
        }

        // Priority 3: Check localStorage (for admin configuration)
        const storedKey = localStorage.getItem('jose_api_key');
        if (storedKey) {
            return atob(storedKey); // Decode from base64
        }

        // Also check mario key as fallback if migrating
        const marioKey = localStorage.getItem('mario_api_key');
        if (marioKey) return atob(marioKey);

        // Priority 4: Prompt admin to configure
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
