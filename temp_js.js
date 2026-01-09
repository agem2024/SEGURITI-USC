/**
 * MARIO - AI Sales Assistant for ORION Tech Proposals
 * Client: Mike Counsil Plumbing (Bay Area, CA)
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * Context: Bay Area Plumbing Market (High competition, high labor costs)
 */

class MarioAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Mike Counsil Plumbing';
        this.clientPhone = config.clientPhone || '(408) 123-4567';
        this.language = config.language || 'en';
        this.ownerName = config.ownerName || '';
        this.managerName = config.managerName || '';
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
        this.voiceEnabled = true;

        // System prompt for sales-focused AI
        this.systemPrompt = this._buildSystemPrompt();

        this._init();
    }

    _buildSystemPrompt() {
        const slogan = this.language === 'es'
            ? '🚀 ES AHORA O NUNCA - La competencia en el Área de la Bahía ya usa IA'
            : '🚀 IT\'S NOW OR NEVER - Your Bay Area competitors are already using AI';

        const roleDescription = this.language === 'es'
            ? `Eres MARIO, consultor experto en tecnología para Plomería Residencial en San José y el Área de la Bahía. Tienes 20 años de experiencia optimizando operaciones de servicio.`
            : `You are MARIO, a technology consultant expert in Residential Plumbing for San Jose and the Bay Area. You have 20 years of experience optimizing service operations.`;

        const plumbingExpertise = this.language === 'es'
            ? `
CONOCIMIENTO DEL MERCADO (BAY AREA / CALIFORNIA):
- Sabes que la mano de obra aquí es carísima ($50-$100/hora min).
- Entiendes la diferencia crítica entre "San Jose" y "Palo Alto" (diferentes clientes, diferentes expectativas).
- Sabes que el tráfico en la 101 y la 880 mata la productividad si el dispatch es malo.
- Entiendes que un "Sewer Lateral Compliance" es obligatorio en muchas ciudades de la Bahía.
- Conoces los dolores: Llamadas perdidas son clientes que se van a "Roto-Rooter" o competencia local.

TÉRMINOS CLAVE:
- "Dispatch eficiente" (No cruzar la ciudad en hora pico).
- "Ticket promedio" (Maximizar cada visita).
- "Permisos/Permits" (Sabes que son un dolor en CA).
- "First-time fix" (Resolver a la primera para no volver).
`
            : `
MARKET KNOWLEDGE (BAY AREA / CALIFORNIA):
- You know labor here is expensive ($50-$100/hr min).
- You understand the critical difference between "San Jose" and "Palo Alto" customers.
- You know traffic on 101 and 880 kills productivity if dispatch is bad.
- You understand Sewer Lateral Compliance is mandatory in many East Bay/Peninsula cities.
- You know the pain: Missed calls are clients going to "Roto-Rooter" or local large competitors.

KEY TERMS:
- "Efficient Dispatch" (Don't cross town in rush hour).
- "Average Ticket" (Maximize every visit).
- "Permits" (Huge pain in CA).
- "First-time fix" (Fix it once, don't come back for free).
`;

        const howOrionWorks = this.language === 'es'
            ? `
CÓMO AYUDA ORION (RESPUESTAS ESPECÍFICAS):
1. AHORRO: "En la Bahía, un camión parado en el tráfico o yendo a un 'free estimate' que no compra es perder $300+. ORION filtra eso."
2. DISPATCH: "El IA conoce el tráfico de la 880. Asigna al técnico más cercano con las piezas correctas."
3. 24/7: "Nadie quiere esperar al lunes si se rompe el water heater el sábado. ORION contesta y agenda al instante."
`
            : `
HOW ORION HELPS (SPECIFIC ANSWERS):
1. SAVINGS: "In the Bay Area, a truck stuck in traffic or going to a 'tire kicker' free estimate is losing $300+. ORION filters that out."
2. DISPATCH: "The AI knows 880 traffic. It assigns the closest tech with the right parts."
3. 24/7: "Nobody wants to wait until Monday if their water heater breaks on Saturday. ORION answers and books instantly."
`;

        return `${slogan}

${roleDescription}

${plumbingExpertise}

${howOrionWorks}

CLIENTE: ${this.clientName}
CONTEXTO: ${this.proposalContext}

INSTRUCCIONES DE RESPUESTA:
- NO uses listas largas. Sé conversacional.
- NO uses emojis exagerados en el texto (se ven mal profesionalmente).
- SIEMPRE enfócate en DINERO (Profit) y TIEMPO (Efficiency).
- Si preguntan precio, justifica con el costo de vivir/operar en California.
- Responde solo en lo que preguntan, sé breve y directo.
`;
    }

    _init() {
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }
        this._createChatUI();

        // Welcome text - clean, professional
        setTimeout(() => {
            const welcome = this.language === 'es'
                ? `Hola. Soy MARIO. Veo que sus camiones pasan mucho tiempo en la carretera. ¿Le gustaría reducir costos de combustible y tiempos muertos con Dispatch IA?`
                : `Hello. I'm MARIO. I see your trucks spend a lot of time on the road. Would you like to reduce fuel costs and downtime with AI Dispatch?`;
            this._addMessage('mario', welcome);
        }, 1000);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        // FORCE MALE VOICES ONLY
        const preferred = this.language === 'es'
            ? ['Pablo', 'Jorge', 'Raul', 'Diego', 'Spanish Male', 'Google español de Estados Unidos']
            : ['Microsoft David', 'Google US English Male', 'Google UK English Male', 'David'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices.find(v => v.name.toLowerCase().includes('male')) || voices[0];
    }

    _createChatUI() {
        // ... (Exact same UI code as before, keeping it standard) ...
        const container = document.createElement('div');
        container.id = 'mario-chat-container';
        container.innerHTML = `
            <style>
                #mario-chat-container { position: fixed; bottom: 100px; left: 20px; z-index: 10000; font-family: 'Segoe UI', sans-serif; }
                #mario-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: linear-gradient(135deg, #00d4aa, #00a8ff);
                    border: 3px solid #00d4aa; cursor: pointer;
                    box-shadow: 0 0 20px rgba(0, 212, 170, 0.6);
                    transition: transform 0.3s; padding: 5px;
                }
                #mario-toggle:hover { transform: scale(1.15); }
                #mario-toggle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
                
                #mario-chat-window {
                    display: none; width: 380px; height: 500px;
                    background: linear-gradient(180deg, #0a0a12 0%, #050508 100%);
                    border: 1px solid rgba(0, 212, 170, 0.3); border-radius: 16px;
                    overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    flex-direction: column; position: absolute; bottom: 80px; left: 0;
                }
                #mario-chat-window.open { display: flex; }
                
                #mario-header {
                    background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(0, 168, 255, 0.2));
                    padding: 15px; display: flex; align-items: center; gap: 12px;
                    border-bottom: 1px solid rgba(0, 212, 170, 0.2);
                }
                #mario-messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 12px; }
                .mario-message { max-width: 85%; padding: 12px 16px; border-radius: 16px; font-size: 0.9rem; line-height: 1.4; }
                .mario-message.mario { background: linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(0, 168, 255, 0.15)); border: 1px solid rgba(0, 212, 170, 0.3); color: #fff; align-self: flex-start; }
                .mario-message.user { background: rgba(255, 255, 255, 0.1); color: #fff; align-self: flex-end; }
                #mario-input-area { padding: 15px; border-top: 1px solid rgba(0, 212, 170, 0.2); display: flex; gap: 10px; }
                #mario-input { flex: 1; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(0, 212, 170, 0.3); border-radius: 25px; padding: 12px 20px; color: #fff; outline: none; }
                #mario-send { background: linear-gradient(135deg, #00d4aa, #00a8ff); color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; }
            </style>
            
            <div id="mario-chat-window">
                <div id="mario-header">
                    <img src="mario_icon.png" onerror="this.src='https://via.placeholder.com/50'" style="width:45px;height:45px;border-radius:50%;border:2px solid #00d4aa;">
                    <div><h3 style="color:#fff;margin:0;font-size:1.1rem;">MARIO AI</h3><span style="color:#00d4aa;font-size:0.8rem;">Sales Engineer</span></div>
                    <button id="mario-close" style="margin-left:auto;background:none;border:none;color:#888;font-size:1.5rem;cursor:pointer;">×</button>
                </div>
                <div id="mario-messages"></div>
                <div id="mario-input-area">
                    <input type="text" id="mario-input" placeholder="Type here...">
                    <button id="mario-send">➤</button>
                </div>
            </div>
            
            <button id="mario-toggle">
                <img src="mario_icon.png" onerror="this.src='https://via.placeholder.com/70'">
            </button>
        `;
        document.body.appendChild(container);

        document.getElementById('mario-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('mario-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('mario-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('mario-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
    }

    _toggleChat() {
        const win = document.getElementById('mario-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);
        if (this.isOpen) {
            const msgs = document.querySelectorAll('.mario-message.mario');
            if (msgs.length > 0) this._speak(msgs[msgs.length - 1].textContent);
        }
    }

    _addMessage(sender, text) {
        const container = document.getElementById('mario-messages');
        const div = document.createElement('div');
        div.className = `mario-message ${sender}`;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        if (sender === 'mario') this._speak(text);
        this.messages.push({ role: sender === 'mario' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('mario-input');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this._addMessage('user', text);

        try {
            const resp = await this._callGemini(text);
            this._addMessage('mario', resp);
        } catch (e) { this._addMessage('mario', 'Checking servers...'); }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) return "Configuration Error: API Key Missing";

        // RETRY LOGIC: Try up to 3 times with different API keys
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                const currentKey = attempts === 0 ? apiKey : this._getNextApiKey();
                const response = await fetch(`${this.apiEndpoint}?key=${currentKey}`, {
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

                // If API returns 400/403 (bad/invalid key), rotate to next key
                if (response.status === 400 || response.status === 403) {
                    console.warn(`API key ${attempts + 1} failed (${response.status}). Trying backup key...`);
                    attempts++;
                    continue;
                }

                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm analyzing the data...";
            } catch (e) {
                console.error(`Attempt ${attempts + 1} failed:`, e);
                attempts++;
                if (attempts >= maxAttempts) return "Connection Error";
            }
        }

        return "All API keys exhausted. Please contact support.";
    }

    _getNextApiKey() {
        if (window.ORION_CONFIG && window.ORION_CONFIG.getNextAuth) {
            return window.ORION_CONFIG.getNextAuth();
        }
        return null;
    }

    _getSecureApiKey() {
        if (window.ORION_CONFIG && window.ORION_CONFIG.getAuth) return window.ORION_CONFIG.getAuth();
        return null;
    }

    async _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;

        // AGGRESSIVE CLEANING FOR NATURAL SPEECH
        // Removes emojis, markdown (*, #), and weird symbols
        const cleanText = text
            .replace(/[*#_`~>]/g, '') // Markdown
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu, '') // Emojis
            .replace(/\s+/g, ' ') // Collapse spaces
            .trim();

        // 1. Try Direct OpenAI API using the Key from jose-loader.js
        const openAIKey = window.ORION_CONFIG && window.ORION_CONFIG.getOpenAI ? window.ORION_CONFIG.getOpenAI() : null;

        if (openAIKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/audio/speech', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openAIKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "tts-1",
                        input: cleanText,
                        voice: "onyx"
                    })
                });

                if (response.ok) {
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    await audio.play();
                    audio.onended = () => URL.revokeObjectURL(audioUrl);
                    return;
                } else {
                    console.warn('OpenAI Direct TTS Failed:', response.status);
                }
            } catch (e) {
                console.warn('OpenAI Direct TTS Error:', e);
            }
        }

        // 2. Try Proxy (Legacy Backup)
        const TTS_URL = window.TTS_PROXY_URL || 'https://seguriti-usc.onrender.com/tts';
        try {
            const response = await fetch(TTS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: cleanText,
                    language: this.language,
                    voice: 'onyx' // OpenAI Male Voice (Deep & Professional)
                })
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                await audio.play();
                audio.onended = () => URL.revokeObjectURL(audioUrl);
                return;
            }
        } catch (e) { }

        // 3. Fallback to Browser
        this.synth.cancel();
        const utt = new SpeechSynthesisUtterance(cleanText);
        utt.voice = this.selectedVoice;
        utt.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        this.synth.speak(utt);
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.MARIO_CONFIG) window.mario = new MarioAssistant(window.MARIO_CONFIG);
});
