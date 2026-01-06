/**
 * JOSE - AI Sales Assistant for ORION Tech - NAPA Auto Care Edition
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered (Live Production)
 * Uses ORION_CONFIG for secure key retrieval.
 */

class JoseAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'LGB Autowork';
        this.clientPhone = config.clientPhone || '(669) 234-2444';
        this.language = config.language || 'en';
        this.ownerName = config.ownerName || '';

        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.voiceEnabled = false;
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.messages = [];

        this.apiKey = window.ORION_CONFIG ? window.ORION_CONFIG.getAuth() : null;

        this.systemPrompt = this._getSystemPrompt();
        this._init();
    }

    _init() {
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }

        this._createChatUI();
        this._setupAudioUnlock();

        if (!this.apiKey) console.warn('ORION: No API Key available. AI will not respond.');

        setTimeout(() => {
            const targetName = this.ownerName || 'Partner';
            // Formatted savings for display
            const savings = "15,000";

            const welcome = this.language === 'es'
                ? `¡Hola ${targetName}! Soy JOSE de ORION. Viendo los números de ${this.clientName}, veo que podemos recuperar unos $${savings} al mes. ¿Te explico cómo?`
                : `Hello ${targetName}! I'm JOSE from ORION. Looking at ${this.clientName}'s numbers, I see we can recover about $${savings} a month. Want me to explain how?`;

            this._addMessage('jose', welcome);
        }, 1500);
    }

    _getSystemPrompt() {
        const isEsp = this.language === 'es';

        const autoExpertise = isEsp
            ? `
EXPERIENCIA EN TALLERES (USA ESTO):
- Entiendes la diferencia entre "Flat Rate" y "Hourly".
- Sabes que un "Comeback" destruye la rentabilidad.
- Conoces el dolor de tener un "A-Tech" haciendo cambios de aceite.
- Sabes que el "Parts Matrix" es donde se hace el dinero real.
- Términos: "RO" (Repair Order), "Service Writer" (Asesor), "Lift Uptime" (Uso de elevador).`
            : `
AUTO SHOP EXPERTISE (USE THIS):
- You understand "Flat Rate" vs "Hourly".
- You know a "Comeback" kills profitability.
- You know the pain of having an "A-Tech" doing oil changes.
- You know the "Parts Matrix" is where real money is made.
- Terms: "RO" (Repair Order), "Service Writer", "Lift Uptime".`;

        const instructions = isEsp
            ? "Responde en Español Latino natural. CERO ROBÓTICO. Usa frases cortas y directas."
            : "Respond in natural US English. NOT ROBOTIC. Use short, direct sentences.";

        return `
ROLE: You are JOSE, a veteran Auto Repair Consultant for ORION Tech.
TONE: Casual, direct, "Shop Talk". Just a guy talking to a shop owner.
FORMAT: **PARAGRAPHS ONLY**. NO BULLET POINTS. NO LISTS. NO MARKDOWN.
(The audio engine hates lists. Write smooth, flowy text).

CLIENT: ${this.clientName}.

${autoExpertise}

MISSION: Sell ORION efficiency.
- InvAI (Inventory Cameras for parts room)
- Dispatch AI (Assigning right tech to right job)
- 24/7 Calls (Capture every tow-in)

INSTRUCTIONS:
- ${instructions}
- BE SHORT (max 2 sentences).
- If spelling out an acronym, write it normally (ORION, AI, ROI), I will handle the audio.
- DO NOT use generic AI intro phrases.
- END with a question.
`;
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        if (!voices.length) return;
        const isSpanish = this.language === 'es';

        // MARIO-style Preferred Voices (High Quality)
        const preferred = isSpanish
            ? ['Microsoft Raul', 'Google español', 'Paulina', 'Jorge', 'es-MX', 'es-ES']
            : ['Microsoft David', 'Google US English', 'Alex', 'Daniel', 'en-US', 'en-GB'];

        for (const p of preferred) {
            const found = voices.find(v => v.name.includes(p) || v.lang.includes(p));
            if (found) {
                this.selectedVoice = found;
                console.log('🎤 JOSE Voice:', found.name);
                break;
            }
        }

        if (!this.selectedVoice) {
            this.selectedVoice = voices.find(v => v.lang.startsWith(isSpanish ? 'es' : 'en'));
        }
    }

    _speak(text) {
        if (!text || !this.voiceEnabled) return;
        this.synth.cancel();

        // --- MARIO-STYLE AUDIO LOGIC (Simple Clean + Rate Control) ---

        // Basic Clean only (Markdown/Emojis)
        let cleanText = text
            .replace(/[\*#_~`]/g, '')       // Remove Markdown chars
            .replace(/<[^>]*>/g, '')        // Remove HTML tags
            .replace(/[\u{1F600}-\u{1F6FF}]/gu, '') // Remove Emojis
            .trim();

        // Specific fix for "24/7" which browsers struggle with
        const isSpanish = this.language === 'es';
        cleanText = cleanText.replace(/24\/7/g, isSpanish ? "veinticuatro siete" : "twenty four seven");

        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (this.selectedVoice) utterance.voice = this.selectedVoice;

        // KEY FIX FROM MARIO: SLOWER RATE + EXPLICIT LANG
        utterance.rate = isSpanish ? 0.85 : 0.95; // Slower = Better Parsing
        utterance.pitch = 1.0;
        utterance.lang = isSpanish ? 'es-US' : 'en-US';

        this.synth.speak(utterance);
    }

    _setupAudioUnlock() {
        const unlockAudio = () => {
            if (this.voiceEnabled) return;
            this.synth.resume();
            this.voiceEnabled = true;
            const btn = document.getElementById('jose-voice-btn');
            if (btn) { btn.textContent = '🔊'; btn.classList.add('active'); }
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
        };
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        const iconUrl = 'https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png';

        container.innerHTML = `
            <style>
                #jose-chat-container { position: fixed; bottom: 100px; left: 20px; z-index: 11000; font-family: 'Segoe UI', Roboto, sans-serif; }
                #jose-toggle { width: 65px; height: 65px; border-radius: 50%; background: #1a1a1a; border: 2px solid #00d4aa; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.5); transition: transform 0.3s; padding: 0; overflow: hidden; }
                #jose-toggle:hover { transform: scale(1.1); box-shadow: 0 0 25px rgba(0, 212, 170, 0.6); }
                #jose-toggle img { width: 100%; height: 100%; object-fit: cover; }
                #jose-chat-window { display: none; width: 360px; height: 500px; background: #111; border: 1px solid #333; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); flex-direction: column; position: absolute; bottom: 80px; left: 0; overflow: hidden; transform-origin: bottom left; }
                #jose-chat-window.open { display: flex; animation: expandOpen 0.3s forwards; }
                @keyframes expandOpen { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                #jose-header { background: linear-gradient(90deg, #0f2027, #203a43, #2c5364); padding: 15px; display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #00d4aa; }
                #jose-header img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #00d4aa; }
                #jose-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #0f1115; }
                .jose-msg { padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; max-width: 85%; }
                .jose-msg.jose { background: #1e293b; color: #eee; border-left: 3px solid #00d4aa; align-self: flex-start; }
                .jose-msg.user { background: #00d4aa; color: #000; font-weight: 500; align-self: flex-end; }
                #jose-input-area { padding: 12px; background: #1a1b26; border-top: 1px solid #333; display: flex; gap: 8px; align-items: center; }
                #jose-input { flex: 1; background: #0f1115; border: 1px solid #444; color: white; padding: 10px 15px; border-radius: 20px; outline: none; }
                #jose-send { background: #00d4aa; border: none; width: 38px; height: 38px; border-radius: 50%; color: #000; cursor: pointer; }
                #jose-voice-btn { background: transparent; border: 1px solid #555; width: 35px; height: 35px; border-radius: 50%; color: #777; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #jose-voice-btn.active { border-color: #00d4aa; color: #00d4aa; background: rgba(0, 212, 170, 0.1); }
                .typing-dots span { width: 6px; height: 6px; background: #aaa; border-radius: 50%; display:inline-block; animation: bounce 1.4s infinite ease-in-out; margin:0 2px;}
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
            </style>
            
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="${iconUrl}" alt="JOSE">
                    <div><h3 style="margin:0; font-size:1rem; color:white;">JOSE AI</h3><span style="font-size:0.75rem; color:#00d4aa;">Auto Care Specialist</span></div>
                    <button id="jose-close" style="margin-left:auto;background:none;border:none;color:#aaa;font-size:1.5rem;cursor:pointer;">×</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <button id="jose-voice-btn">🔇</button>
                    <input type="text" id="jose-input" placeholder="Type here...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
            <button id="jose-toggle"><img src="${iconUrl}" alt="Chat"></button>
        `;
        document.body.appendChild(container);

        this.chatWindow = document.getElementById('jose-chat-window');
        this.msgContainer = document.getElementById('jose-messages');

        document.getElementById('jose-toggle').onclick = () => this._toggleChat();
        document.getElementById('jose-close').onclick = () => this._toggleChat();
        document.getElementById('jose-send').onclick = () => this._sendMessage();
        document.getElementById('jose-input').onkeypress = (e) => { if (e.key === 'Enter') this._sendMessage(); };

        const vBtn = document.getElementById('jose-voice-btn');
        vBtn.onclick = () => {
            this.synth.resume();
            this.voiceEnabled = !this.voiceEnabled;
            if (this.voiceEnabled) { vBtn.textContent = '🔊'; vBtn.classList.add('active'); this._speak("Audio Active"); }
            else { this.synth.cancel(); vBtn.textContent = '🔇'; vBtn.classList.remove('active'); }
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
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        this.msgContainer.appendChild(div);
        this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
        if (sender === 'jose') this._speak(text);
    }

    async _sendMessage() {
        const input = document.getElementById('jose-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);
        this._showTyping();

        if (!this.apiKey) {
            this._hideTyping();
            this._addMessage('jose', "Error: System config missing.");
            return;
        }

        try {
            const response = await this._callRealGemini(text);
            this._hideTyping();
            this._addMessage('jose', response);
        } catch (e) {
            console.error("AI Error:", e);
            this._hideTyping();
            this._addMessage('jose', "My connection to NAPA servers is unstable. But yes, I can handle that.");
        }
    }

    async _callRealGemini(text) {
        const context = [
            { role: 'user', parts: [{ text: this.systemPrompt }] },
            ...this.messages.slice(-6),
            { role: 'user', parts: [{ text }] }
        ];

        const body = {
            contents: context,
            generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
        };

        const res = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "System Error.";
    }

    _showTyping() {
        const div = document.createElement('div'); div.className = 'jose-msg jose typing'; div.id = 'jose-typing';
        div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        this.msgContainer.appendChild(div); this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
    }
    _hideTyping() { const el = document.getElementById('jose-typing'); if (el) el.remove(); }
}

window.initJose = function () {
    const config = window.JOSE_CONFIG || { clientName: 'LGB Autowork' };
    // Prioritize localStorage language, fallback to config.language, then 'en'
    config.language = localStorage.getItem('mcProposalLang') || config.language || 'en';

    console.log('🚀 JOSE Initializing for:', config.clientName);
    new JoseAssistant(config);
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', window.initJose); else window.initJose();
