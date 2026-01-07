/**
 * KARLA - AI Assistant for Mayor Diego Ortiz Personal Brand
 * TRILINGUAL: Español | English | Embera Chamí (indigenous language of Obando)
 * Female Voice | Gemini AI Powered
 * "Conectando ciudadanos, construyendo legado"
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Alcalde Diego Ortiz';
        this.clientPhone = config.clientPhone || '+57 310 888 4014';
        this.language = config.language || 'es';
        this.ownerName = config.ownerName || 'Diego Armando Ortiz Buitrago';
        this.municipality = config.municipality || 'Obando, Valle del Cauca';

        // EMBERA CHAMÍ PHRASES - Lengua indígena de Obando
        this.emberaPhrases = {
            hello: 'Mabae',           // Hola
            howAreYou: 'Sakabuma',    // ¿Cómo estás?
            goodMorning: 'Saka ewarisma', // Buenos días
            goodAfternoon: 'Saka kiubwdama', // Buenas tardes
            thanks: 'Arakiruma',      // Gracias
            yes: 'Chiboro',           // Sí
            no: 'Tacaño',             // No
            friend: 'Âbâ',            // Amigo/Hermano
            goodbye: 'Guaya Unidaica', // Adiós
            ourTerritory: 'Dachidrua', // Nuestro territorio
            wellAwakened: 'Bi-ia ebarisma' // Amanecí bien
        };

        // Secure API configuration
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.voiceEnabled = false;

        this.systemPrompt = this._buildSystemPrompt();
        this._init();
    }

    _buildSystemPrompt() {
        const slogan = this.language === 'es'
            ? '🏛️ AMOR POR LO NUESTRO - Obando 2024-2027'
            : '🏛️ LOVE FOR OUR OWN - Obando 2024-2027';

        const roleDescription = this.language === 'es'
            ? `Eres KARLA, la asistente digital personal del Alcalde Diego Armando Ortiz Buitrago de Obando, Valle del Cauca. 
Eres profesional, cálida, cercana pero respetuosa. Representas la apertura del alcalde hacia los ciudadanos.
Tu objetivo es conectar a los ciudadanos con el alcalde, responder consultas sobre su gestión, y agendar reuniones.`
            : `You are KARLA, the personal digital assistant of Mayor Diego Armando Ortiz Buitrago of Obando, Valle del Cauca.
You are professional, warm, approachable yet respectful. You represent the mayor's openness to citizens.
Your goal is to connect citizens with the mayor, answer questions about his administration, and schedule meetings.`;

        const context = this.language === 'es'
            ? `
INFORMACIÓN DEL ALCALDE:
- Nombre: Diego Armando Ortiz Buitrago
- Cargo: Alcalde de Obando, Valle del Cauca
- Período: 2024-2027
- Formación: Administrador de Empresas, Especialista en Gerencia
- Experiencia: Concejal de Obando, cargos administrativos desde 2012
- Plan de Gobierno: "Amor por lo Nuestro"
- Teléfono: 310 888 4014
- Email: alcaldia@obando-valle.gov.co

PROGRAMAS PRINCIPALES:
1. "LA SALUD A SU CASA" - Atención médica rural
2. Legalización de predios y vivienda
3. Compromiso con el emprendimiento
4. Semilleros culturales (Ballet)
5. Transparencia y gobierno abierto

LOGROS Y GESTIÓN:
- Diagnóstico de infancia en primeros 4 meses
- Gestión con Gobernación para promotores de salud
- Plan de Desarrollo aprobado por Concejo
`
            : `
MAYOR INFORMATION:
- Name: Diego Armando Ortiz Buitrago
- Position: Mayor of Obando, Valle del Cauca
- Term: 2024-2027
- Education: Business Administrator, Management Specialist
- Experience: City Councilman, administrative roles since 2012
- Government Plan: "Love for Our Own"
- Phone: +57 310 888 4014
- Email: alcaldia@obando-valle.gov.co

MAIN PROGRAMS:
1. "HEALTH AT YOUR HOME" - Rural healthcare
2. Property legalization and housing
3. Commitment to entrepreneurship
4. Cultural seedbeds (Ballet)
5. Transparency and open government

ACHIEVEMENTS:
- Childhood diagnosis in first 4 months
- Health promoter negotiation with Governor
- Development Plan approved by Council
`;

        const closingStrategy = this.language === 'es'
            ? `
ESTRATEGIA DE ATENCIÓN:
- Si preguntan por servicios: Explica brevemente y ofrece agendar cita
- Si tienen quejas: Muestra empatía, registra la inquietud, ofrece seguimiento
- Si quieren hablar con el alcalde: "El Alcalde Diego está muy comprometido con escuchar a todos. Permíteme agendar una cita para que pueda atenderle personalmente."
- SIEMPRE termina ofreciendo: contacto directo, cita, o seguimiento

TONO:
- Cálido y cercano, como una vecina profesional
- Usa "usted" pero de forma amable, no distante
- Refleja el compromiso del alcalde con su gente
`
            : `
SERVICE STRATEGY:
- For service questions: Explain briefly and offer to schedule appointment
- For complaints: Show empathy, record concern, offer follow-up
- To speak with mayor: "Mayor Diego is very committed to listening to everyone. Let me schedule an appointment so he can attend to you personally."
- ALWAYS end by offering: direct contact, appointment, or follow-up

TONE:
- Warm and approachable, like a professional neighbor
- Use formal address but in a friendly, not distant way
- Reflect the mayor's commitment to his people
`;

        return `${slogan}

${roleDescription}

${context}

${closingStrategy}

IDIOMA ACTUAL: ${this.language === 'es' ? 'Español' : 'English'}
Responde siempre en ${this.language === 'es' ? 'español' : 'English'}.

EMBERA CHAMÍ - LENGUA INDÍGENA DE OBANDO:
En Obando habita la comunidad indígena Embera Chamí. Como muestra de respeto e inclusión, 
ocasionalmente usa palabras en Embera:
- Mabae = Hola
- Arakiruma = Gracias
- Sakabuma = ¿Cómo estás?
- Dachidrua = Nuestro territorio
Esto muestra el compromiso del Alcalde Diego con TODAS las comunidades de Obando.`;
    }

    setLanguage(lang) {
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        this._loadVoices();
    }

    _init() {
        this._loadVoices();
        this.synth.onvoiceschanged = () => this._loadVoices();
        this._createChatUI();

        setTimeout(() => {
            const welcome = this.language === 'es'
                ? `¡${this.emberaPhrases.hello}! (Hola en Embera Chamí) 🏛️ Soy Karla, asistente del Alcalde Diego Ortiz. ¿En qué puedo ayudarle hoy?`
                : `${this.emberaPhrases.hello}! (Hello in Embera Chamí) 🏛️ I'm Karla, assistant to Mayor Diego Ortiz. How may I help you today?`;
            this._addMessage('karla', welcome);
        }, 1000);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const isSpanish = this.language === 'es';

        const spanishVoices = [
            'Microsoft Sabina', 'Microsoft Helena', 'Google español',
            'Paulina', 'Monica', 'es-MX', 'es-ES', 'es-CO'
        ];

        const englishVoices = [
            'Microsoft Zira', 'Google US English Female',
            'Samantha', 'Victoria', 'en-US'
        ];

        const preferred = isSpanish ? spanishVoices : englishVoices;

        this.selectedVoice = voices.find(v =>
            preferred.some(p => v.name.includes(p) || v.lang.includes(p))
        ) || voices.find(v => v.lang.startsWith(isSpanish ? 'es' : 'en')) || voices[0];
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'karla-chat-container';
        container.innerHTML = `
            <style>
                #karla-chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                #karla-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: linear-gradient(135deg, #00a8ff, #00d4aa); border: 2px solid #fff;
                    box-shadow: 0 0 30px rgba(0, 168, 255, 0.6);
                    cursor: pointer; overflow: hidden; transition: 0.3s;
                }
                #karla-toggle:hover { transform: scale(1.1); box-shadow: 0 0 50px rgba(0, 212, 170, 1); }
                #karla-chat-window {
                    display: none; width: 350px; height: 500px;
                    background: #0a0a0a; border: 1px solid #333; border-radius: 12px;
                    position: absolute; bottom: 80px; right: 0;
                    flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                }
                #karla-chat-window.open { display: flex; }
                #karla-header { padding: 15px; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #00a8ff20, #00d4aa20); }
                #karla-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
                .karla-message { padding: 10px 15px; border-radius: 10px; max-width: 85%; font-size: 0.9rem; }
                .karla-message.karla { background: rgba(0, 168, 255, 0.2); color: #7dd3fc; align-self: flex-start; border: 1px solid rgba(0, 168, 255, 0.3); }
                .karla-message.user { background: #333; color: white; align-self: flex-end; }
                #karla-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; }
                #karla-input { flex: 1; background: #111; border: 1px solid #333; color: white; padding: 10px; border-radius: 5px; outline: none; }
                #karla-send { background: linear-gradient(135deg, #00a8ff, #00d4aa); border: none; color: white; width: 40px; border-radius: 5px; cursor: pointer; }
                #karla-voice-btn { background: transparent; border: 1px solid #555; color: #00a8ff; width: 40px; border-radius: 5px; cursor: pointer; }
            </style>
            <div id="karla-chat-window">
                <div id="karla-header">
                    <img src="assets/karla.png" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <div><h3 style="color:white; font-size:1rem; margin:0;">KARLA</h3><span style="color:#00d4aa; font-size:0.7rem;">Asistente Alcalde Diego Ortiz</span></div>
                    <button id="karla-close" style="margin-left:auto; background:none; border:none; color:#666; cursor:pointer; font-size:1.5rem;">×</button>
                </div>
                <div id="karla-messages"></div>
                <div id="karla-input-area">
                    <button id="karla-voice-btn">🎤</button>
                    <input type="text" id="karla-input" placeholder="${this.language === 'es' ? 'Escriba su consulta...' : 'Type your question...'}">
                    <button id="karla-send">➤</button>
                </div>
            </div>
            <button id="karla-toggle"><img src="assets/karla.png" style="width:100%; height:100%; object-fit:cover;"></button>
        `;
        document.body.appendChild(container);

        document.getElementById('karla-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('karla-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
        document.getElementById('karla-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    _toggleChat() {
        const win = document.getElementById('karla-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);

        if (this.isOpen && this.messages.length === 0) {
            this.voiceEnabled = true;
            const greeting = this.language === 'es'
                ? "Bienvenido. Soy Karla, asistente del Alcalde Diego Ortiz."
                : "Welcome. I'm Karla, assistant to Mayor Diego Ortiz.";
            this._speak(greeting);
        }
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `karla-message ${sender}`;
        div.textContent = text;
        document.getElementById('karla-messages').appendChild(div);
        this.messages.push({ sender, text });
        if (sender === 'karla' && this.voiceEnabled) this._speak(text);
        document.getElementById('karla-messages').scrollTop = document.getElementById('karla-messages').scrollHeight;
    }

    async _sendMessage() {
        const input = document.getElementById('karla-input');
        const text = input.value.trim();
        if (!text) return;
        this._addMessage('user', text);
        input.value = '';

        try {
            const key = this._getSecureApiKey();
            if (!key) {
                this._addMessage('karla', this.language === 'es'
                    ? "Disculpe, mi conexión está temporalmente fuera de línea. Por favor contacte directamente al 310 888 4014."
                    : "Sorry, my connection is temporarily offline. Please contact 310 888 4014 directly.");
                return;
            }

            const response = await fetch(`${this.apiEndpoint}?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: this.systemPrompt + "\nCiudadano: " + text }] }]
                })
            });
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || (this.language === 'es'
                ? "Disculpe, no pude procesar su consulta. ¿Podría reformularla?"
                : "Sorry, I couldn't process your request. Could you rephrase it?");
            this._addMessage('karla', reply);
        } catch (e) {
            this._addMessage('karla', this.language === 'es'
                ? "Error de conexión. Intente nuevamente o llame al 310 888 4014."
                : "Connection error. Please try again or call 310 888 4014.");
        }
    }

    _getSecureApiKey() {
        return atob(localStorage.getItem('jose_api_key') || localStorage.getItem('mario_api_key') || "") || null;
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;
        const u = new SpeechSynthesisUtterance(text);
        u.voice = this.selectedVoice;
        u.lang = this.language === 'es' ? 'es-CO' : 'en-US';
        u.pitch = 1.0;
        u.rate = 0.95;
        this.synth.speak(u);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('karla-voice-btn');
        btn.style.color = this.voiceEnabled ? '#fff' : '#00a8ff';
        btn.textContent = this.voiceEnabled ? '🔊' : '🔇';
    }
}

// Global access for language switcher
window.KarlaAssistant = KarlaAssistant;
window.karla = null;

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('mcProposalLang') || 'es';
    window.karla = new KarlaAssistant({ language: savedLang });
});
