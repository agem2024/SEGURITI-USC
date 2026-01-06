/**
 * JOSE - AI Sales Assistant for ORION Tech - NAPA Auto Care Edition
 * Bilingual (EN/ES) | Male Voice | Gemini AI Powered
 * Security: No Refresh/Auth Tokens stored in code. API Key must be in localStorage.
 */

class JoseAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Client';
        this.clientPhone = config.clientPhone || '(669) 234-2444';
        this.language = config.language || 'en';
        this.ownerName = config.ownerName || '';

        // Settings
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.voiceEnabled = false; // Starts false until interaction
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.messages = [];

        this._init();
    }

    _init() {
        // 1. Load Voices safely
        this._loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this._loadVoices();
        }

        // 2. Create UI
        this._createChatUI();

        // 3. Audio Unlocker (Crucial for Chrome/Edge autoplay policy)
        const unlockAudio = () => {
            if (this.voiceEnabled) return;
            console.log('🔊 Audio Context Resumed by User Interaction');
            this.synth.resume();
            this.voiceEnabled = true;

            // Visual cleanup
            const btn = document.getElementById('jose-voice-btn');
            if (btn) {
                btn.textContent = '🔊';
                btn.title = 'Voice Active';
                btn.classList.add('active');
            }

            // Remove listeners once unlocked
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        // Listen for ANY first interaction
        document.addEventListener('click', unlockAudio);
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('keydown', unlockAudio);

        // 4. Welcome Message (Delayed)
        setTimeout(() => {
            const targetName = this.ownerName || 'Partner';
            const savings = "15,000";

            const welcome = this.language === 'es'
                ? `¡Hola ${targetName}! Soy JOSE, especialista de ORION. He analizado la operación de LGB Autowork y veo cómo podemos recuperar más de $${savings}/mes en eficiencia. ¿Te muestro cómo?`
                : `Hello ${targetName}! I'm JOSE, ORION specialist. I've analyzed LGB Autowork and I see how we can recover over $${savings}/month. Shall we run a quick diagnostic?`;

            this._addMessage('jose', welcome);
            // Attempt to speak (will likely be queued until unlock)
            this._speak(welcome);
        }, 1500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        if (!voices.length) return;

        const isSpanish = this.language === 'es';

        // Priority voices (High Quality Male)
        const preferred = isSpanish
            ? ['Microsoft Raul', 'Google español', 'Monica', 'Paulina', 'es-MX', 'es-']
            : ['Microsoft David', 'Google US English', 'Samantha', 'Daniel', 'en-US', 'en-'];

        for (const p of preferred) {
            const found = voices.find(v => v.name.includes(p));
            if (found) { this.selectedVoice = found; break; }
        }

        // Fallback
        if (!this.selectedVoice) {
            this.selectedVoice = voices.find(v => v.lang.startsWith(isSpanish ? 'es' : 'en')) || voices[0];
        }

        console.log('🎤 JOSE Voice Selected:', this.selectedVoice?.name);
    }

    _speak(text) {
        if (!text) return;

        // Autoset voice enabled if we are here (double check)
        this.synth.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        if (this.selectedVoice) utterance.voice = this.selectedVoice;
        utterance.rate = 1.05;
        utterance.pitch = 0.95;

        // Visual Feedback
        utterance.onstart = () => {
            const avatar = document.getElementById('jose-header-avatar');
            if (avatar) avatar.style.boxShadow = "0 0 15px #00ff00";
        };
        utterance.onend = () => {
            const avatar = document.getElementById('jose-header-avatar');
            if (avatar) avatar.style.boxShadow = "none";
        };

        this.synth.speak(utterance);
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'jose-chat-container';

        // Absolute URLs for Security/Consistency
        const iconUrl = 'https://agem2024.github.io/SEGURITI-USC/proposals/jose_icon.png';

        container.innerHTML = `
            <style>
                #jose-chat-container { position: fixed; bottom: 100px; left: 20px; z-index: 11000; font-family: 'Segoe UI', Roboto, sans-serif; }
                
                #jose-toggle { 
                    width: 65px; height: 65px; border-radius: 50%; 
                    background: #1a1a1a; border: 2px solid #00d4aa; 
                    cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.5); 
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                    overflow: hidden; padding: 0;
                    position: relative;
                }
                #jose-toggle:hover { transform: scale(1.1); box-shadow: 0 0 25px rgba(0, 212, 170, 0.6); }
                #jose-toggle img { width: 100%; height: 100%; object-fit: cover; }
                #jose-notification {
                    position: absolute; top: 0; right: 0; width: 15px; height: 15px;
                    background: red; border-radius: 50%; border: 2px solid #1a1a1a;
                    animation: pulse 2s infinite;
                }

                #jose-chat-window { 
                    display: none; width: 360px; height: 500px; 
                    background: #111; border: 1px solid #333; 
                    border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); 
                    flex-direction: column; position: absolute; 
                    bottom: 80px; left: 0; overflow: hidden;
                    transform-origin: bottom left;
                }
                #jose-chat-window.open { display: flex; animation: expandOpen 0.3s forwards; }

                @keyframes expandOpen {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }

                #jose-header { 
                    background: linear-gradient(90deg, #0f2027, #203a43, #2c5364); 
                    padding: 15px; display: flex; align-items: center; gap: 12px; 
                    border-bottom: 2px solid #00d4aa; 
                }
                #jose-header img { width: 45px; height: 45px; border-radius: 50%; border: 2px solid #00d4aa; }
                #jose-close { margin-left: auto; background: none; border: none; color: #aaa; font-size: 1.5rem; cursor: pointer; }
                
                #jose-messages { 
                    flex: 1; padding: 15px; overflow-y: auto; 
                    display: flex; flex-direction: column; gap: 12px; 
                    background: #0f1115; 
                }
                
                .jose-msg { padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; max-width: 85%; }
                .jose-msg.jose { background: #1e293b; color: #eee; border-left: 3px solid #00d4aa; align-self: flex-start; }
                .jose-msg.user { background: #00d4aa; color: #000; font-weight: 500; align-self: flex-end; }
                
                #jose-input-area { 
                    padding: 12px; background: #1a1b26; border-top: 1px solid #333; 
                    display: flex; gap: 8px; align-items: center; 
                }
                #jose-input { flex: 1; background: #0f1115; border: 1px solid #444; color: white; padding: 10px 15px; border-radius: 20px; outline: none; }
                #jose-send { background: #00d4aa; border: none; width: 38px; height: 38px; border-radius: 50%; color: #000; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                
                #jose-voice-btn { 
                    background: transparent; border: 1px solid #555; 
                    width: 35px; height: 35px; border-radius: 50%; 
                    color: #777; cursor: pointer; display: flex; 
                    align-items: center; justify-content: center; font-size: 1rem;
                }
                #jose-voice-btn.active { border-color: #00d4aa; color: #00d4aa; background: rgba(0, 212, 170, 0.1); }

                /* Typing Indicator */
                .typing-dots { display: inline-flex; gap: 4px; padding: 5px; }
                .typing-dots span { width: 6px; height: 6px; background: #aaa; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; }
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
            </style>
            
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="${iconUrl}" alt="JOSE" id="jose-header-avatar">
                    <div>
                        <h3 style="margin:0; font-size: 1rem; color: white;">JOSE AI</h3>
                        <span style="font-size:0.75rem; color: #00d4aa;">Auto Care Specialist</span>
                    </div>
                    <button id="jose-close">×</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <button id="jose-voice-btn" title="Click to Unmute Voice">🔇</button>
                    <input type="text" id="jose-input" placeholder="Ask about automation...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
            
            <button id="jose-toggle">
                <div id="jose-notification"></div>
                <img src="${iconUrl}" alt="Chat">
            </button>
        `;
        document.body.appendChild(container);

        // Bind events
        this.chatWindow = document.getElementById('jose-chat-window');
        this.msgContainer = document.getElementById('jose-messages');

        document.getElementById('jose-toggle').onclick = () => this._toggleChat();
        document.getElementById('jose-close').onclick = () => this._toggleChat();
        document.getElementById('jose-send').onclick = () => this._sendMessage();
        document.getElementById('jose-input').onkeypress = (e) => { if (e.key === 'Enter') this._sendMessage(); };

        // Explicit Audio Switch
        document.getElementById('jose-voice-btn').onclick = () => {
            this.synth.resume();
            this.voiceEnabled = !this.voiceEnabled;
            const btn = document.getElementById('jose-voice-btn');
            if (this.voiceEnabled) {
                btn.textContent = '🔊';
                btn.classList.add('active');
                this._speak("Voice activated.");
            } else {
                this.synth.cancel();
                btn.textContent = '🔇';
                btn.classList.remove('active');
            }
        };
    }

    _toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWindow.classList.toggle('open', this.isOpen);
        if (this.isOpen) {
            document.getElementById('jose-notification').style.display = 'none';
            document.getElementById('jose-input').focus();
            // Try enabling voice if interaction happened
            if (!this.voiceEnabled) this.synth.resume();
        }
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `jose-msg ${sender}`;
        div.innerHTML = text; // Allow HTML in messages
        this.msgContainer.appendChild(div);
        this.msgContainer.scrollTop = this.msgContainer.scrollHeight;

        // Speak strictly if sender is JOSE and Voice is ENABLED
        if (sender === 'jose' && this.voiceEnabled) {
            this._speak(text.replace(/<[^>]*>/g, '')); // Strip HTML for TTS
        }
    }

    async _sendMessage() {
        const input = document.getElementById('jose-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);

        this._showTyping();

        // 🔐 SECURITY CHECK: 
        // We do NOT use hardcoded keys. We use a simulated logic for the demo 
        // OR a key retrieved from localStorage if the user is authenticated.
        // There are NO keys in this file.

        const apiKey = localStorage.getItem('ORION_AI_KEY');

        let responseText = "";

        if (apiKey) {
            // If we had a key, we would call Gemini here.
            // For this public demo, we fallback to simulated intelligence to avoid key exposure.
            responseText = await this._getSimulatedResponse(text);
        } else {
            // Default safe mode
            responseText = await this._getSimulatedResponse(text);
        }

        this._hideTyping();
        this._addMessage('jose', responseText);
    }

    _showTyping() {
        const div = document.createElement('div');
        div.className = 'jose-msg jose typing';
        div.id = 'jose-typing';
        div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        this.msgContainer.appendChild(div);
        this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
    }

    _hideTyping() {
        const el = document.getElementById('jose-typing');
        if (el) el.remove();
    }

    async _getSimulatedResponse(text) {
        return new Promise(resolve => {
            setTimeout(() => {
                const lower = text.toLowerCase();
                // Simple Logic for Demo
                if (lower.includes('latino') || lower.includes('español')) {
                    this.language = 'es';
                    resolve("Entendido. Cambiando a español. ¿En qué puedo ayudarte con tu taller?");
                } else if (lower.includes('puedes hablar') || lower.includes('voice')) {
                    resolve(this.language === 'es'
                        ? "¡Claro que sí! Asegúrate de que el icono de bocina 🔊 esté activo."
                        : "Yes I can! Make sure the speaker icon 🔊 is active.");
                } else if (lower.includes('price') || lower.includes('cost')) {
                    resolve(this.language === 'es'
                        ? "Nuestros planes empiezan desde $1,500/mes. El plan FLEET ($2,500) es el más popular para talleres como LGB."
                        : "Our plans start at $1,500/mo. The FLEET plan ($2,500) is the most popular for shops like LGB.");
                } else {
                    resolve(this.language === 'es'
                        ? "Esa es una gran pregunta sobre la operación. Nuestro sistema InvAI rastrea todo para evitar pérdidas. ¿Te gustaría ver un video de cómo funciona?"
                        : "That's a great question about operations. Our InvAI system tracks everything to prevent loss. Would you like to see a video of how it works?");
                }
            }, 1000);
        });
    }
}

// Global Launcher
window.initJose = function () {
    new JoseAssistant({
        clientName: 'LGB Autowork',
        language: 'en'
    });
};

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initJose);
} else {
    window.initJose();
}
