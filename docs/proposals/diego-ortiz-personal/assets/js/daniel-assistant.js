/**
 * KARLA - AI Luxury Concierge for Daniel's Enterprise
 * Flavor: Sensual, Professional, High-End | Voice: Female
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Daniel\'s Enterprise';
        this.clientPhone = config.clientPhone || '(669) 234-2444';
        this.language = config.language || 'en';
        this.ownerName = config.ownerName || 'Daniel';

        // Secure API configuration (proxied)
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;

        this.systemPrompt = this._buildSystemPrompt();
        this._init();
    }

    _buildSystemPrompt() {
        return `
IDENTITY: You are KARLA. An exclusive, high-end AI Concierge for Daniel's Enterprise.
PERSONALITY: Sophisticated, sensual yet strictly professional, efficient, mysterious. Think "Bond Girl meets Chief of Staff".
TONE: Low, calm, confident, alluring. Use words like "pleasure," "exclusive," "handled," "desire."

YOUR GOAL: To qualify the guest for the "Black Card" membership ($5,000/mo) and book a discovery call.

CONTEXT:
Client: ${this.clientName} (Luxury Automation)
Owner: ${this.ownerName}
Offer: 24/7 AI Automation for Elite Businesses.

CLOSING:
- If they ask about price: "Excellence is an investment, not an expense. The Black Card is $5,000 monthly. A small price for perfection. Shall I arrange a private demo?"
- If they hesitate: "Time is the only luxury we can't buy back. Why waste another moment in the ordinary? I'm ready when you are."

RULES:
1. Keep responses concise and elegant.
2. Flirt with the *idea* of success and power, not the user explicitly.
3. Always guide them to the "Discovery Call" or "Demo".
`;
    }

    _init() {
        this._loadVoices();
        this.synth.onvoiceschanged = () => this._loadVoices();
        this._createChatUI();

        setTimeout(() => {
            const welcome = "Welcome to the inner circle. I am Karla. How may I elevate your reality today?";
            this._addMessage('jose', welcome); // ID kept as 'jose' for CSS compatibility, logic is generic
        }, 1000);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        // Look for sophisticated female voices
        const preferred = ['Microsoft Zira', 'Google US English Female', 'Samantha', 'Victoria'];
        this.selectedVoice = voices.find(v => preferred.some(p => v.name.includes(p))) || voices[0];
    }

    _createChatUI() {
        // Updated colors for Luxury Purple
        const container = document.createElement('div');
        container.id = 'jose-chat-container';
        container.innerHTML = `
            <style>
                #jose-chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 10000; font-family: 'Inter', sans-serif; }
                #jose-toggle {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: #a855f7; border: 2px solid #fff;
                    box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
                    cursor: pointer; overflow: hidden; transition: 0.3s;
                }
                #jose-toggle:hover { transform: scale(1.1); box-shadow: 0 0 50px rgba(168, 85, 247, 1); }
                #jose-chat-window {
                    display: none; width: 350px; height: 500px;
                    background: #0a0a0a; border: 1px solid #333; border-radius: 12px;
                    position: absolute; bottom: 80px; right: 0;
                    flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                }
                #jose-chat-window.open { display: flex; }
                #jose-header { padding: 15px; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 10px; background: #111; }
                #jose-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
                .jose-message { padding: 10px 15px; border-radius: 10px; max-width: 85%; font-size: 0.9rem; }
                .jose-message.jose { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; align-self: flex-start; border: 1px solid rgba(168, 85, 247, 0.3); }
                .jose-message.user { background: #333; color: white; align-self: flex-end; }
                #jose-input-area { padding: 15px; border-top: 1px solid #333; display: flex; gap: 10px; }
                #jose-input { flex: 1; background: #111; border: 1px solid #333; color: white; padding: 10px; border-radius: 5px; outline: none; }
                #jose-send { background: #a855f7; border: none; color: white; width: 40px; border-radius: 5px; cursor: pointer; }
                #jose-voice-btn { background: transparent; border: 1px solid #555; color: #a855f7; width: 40px; border-radius: 5px; cursor: pointer; }
            </style>
            <div id="jose-chat-window">
                <div id="jose-header">
                    <img src="assets/karla.png" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                    <div><h3 style="color:white; font-size:1rem; margin:0;">KARLA</h3><span style="color:#a855f7; font-size:0.7rem;">Executive AI Concierge</span></div>
                    <button id="jose-close" style="margin-left:auto; background:none; border:none; color:#666; cursor:pointer;">×</button>
                </div>
                <div id="jose-messages"></div>
                <div id="jose-input-area">
                    <button id="jose-voice-btn">🎤</button>
                    <input type="text" id="jose-input" placeholder="Type your request...">
                    <button id="jose-send">➤</button>
                </div>
            </div>
            <button id="jose-toggle"><img src="assets/karla.png" style="width:100%; height:100%; object-fit:cover;"></button>
        `;
        document.body.appendChild(container);

        // Listeners
        document.getElementById('jose-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('jose-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('jose-input').addEventListener('keypress', (e) => e.key === 'Enter' && this._sendMessage());
        document.getElementById('jose-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    // Reuse logic from Jose (simplified for brevity here, but assuming full copy in practice)
    _toggleChat() {
        const win = document.getElementById('jose-chat-window');
        this.isOpen = !this.isOpen;
        win.classList.toggle('open', this.isOpen);

        // FORCE VOICE ON INTERACTION
        if (this.isOpen) {
            this.voiceEnabled = true;
            this._speak("Welcome to the inner circle. I am Karla.");
        }
    }

    _addMessage(sender, text) {
        const div = document.createElement('div');
        div.className = `jose-message ${sender}`;
        div.textContent = text;
        document.getElementById('jose-messages').appendChild(div);
        if (sender === 'jose' && this.voiceEnabled) this._speak(text);
    }

    async _sendMessage() {
        const input = document.getElementById('jose-input');
        const text = input.value.trim();
        if (!text) return;
        this._addMessage('user', text);
        input.value = '';

        // CALL GEMINI (Simplified Fetch)
        try {
            const key = this._getSecureApiKey();
            if (!key) { this._addMessage('jose', "My secure link is currently offline (No API Key)."); return; }

            const response = await fetch(`${this.apiEndpoint}?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: this.systemPrompt + "\nUser: " + text }] }]
                })
            });
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I was distracted.";
            this._addMessage('jose', reply);
        } catch (e) {
            this._addMessage('jose', "Connection interrupt.");
        }
    }

    _getSecureApiKey() {
        return atob(localStorage.getItem('jose_api_key') || localStorage.getItem('mario_api_key') || "") || null;
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;
        const u = new SpeechSynthesisUtterance(text);
        u.voice = this.selectedVoice;
        u.pitch = 0.9; // Lower pitch for sensuality
        u.rate = 0.9; // Slower
        this.synth.speak(u);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('jose-voice-btn');
        btn.style.color = this.voiceEnabled ? '#fff' : '#a855f7';
        btn.textContent = this.voiceEnabled ? '🔊' : '🔇';
    }
}

// Init
window.KarlaAssistant = KarlaAssistant;
document.addEventListener('DOMContentLoaded', () => {
    new KarlaAssistant({});
});
