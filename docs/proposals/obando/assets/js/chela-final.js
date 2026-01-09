/**
 * CHELA - AI Citizen Assistant (REWRITTEN V3)
 * Alcaldía de Obando
 * Trilingual: Español / English / Embera Chamí
 * Powered by Gemini 2.0 via Secure Render Proxy
 */

(function () {
    // Prevent duplicate instances
    if (window.ObandoAssistantInstance) return;

    class ObandoAssistant {
        constructor(config) {
            this.config = config || {};
            this.clientName = this.config.clientName || 'Alcaldía de Obando';
            this.language = this.config.language || 'es';

            // Secure Proxy URL
            this.apiEndpoint = 'https://seguriti-usc.onrender.com/chat';

            this.isOpen = false;
            this.messages = [];
            this.synth = window.speechSynthesis;
            this.selectedVoice = null;
            this.hasGreeted = false;

            this._init();
            window.ObandoAssistantInstance = this;
        }

        async _init() {
            console.log('🤖 Chela Assistant Initializing...');
            await this._loadVoices();
            this._injectStyles();
            this._createUI();
            this._setupEvents();

            // Auto-greet after delay
            setTimeout(() => this._greet(), 2000);
        }

        _injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #chela-root {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 2147483647; /* MAX Z-INDEX */
                    pointer-events: none; /* Let clicks pass through container area */
                }

                #chela-toggle {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background-color: #ffffff;
                    background-image: url('https://agem2024.github.io/SEGURITI-USC/proposals/obando/assets/chela.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    border: 3px solid #00B050;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    cursor: pointer;
                    pointer-events: auto !important;
                    transition: transform 0.2s;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
                #chela-toggle:hover { transform: scale(1.05); }
                #chela-toggle:active { transform: scale(0.95); }

                /* Fallback if image fails */
                #chela-toggle.no-img::after {
                    content: '👩‍💼';
                    font-size: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                }

                #chela-window {
                    display: none;
                    flex-direction: column;
                    width: 360px;
                    height: 550px;
                    background: #ffffff;
                    border-radius: 18px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                    position: absolute;
                    bottom: 85px;
                    right: 0;
                    pointer-events: auto; /* Re-enable clicks */
                    overflow: hidden;
                    border: 1px solid #e0e0e0;
                    animation: chelaSlideIn 0.3s ease-out;
                }

                @keyframes chelaSlideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                #chela-window.visible { display: flex; }

                #chela-header {
                    background: linear-gradient(135deg, #00B050 0%, #008030 100%);
                    color: white;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                #chela-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    background-color: #f5f5f5;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .chela-msg {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 14px;
                    font-size: 15px;
                    line-height: 1.5;
                    word-wrap: break-word;
                }

                .chela-msg.bot {
                    background: #ffffff;
                    color: #1a1a1a;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }

                .chela-msg.user {
                    background: #00B050;
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }

                #chela-input-area {
                    padding: 16px;
                    background: white;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    pointer-events: auto !important;
                }

                #chela-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #ddd;
                    border-radius: 24px;
                    font-size: 15px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                #chela-input:focus { border-color: #00B050; }

                #chela-send {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #00B050;
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: background 0.2s;
                }
                #chela-send:hover { background: #009040; }
                #chela-send:disabled { background: #ccc; cursor: not-allowed; }

                #chela-close {
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
            `;
            document.head.appendChild(style);
        }

        _createUI() {
            const root = document.createElement('div');
            root.id = 'chela-root';

            root.innerHTML = `
                <div id="chela-window">
                    <div id="chela-header">
                        <div>
                            <div style="font-weight: 700; font-size: 16px;">CHELA</div>
                            <div style="font-size: 12px; opacity: 0.9;">Asistente Ciudadana</div>
                        </div>
                        <button id="chela-close">&times;</button>
                    </div>
                    <div id="chela-messages"></div>
                    <div id="chela-input-area">
                        <input type="text" id="chela-input" placeholder="Pregunta algo..." autocomplete="off">
                        <button id="chela-send">➤</button>
                    </div>
                </div>
                <div id="chela-toggle" title="Hablar con Chela"></div>
            `;

            document.body.appendChild(root);

            // Verify Image Loading
            const toggle = document.getElementById('chela-toggle');
            const img = new Image();
            img.src = 'assets/chela.png';
            img.onerror = () => {
                console.warn('⚠️ Chela image failed to load. Using fallback emoji.');
                toggle.classList.add('no-img');
                toggle.style.backgroundImage = 'none';
            };
        }

        _setupEvents() {
            const toggle = document.getElementById('chela-toggle');
            const close = document.getElementById('chela-close');
            const send = document.getElementById('chela-send');
            const input = document.getElementById('chela-input');
            const windowEl = document.getElementById('chela-window');

            const toggleChat = () => {
                this.isOpen = !this.isOpen;
                windowEl.classList.toggle('visible', this.isOpen);
                if (this.isOpen) {
                    setTimeout(() => input.focus(), 150);
                }
            };

            toggle.onclick = toggleChat;
            close.onclick = toggleChat;

            const sendMessage = async () => {
                const text = input.value.trim();
                if (!text) return;

                input.value = '';
                this._addMessage('user', text);

                // Loading state
                const loadingId = this._addMessage('bot', '...', true);

                try {
                    const response = await this._callGemini(text);
                    this._removeMessage(loadingId);
                    this._addMessage('bot', response);
                } catch (e) {
                    this._removeMessage(loadingId);
                    this._addMessage('bot', 'Lo siento, tuve un problema de conexión. ¿Me repites?');
                    console.error('Chat Error:', e);
                }
            };

            send.onclick = sendMessage;
            input.onkeypress = (e) => {
                if (e.key === 'Enter') sendMessage();
            };
        }

        _addMessage(sender, text, isLoading = false) {
            const container = document.getElementById('chela-messages');
            const div = document.createElement('div');
            div.className = `chela-msg ${sender}`;
            div.textContent = text;
            div.id = 'msg-' + Date.now();

            if (isLoading) {
                div.style.opacity = '0.7';
                div.style.fontStyle = 'italic';
            }

            container.appendChild(div);
            container.scrollTop = container.scrollHeight;

            if (sender === 'bot' && !isLoading) {
                this._speak(text);
            }

            return div.id;
        }

        _removeMessage(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }

        _greet() {
            if (this.hasGreeted) return;
            const msg = this.language === 'es'
                ? "Hola, soy CHELA. La asistente virtual de la Alcaldía. ¿En qué puedo ayudarte hoy?"
                : "Hello, I'm CHELA, the Mayor's Office virtual assistant. How can I help you?";
            this._addMessage('bot', msg);
            this.hasGreeted = true;
        }

        async _callGemini(userMessage) {
            // DETECT LANGUAGE (ES / EN / EMBERA)
            const msg = userMessage.toLowerCase();
            const isEmbera = /(embera|chamí|chami|bêrea|zocai|kĩra|bia|nũmí)/i.test(msg);

            if (isEmbera) {
                this.systemPrompt += "\n[SYSTEM ALERT: USER IS SPEAKING EMBERA CHAMÍ. REPLY IN EMBERA ONLY.]";
            }

            const PROXY_URL = 'https://seguriti-usc.onrender.com/chat';

            const response = await fetch(PROXY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `${this._getSystemPrompt()}\n\nUser: ${userMessage}`
                })
            });

            if (!response.ok) throw new Error('Proxy API Error');
            const data = await response.json();
            return data.response;
        }

        _getSystemPrompt() {
            const base = `
CONTEXT: You are CHELA (Ciudadana Honesta Eficiente Leal y Ágil), the AI Assistant for the Mayor's Office of Obando, Valle del Cauca, Colombia.
MISSION: Help citizens with procedures (SISBEN, Taxes, PQRS) to avoid physical lines and paper usage.
TONE: Friendly, respectful, clear. Use local terms like "Vecino", "Doña".
LANGUAGES: 
1. Spanish (Primary)
2. English (Secondary)
3. Embera Chamí (Indigenous - Very Important). If user initiates in Embera (Bêrea, Zocai), YOU MUST REPLY IN EMBERA.

KEY INFO:
- Mayor wants "Zero Paper" and transparency.
- The project is "Municipio Digital" (ORION Gov).
- Cost: Starts at $15M COP.
`;
            return base;
        }

        _loadVoices() {
            return new Promise(resolve => {
                let voices = this.synth.getVoices();
                if (voices.length > 0) {
                    this._selectVoice(voices);
                    resolve();
                    return;
                }
                this.synth.onvoiceschanged = () => {
                    voices = this.synth.getVoices();
                    this._selectVoice(voices);
                    resolve();
                };
            });
        }

        _selectVoice(voices) {
            // Priority: Microsoft Sabina / Paulina / Helena / Google Español
            const preferred = ['Sabina', 'Paulina', 'Helena', 'Google Español'];
            this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
        }

        _speak(text) {
            if (!this.synth || !this.selectedVoice) return;
            this.synth.cancel();

            // Clean text for TTS (remove URLs, formatting)
            const cleanText = text.replace(/[*_#]/g, '').replace(/(https?:\/\/[^\s]+)/g, '');

            const utter = new SpeechSynthesisUtterance(cleanText);
            utter.voice = this.selectedVoice;
            utter.rate = 1.05; // Slightly faster/efficient
            this.synth.speak(utter);
        }
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
        new ObandoAssistant(window.CHELA_CONFIG);
    });

})();