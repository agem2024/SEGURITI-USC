class JoseAssistant {
    constructor(config) {
        this.config = config;
        this.chatContainer = null;
        this.messagesContainer = null;
        this.inputField = null;
        this.isOpen = false;
        this.isTyping = false;
        this.language = 'en'; // Default to English
        this.clientName = 'LGB Autowork'; // Default client
        this.context = []; // Memory of conversation

        // Voice settings
        this.voices = [];
        this.selectedVoice = null;
        this.synth = window.speechSynthesis;

        // Auto-initialize
        this.init();
    }

    init() {
        console.log('🔧 JOSE AI Assistant Initializing...');
        this._createChatUI();
        this._loadVoices();

        // Load API Key from LocalStorage if available (Secure pattern)
        const storedKey = localStorage.getItem('ORION_AI_KEY');
        if (storedKey) {
            this.apiKey = storedKey;
        }

        // Welcome message delay
        setTimeout(() => {
            this._addMessage('system', this.language === 'es'
                ? `Hola, soy <b>JOSE</b>. Veo que tienes un taller de primera clase aqui en Foxworthy Ave. ¿Te gustaría ver cómo ORION funciona como un "Scanner de Diagnóstico" para tus ventas perdidas?`
                : `Hi, I'm <b>JOSE</b>. I see you run a top-tier shop here on Foxworthy Ave. Would you like to see how ORION runs like a "Diagnostic Scanner" for your missed sales?`);
        }, 2000);
    }

    _loadVoices() {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            // Look for a male voice, preferably standard/deep
            this.selectedVoice = voices.find(v => v.name.includes('David')) || // Windows
                voices.find(v => v.name.includes('Google US English Male')) || // Chrome
                voices.find(v => v.name.includes('Alex')) || // Mac
                voices[0];
        };
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        container.innerHTML = `
            <style>
                #jose-chat-container {
                    position: fixed;
                    bottom: 100px;
                    right: 30px; 
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }
                
                #jose-toggle {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: #ff6b00; /* NAPA Orange */
                    border: 3px solid #1a73e8; /* NAPA Blue */
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    transition: transform 0.3s;
                    overflow: hidden;
                    padding: 0;
                }
                
                #jose-toggle:hover {
                    transform: scale(1.1);
                }

                #jose-toggle img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                #jose-chat-window {
                    display: none;
                    width: 380px;
                    height: 550px;
                    background: #1a1b26; /* Dark workshop minimalist */
                    border: 1px solid #333;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    flex-direction: column;
                    position: absolute;
                    bottom: 90px;
                    right: 0;
                    overflow: hidden;
                }
                
                #jose-header {
                    background: linear-gradient(135deg, #1a73e8, #0d47a1);
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    color: white;
                    border-bottom: 2px solid #ff6b00;
                }

                #jose-header img {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: 2px solid #ff6b00;
                }
                
                #jose-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    background: #0f1115;
                }
                
                .jose-msg {
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    max-width: 85%;
                }
                
                .jose-msg.system {
                    background: #1e293b;
                    color: #e2e8f0;
                    border-left: 3px solid #ff6b00;
                    align-self: flex-start;
                    border-top-left-radius: 2px;
                }
                
                .jose-msg.user {
                    background: #1a73e8;
                    color: white;
                    align-self: flex-end;
                    border-top-right-radius: 2px;
                }

                #jose-input-area {
                    padding: 15px;
                    background: #1a1b26;
                    border-top: 1px solid #333;
                    display: flex;
                    gap: 10px;
                }

                #jose-input {
                    flex: 1;
                    background: #0f1115;
                    border: 1px solid #333;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 20px;
                    outline: none;
                }
                
                #jose-send {
                    background: #ff6b00;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .typing-dots {
                    display: inline-flex;
                    gap: 4px;
                }
                
                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: #ff6b00;
                    border-radius: 50%;
                    animation: bounce 1.4s infinite ease-in-out;
                }
                
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            </style>
            
            <button id="jose-toggle">
                <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" alt="JOSE AI">
            </button>
            
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png" alt="Avatar">
                    <div>
                        <h3 style="margin:0; font-family:'Orbitron', sans-serif;">JOSE AI</h3>
                        <span style="font-size:0.75rem; opacity:0.8;">Diagnostic Specialist • ORION Tech</span>
                    </div>
                    <div style="flex:1"></div>
                    <button id="jose-close" style="background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <input type="text" id="jose-input" placeholder="Type a message...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Bind events
        document.getElementById('jose-toggle').onclick = () => this.toggle();
        document.getElementById('jose-close').onclick = () => this.toggle();
        document.getElementById('jose-send').onclick = () => this.sendMessage();
        document.getElementById('jose-input').onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };

        this.chatWindow = document.getElementById('jose-chat-window');
        this.messagesContainer = document.getElementById('jose-messages');
        this.inputField = document.getElementById('jose-input');
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.chatWindow.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) this.inputField.focus();
    }

    _addMessage(type, text) {
        const div = document.createElement('div');
        div.className = `jose-msg ${type}`;
        div.innerHTML = text;
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Speak system messages only if enabled/available
        if (type === 'system' && text.length < 200) {
            // this.speak(text.replace(/<[^>]*>/g, '')); // Optional voice
        }
    }

    async sendMessage() {
        const text = this.inputField.value.trim();
        if (!text) return;

        this.inputField.value = '';
        this._addMessage('user', text);
        this._showTyping();

        // Check for language switch command
        if (text.toLowerCase().includes('español') || text.toLowerCase().includes('spanish')) {
            this.language = 'es';
            this._hideTyping();
            this._addMessage('system', "¡Entendido! Cambiando protocolo a Español. 🔧 ¿Qué quieres saber sobre la automatización de tu taller?");
            // Trigger UI language change if function exists
            if (window.setLang) window.setLang('es');
            return;
        }

        try {
            // 1. Try Simple Keyword Analysis (Fallback/Fast mode)
            const fallbackResponse = this._getFallbackResponse(text);

            // 2. Simulate AI delay
            setTimeout(() => {
                this._hideTyping();
                this._addMessage('system', fallbackResponse);
            }, 1000);

        } catch (e) {
            console.error(e);
            this._hideTyping();
            this._addMessage('system', "Lo siento, tengo un fallo de encendido en mi procesador. ¿Puedes repetir eso? (System Error)");
        }
    }

    _showTyping() {
        if (this.isTyping) return;
        this.isTyping = true;
        const div = document.createElement('div');
        div.className = 'jose-msg system typing';
        div.id = 'jose-typing';
        div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    _hideTyping() {
        this.isTyping = false;
        const el = document.getElementById('jose-typing');
        if (el) el.remove();
    }

    // 🧠 JOSE'S BRAIN (Simulated Logic for Mechanic Sales Pitch)
    _getFallbackResponse(input) {
        const msg = input.toLowerCase();
        const isEsp = this.language === 'es';

        // 1. CLOSING THE SALE / ASKING PRICE
        if (msg.includes('price') || msg.includes('cost') || msg.includes('much') || msg.includes('precio') || msg.includes('cuanto') || msg.includes('cuesta')) {
            return isEsp
                ? "Mira, el **Paquete Auto Fleet Pro** cuesta $2,497/mes. Piénsalo así: es menos de lo que le pagas a un técnico junior, pero ORION trabaja 24/7, no se enferma y contesta cada llamada a la primera. Con solo capturar 5 llamadas perdidas de 'Check Engine' al mes, se paga solo. ¿Cuándo hacemos la inspección final (demo)?"
                : "The **Auto Fleet Pro Package** runs $2,497/month. Think of it this way: it's cheaper than a lube tech, but ORION works 24/7, never calls in sick, and answers every ring immediately. By catching just 5 missed 'Check Engine' calls a month, it pays for itself. Ready for the final inspection (demo)?";
        }

        // 2. EXPLAINING ROI / SAVINGS
        if (msg.includes('save') || msg.includes('roi') || msg.includes('ahorro') || msg.includes('benefit')) {
            return isEsp
                ? "Calculamos un retorno de **$9,800/mes** para un taller como LGB. Eliminamos el tiempo perdido en el teléfono agendando cambios de aceite y evitamos que las partes se pierdan en el inventario. Es como tener un turbo en tu flujo de caja."
                : "We calculate a **$9,800/month ROI** for a shop like LGB. We cut out the wasted phone time scheduling oil changes and stop parts from 'walking away' in inventory. It's like bolting a turbo onto your cash flow.";
        }

        // 3. EXPLAINING WHAT IT DOES (THE MECHANIC ANALOGY)
        if (msg.includes('what') || msg.includes('how') || msg.includes('que hace') || msg.includes('como funciona')) {
            return isEsp
                ? "Imagina que ORION es un **Service Writer que nunca duerme**. Contesta llamadas, da estatus de reparación ('Tu Toyota está listo'), agenda citas y sigue órdenes de partes. Todo automático. Tú te enfocas en reparar autos, nosotros en reparar tu flujo de trabajo."
                : "Think of ORION as a **Service Writer who never sleeps**. It answers calls, gives repair status updates ('Your Toyota is ready'), schedules appointments, and tracks parts orders. All automatic. You focus on fixing cars, we focus on fixing your workflow.";
        }

        // 4. HANDLING SKEPTICISM (THE "I'M GOOD" OBJECTION)
        if (msg.includes('no') || msg.includes('happy') || msg.includes('bien') || msg.includes('interesa')) {
            return isEsp
                ? "Entiendo. Muchos talleres piensan que están 'bien' hasta que ven cuántas llamadas pierden después de las 5PM. ¿Y si te muestro un reporte de diagnóstico gratis de tu tráfico web y llamadas perdidas? Sin compromiso, solo datos reales."
                : "I get it. A lot of shops think they're running 'fine' until they see how many calls drop after 5PM. How about I run a free diagnostic report on your web traffic and missed calls? No wrench turning required, just hard data.";
        }

        // DEFAULT / GENERIC
        return isEsp
            ? "Mi trabajo es optimizar tu taller, no venderte repuestos. ¿Quieres saber cómo ahorramos 2 horas diarias de trabajo administrativo o prefieres hablar de precios?"
            : "My job is to tune up your business, not sell you parts. Do you want to know how we shave 2 hours of admin work off your daily clock, or should we talk pricing?";
    }
}

// Global Init
window.initJose = function () {
    new JoseAssistant({});
};

// Start when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on LGB page, otherwise don't auto-load or load generically
    if (document.querySelector('title').innerText.includes('LGB') || document.querySelector('title').innerText.includes('NAPA')) {
        window.initJose();
    }
});
