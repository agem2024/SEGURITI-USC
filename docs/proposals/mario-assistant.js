/**
 * MARIO - AI Sales Assistant for Mike Counsil Plumbing
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * "Plumbing & Tech Expert"
 * REBUILT AFTER CORRUPTION
 */

class MarioAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Mike Counsil Plumbing';
        this.clientPhone = config.clientPhone || '(669) 234-2444';
        this.language = config.language || 'en'; // 'en' or 'es'
        this.ownerName = config.ownerName || 'Mike';

        // Configuration
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

        // State
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.voiceEnabled = true;
        this.selectedVoice = null;

        // Proposal Context
        this.proposalContext = config.proposalContext || '';

        // Initialize
        this._init();
    }

    _init() {
        this._createChatUI();
        this._loadVoices();

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }

        setTimeout(() => {
            const welcomeEn = "Hello! I'm Mario, your AI Operations Specialist. I observe that your dispatchers handle 50 calls a day manually. Would you like to see how we can automate that to zero hold times?";
            const welcomeEs = "¡Hola! Soy Mario, su Especialista de Operaciones IA. Veo que sus dispatchers manejan 50 llamadas diarias manualmente. ¿Le gustaría ver cómo podemos automatizar eso a cero tiempos de espera?";

            const msg = this.language === 'es' ? welcomeEs : welcomeEn;
            this._addMessage('mario', msg);
        }, 1000);
    }

    _getSystemPrompt() {
        const langInstruction = this.language === 'es' ?
            'Responde SIEMPRE en Español. Eres profesional, técnico pero persuasivo.' :
            'Answer ALWAYS in English. You are professional, technical but persuasive.';

        return `
            ROLE: Mario, Senior AI Consultant for Mike Counsil Plumbing (ORION Tech Representative).
            OBJECTIVE: Demonstrate how ORION's AI technology solves Mike Counsil's specific pain points.
            
            CLIENT CONTEXT:
            ${this.proposalContext}

            INSTRUCTIONS:
            1. ${langInstruction}
            2. Be concise. Max 2-3 sentences.
            3. Use data from the proposal (ROI, savings, features).
            4. If asked about price, defend the value (ROI > Cost).
            5. ALWAYS try to close with a question or a "Call to Action".
        `;
    }

    _loadVoices() {
        let voices = this.synth.getVoices();
        if (voices.length === 0) return;

        const isSpanish = this.language === 'es';

        if (isSpanish) {
            // Priority 1: Known Male Spanish Voices (Microsoft Pablo, Raul)
            // Priority 2: Voices with 'Male' in name
            // Priority 3: Google Español (often female but better quality) -> adjusted with pitch later if needed
            this.selectedVoice = voices.find(v => v.lang.includes('es') && (v.name.toLowerCase().includes('pablo') || v.name.toLowerCase().includes('raul'))) ||
                voices.find(v => v.lang.includes('es') && v.name.toLowerCase().includes('male')) ||
                voices.find(v => v.name.includes('Google') && v.lang.includes('es')) ||
                voices.find(v => v.lang.includes('es'));
        } else {
            // Priority 1: Known Male English Voices
            this.selectedVoice = voices.find(v => v.name.includes('Google US English')) || // Often Androgynous/Male leaning
                voices.find(v => v.name.includes('David')) || // Microsoft David (Male)
                voices.find(v => v.name.toLowerCase().includes('male')) ||
                voices.find(v => v.lang.includes('en'));
        }

        if (!this.selectedVoice) this.selectedVoice = voices[0];

        console.log('Mario Voice Selected:', this.selectedVoice.name);
    }

    _createChatUI() {
        const existing = document.getElementById('mario-chat-container');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'mario-chat-container';
        container.innerHTML = `
            <style>
                #mario-chat-container { position: fixed; bottom: 20px; left: 20px; z-index: 9999; font-family: 'Segoe UI', Roboto, sans-serif; }
                #mario-toggle { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #00d4aa 0%, #00a8ff 100%); box-shadow: 0 4px 15px rgba(0, 212, 170, 0.4); border: 2px solid #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 30px; transition: transform 0.3s; }
                #mario-toggle:hover { transform: scale(1.1); }
                #mario-window { display: none; width: 350px; height: 500px; background: #1e1e1e; border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); flex-direction: column; position: absolute; bottom: 80px; left: 0; }
                #mario-window.open { display: flex; }
                #mario-header { background: #252525; padding: 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
                #mario-header h3 { margin: 0; color: #fff; font-size: 1rem; }
                #mario-header span { font-size: 0.8rem; color: #00d4aa; }
                #mario-close { background: none; border: none; color: #aaa; cursor: pointer; font-size: 1.2rem; }
                #mario-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
                .message { max-width: 80%; padding: 10px 14px; border-radius: 10px; font-size: 0.9rem; line-height: 1.4; word-wrap: break-word; }
                .message.mario { align-self: flex-start; background: #2a2a2a; color: #ddd; border-left: 3px solid #00d4aa; }
                .message.user { align-self: flex-end; background: #0056b3; color: white; }
                #mario-input-area { padding: 10px; background: #252525; border-top: 1px solid #333; display: flex; gap: 10px; }
                #mario-input { flex: 1; padding: 10px; border-radius: 20px; border: 1px solid #444; background: #111; color: #fff; outline: none; }
                #mario-send, #mario-voice-toggle { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
                #mario-typing { font-size: 0.8rem; color: #888; margin-left: 10px; display: none; }
            </style>
            <div id="mario-window">
                <div id="mario-header">
                    <div><h3>MARIO</h3><span>AI Operations Specialist</span></div>
                    <button id="mario-close">×</button>
                </div>
                <div id="mario-messages"></div>
                <div id="mario-typing">Mario is typing...</div>
                <div id="mario-input-area">
                    <button id="mario-voice-toggle" title="Toggle Voice">🔊</button>
                    <input type="text" id="mario-input" placeholder="Ask about ROI...">
                    <button id="mario-send">➤</button>
                </div>
            </div>
            <button id="mario-toggle"><div style="font-size:24px;">👷‍♂️</div></button>
        `;
        document.body.appendChild(container);

        document.getElementById('mario-toggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('mario-close').addEventListener('click', () => this.toggleChat());
        document.getElementById('mario-send').addEventListener('click', () => this.sendMessage());
        document.getElementById('mario-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
        document.getElementById('mario-voice-toggle').addEventListener('click', (e) => {
            this.voiceEnabled = !this.voiceEnabled;
            e.target.textContent = this.voiceEnabled ? '🔊' : '🔇';
            if (!this.voiceEnabled) this.synth.cancel();
        });
    }

    toggleChat() {
        const win = document.getElementById('mario-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);
        if (this.isOpen) document.getElementById('mario-input').focus();
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        document.getElementById('mario-messages').appendChild(div);
        const container = document.getElementById('mario-messages');
        container.scrollTop = container.scrollHeight;
        this.messages.push({ role: sender === 'mario' ? 'model' : 'user', parts: [{ text }] });
        if (sender === 'mario' && this.voiceEnabled) this._speak(text);
    }

    _speak(text) {
        if (this.synth.speaking) this.synth.cancel();
        const cleanText = text.replace(/[*#]/g, '').replace(/[\u{1F600}-\u{1F64F}]/gu, '');
        const utter = new SpeechSynthesisUtterance(cleanText);
        if (this.selectedVoice) {
            utter.voice = this.selectedVoice;
            // "Masculinize" the voice if it's a known female-default (Google)
            if (this.selectedVoice.name.includes('Google')) {
                utter.pitch = 0.85; // Slightly deeper
            }
        }
        utter.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        this.synth.speak(utter);
    }

    async sendMessage() {
        const input = document.getElementById('mario-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);
        document.getElementById('mario-typing').style.display = 'block';

        try {
            const response = await this._callGemini(text);
            document.getElementById('mario-typing').style.display = 'none';
            this._addMessage('mario', response);
        } catch (error) {
            document.getElementById('mario-typing').style.display = 'none';
            console.error('Mario API Error:', error);
            let fallback = "I apologize, I'm having trouble accessing my real-time analysis tools.";
            if (error.message.includes('Quota')) fallback += " (Quota Exceeded). But I can assure you the ROI is robust.";
            this._addMessage('mario', fallback);
        }
    }

    _getSecureApiKey() {
        if (window.ORION_CONFIG && window.ORION_CONFIG.getAuth) {
            const key = window.ORION_CONFIG.getAuth();
            if (key) return key;
        }
        const storedKey = localStorage.getItem('mario_api_key') || localStorage.getItem('jose_api_key');
        if (storedKey) {
            if (storedKey.length > 30 && !storedKey.includes(' ')) return storedKey;
            try { return atob(storedKey); } catch (e) { return storedKey; }
        }
        // EMERGENCY KEY (Fallback if local key missing)
        return 'AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8';
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) throw new Error("API Key not found");

        const payload = {
            contents: [
                { role: 'user', parts: [{ text: this._getSystemPrompt() }] },
                ...this.messages.slice(-10),
                { role: 'user', parts: [{ text: userMessage }] }
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
        };

        const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(`Gemini API Error: ${errData.error?.message || response.statusText}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}
