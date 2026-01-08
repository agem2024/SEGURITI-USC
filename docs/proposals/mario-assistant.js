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

    _createChatUI() {
        // Create Toggle Button
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'mario-toggle';
        toggleBtn.innerHTML = '<img src="mario_icon.png" alt="Mario AI" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: #2563EB;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: transform 0.3s;
            display: flex; /* Ensure image is centered if needed */
            align-items: center;
            justify-content: center;
            border: 2px solid white;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.transform = 'scale(1.1)';
        toggleBtn.onmouseout = () => toggleBtn.style.transform = 'scale(1)';
        toggleBtn.onclick = () => this._toggleChat();
        document.body.appendChild(toggleBtn);

        // Create Chat Window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'mario-chat';
        chatWindow.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 9999;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            font-family: 'Segoe UI', system-ui, sans-serif;
        `;

        // HEADER
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2563EB;
            color: white;
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: bold;
        `;
        header.innerHTML = `
            <div style="width: 35px; height: 35px; border-radius: 50%; background: white; overflow: hidden; border: 2px solid rgba(255,255,255,0.3);">
                <img src="mario_icon.png" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
                <div style="font-size: 1.1rem;">Mario AI</div>
                <div style="font-size: 0.8rem; opacity: 0.9;">Professional Consultant</div>
            </div>
            <div id="mario-close" style="margin-left: auto; cursor: pointer; font-size: 1.2rem;">×</div>
        `;
        header.querySelector('#mario-close').onclick = () => this._toggleChat();
        chatWindow.appendChild(header);

        // MESSAGES AREA
        const messagesArea = document.createElement('div');
        messagesArea.id = 'mario-messages';
        messagesArea.style.cssText = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        chatWindow.appendChild(messagesArea);

        // TYPING INDICATOR
        const typing = document.createElement('div');
        typing.id = 'mario-typing';
        typing.style.cssText = `
            padding: 10px 15px;
            font-size: 0.8rem;
            color: #64748b;
            font-style: italic;
            display: none;
        `;
        typing.textContent = 'Mario is analyzing...';
        chatWindow.appendChild(typing);

        // INPUT AREA
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            padding: 15px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 10px;
            background: white;
        `;
        inputArea.innerHTML = `
            <input type="text" id="mario-input" placeholder="Ask about ORION..." style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 20px; outline: none;">
            <button id="mario-send" style="background: #2563EB; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">➤</button>
        `;
        chatWindow.appendChild(inputArea);

        document.body.appendChild(chatWindow);

        // Event Listeners
        document.getElementById('mario-send').onclick = () => this.sendMessage();
        document.getElementById('mario-input').onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };
    }

    _toggleChat() {
        this.isOpen = !this.isOpen;
        const chat = document.getElementById('mario-chat');
        const btn = document.getElementById('mario-toggle');

        if (this.isOpen) {
            chat.style.display = 'flex';
            btn.style.display = 'none';
        } else {
            chat.style.display = 'none';
            btn.style.display = 'flex';
        }
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        const isMario = sender === 'mario';

        div.style.cssText = `
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 15px;
            font-size: 0.95rem;
            line-height: 1.4;
            align-self: ${isMario ? 'flex-start' : 'flex-end'};
            background: ${isMario ? 'white' : '#2563EB'};
            color: ${isMario ? '#1e293b' : 'white'};
            box-shadow: ${isMario ? '0 2px 5px rgba(0,0,0,0.05)' : 'none'};
            border-bottom-left-radius: ${isMario ? '2px' : '15px'};
            border-bottom-right-radius: ${isMario ? '15px' : '2px'};
        `;

        // Process links if any (simple markdown to link)
        const formatText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>');
        div.innerHTML = formatText;

        document.getElementById('mario-messages').appendChild(div);
        document.getElementById('mario-messages').scrollTop = document.getElementById('mario-messages').scrollHeight;

        if (isMario && this.voiceEnabled) {
            this._speak(text);
        }
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
            this.selectedVoice = voices.find(v => v.name.includes('David')) || // Microsoft David
                voices.find(v => v.name.includes('Mark')) ||  // Microsoft Mark
                voices.find(v => v.name.toLowerCase().includes('male')) ||     // Any Explicitly Male Voice
                voices.find(v => v.name.includes('Google US English'));        // Fallback to Google
        }

        if (!this.selectedVoice) this.selectedVoice = voices[0];
        console.log('Mario Voice Selected:', this.selectedVoice ? this.selectedVoice.name : 'None');
    }

    async _speak(text) {
        if (!this.voiceEnabled) return;

        const cleanText = text.replace(/[*#]/g, '').replace(/[\u{1F600}-\u{1F64F}]/gu, '');

        // Try OpenAI TTS first (better quality)
        try {
            const openaiKey = window.ORION_CONFIG?.getOpenAI?.();
            if (openaiKey) {
                const response = await fetch('https://api.openai.com/v1/audio/speech', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openaiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'tts-1',
                        voice: 'onyx', // Deep male voice
                        input: cleanText,
                        speed: 1.0
                    })
                });

                if (response.ok) {
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    audio.play();
                    audio.onended = () => URL.revokeObjectURL(audioUrl);
                    return; // Success, exit
                }
            }
        } catch (e) {
            console.log('OpenAI TTS unavailable, using Web Speech fallback');
        }

        // Fallback to Web Speech API
        if (this.synth.speaking) this.synth.cancel();
        if (!this.selectedVoice) this._loadVoices();

        const utter = new SpeechSynthesisUtterance(cleanText);
        if (this.selectedVoice) utter.voice = this.selectedVoice;
        utter.lang = this.language === 'es' ? 'es-MX' : 'en-US';
        utter.onerror = (e) => console.error('Speech Error:', e);
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
        // 1. Try generic window config
        if (window.ORION_CONFIG && window.ORION_CONFIG.getAuth) {
            return window.ORION_CONFIG.getAuth();
        }
        // 2. Try LocalStorage
        const storedKey = localStorage.getItem('mario_api_key') || localStorage.getItem('mike_api_key') || localStorage.getItem('jose_api_key');
        if (storedKey) return storedKey;

        // 3. Emergency Fallback
        return 'AIzaSyDNrPToe2abPx1Cf_dFz49OyWa1pVvZMp8';
    }

    async _callGemini(userMessage) {
        const maxRetries = 3; // Try all backup keys
        let lastError = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const apiKey = attempt === 0 ?
                    this._getSecureApiKey() :
                    window.ORION_CONFIG?.getNextAuth?.() || this._getSecureApiKey();

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
                    const errorData = await response.json();
                    throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
                }

                const data = await response.json();
                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!reply) throw new Error("No response from AI");

                // Success! Reset to primary key for next time
                if (attempt > 0) window.ORION_CONFIG?.resetAuth?.();

                return reply;

            } catch (error) {
                lastError = error;
                console.log(`API attempt ${attempt + 1} failed:`, error.message);

                // If this was the last attempt, throw the error
                if (attempt === maxRetries - 1) {
                    throw lastError;
                }

                // Otherwise, continue to next backup key
                await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay
            }
        }

        throw lastError || new Error("All API attempts failed");
    }
    setLanguage(lang) {
        this.language = lang;
        console.log('Mario Language switched to:', lang);

        // Update welcome message if chat hasn't started
        if (this.messages.length <= 1) { // Only system prompt + welcome
            const welcomeEn = "Hello! I'm Mario, your AI Operations Specialist. I observe that your dispatchers handle 50 calls a day manually. Would you like to see how we can automate that to zero hold times?";
            const welcomeEs = "¡Hola! Soy Mario, su Especialista de Operaciones IA. Veo que sus dispatchers manejan 50 llamadas diarias manualmente. ¿Le gustaría ver cómo podemos automatizar eso a cero tiempos de espera?";
            const msg = lang === 'es' ? welcomeEs : welcomeEn;

            // Clear messages and re-add welcome
            const msgContainer = document.getElementById('mario-messages');
            if (msgContainer) {
                msgContainer.innerHTML = '';
                this.messages = []; // Clear history to reset context language
                this._addMessage('mario', msg);
            }
        }
    }
}
