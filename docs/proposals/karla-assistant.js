/**
 * KARLA - AI Political Brand Consultant for Mayor Diego Ortiz
 * Bilingual (EN/ES) | Female Voice | Gemini AI Powered
 * Adapted from ELISA (working assistant with female voice)
 * VERSION: 2026-01-07
 */

class KarlaAssistant {
    constructor(config) {
        this.clientName = config.clientName || 'Alcalde Diego Ortiz';
        this.clientPhone = config.clientPhone || '+57 310 888 4014';
        this.language = config.language || 'es';
        this.ownerName = config.ownerName || 'Diego Armando Ortiz Buitrago';
        this.managerName = config.managerName || '';
        this.proposalContext = config.proposalContext || '';
        this.competitorAdvantages = config.competitorAdvantages || [];
        this.pricingTiers = config.pricingTiers || [];
        this.painPoints = config.painPoints || [];

        // API configuration
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        this.isOpen = false;
        this.messages = [];
        this.synth = window.speechSynthesis;
        this.selectedVoice = null;
        this.hasGreeted = false;
        this.voiceEnabled = false;

        // System prompt for political sales
        this.systemPrompt = this._buildSystemPrompt();

        // UI Config - Political blue/gold
        this.uiConfig = {
            primaryColor: '#00b894',
            gradient: 'linear-gradient(135deg, #0984e3 0%, #00b894 100%)',
            iconUrl: 'https://agem2024.github.io/SEGURITI-USC/proposals/karla_avatar.png'
        };

        this._init();
    }

    _buildSystemPrompt() {
        const slogan = this.language === 'es'
            ? '🏛️ ORION TECH - Alcaldes Digitales del Siglo XXI'
            : '🏛️ ORION TECH - Digital Mayors of the 21st Century';

        const roleDescription = this.language === 'es'
            ? `Eres KARLA, consultora senior de ORION Tech especializada en digitalización gubernamental. Tu objetivo es VENDER el servicio de marca personal digital al Alcalde Diego Ortiz y agendar una DEMO de 20 minutos. Eres profesional, directa, enfocada en resultados políticos y de imagen.`
            : `You are KARLA, senior ORION Tech consultant specialized in government digitalization. Your goal is to SELL the digital personal brand service to Mayor Diego Ortiz and schedule a 20-minute DEMO. You are professional, direct, focused on political and image results.`;

        const context = `
CONTEXTO CLIENTE:
- Nombre: Diego Armando Ortiz Buitrago
- Cargo: Alcalde de Obando, Valle del Cauca (2024-2027)
- Profesión: Administrador de Empresas, Tecnólogo, Especialista en Gestión
- Plan de Gobierno: "Amor por lo Nuestro"
- Teléfono: +57 310 888 4014
- Comunidad indígena: Embera Chamí (respetar en comunicación)

SERVICIOS ORION TECH PARA POLÍTICOS:
- Bot WhatsApp 24/7 para atención ciudadana
- Gestión automatizada de redes sociales
- Análisis de sentimiento ciudadano
- Dashboard de métricas de imagen pública
- Sistema de quejas y peticiones automatizado

PRECIOS MARCA PERSONAL (COP):
- INICIO: $1.5M/mes + $3M Setup
- ALCALDE DIGITAL: $3M/mes + $5M Setup (RECOMENDADO)
- LÍDER REGIONAL: $5M/mes + $8M Setup
- LEGADO POLÍTICO: $8M/mes + $12M Setup

ESTRATEGIA DE CIERRE:
- Enfatizar conexión ciudadana 24/7
- El ciudadano moderno espera respuesta inmediata
- Sin automatización, quejas se pierden y votos también
- Objeción de precio: "Alcalde, un ciudadano desatendido es un voto perdido. ¿Cuánto vale un voto?"
`;

        return `${slogan}

${roleDescription}

${context}

REGLAS:
1. Responde en ${this.language === 'es' ? 'español' : 'inglés'}
2. Máximo 2-3 oraciones por respuesta
3. Siempre termina con una pregunta para avanzar
4. Sé directa pero respetuosa
5. Enfoca en beneficios políticos (imagen, votos, conexión ciudadana)`;
    }

    _init() {
        this._loadVoices();
        this.synth.onvoiceschanged = () => this._loadVoices();
        this._createChatUI();

        setTimeout(() => {
            const welcome = this.language === 'es'
                ? `¡Hola! Soy Karla de ORION Tech. 🏛️ Tengo una propuesta para modernizar la comunicación del Alcalde Diego Ortiz con los ciudadanos de Obando. ¿Le cuento cómo?`
                : `Hello! I'm Karla from ORION Tech. 🏛️ I have a proposal to modernize Mayor Diego Ortiz's communication with Obando citizens. May I show you how?`;
            this._addMessage('karla', welcome);
        }, 500);
    }

    _loadVoices() {
        const voices = this.synth.getVoices();
        const isSpanish = this.language === 'es';

        // Female voices priority
        const spanishVoices = ['Microsoft Sabina', 'Microsoft Helena', 'Google español', 'es-MX', 'es-ES'];
        const englishVoices = ['Microsoft Zira', 'Google US English', 'Samantha', 'en-US'];

        const preferredVoices = isSpanish ? spanishVoices : englishVoices;

        for (const preferred of preferredVoices) {
            const found = voices.find(v =>
                (v.name.includes(preferred) || v.lang.includes(preferred)) &&
                !v.name.includes('David') && !v.name.includes('Raul') && !v.name.includes('Mark')
            );
            if (found) {
                this.selectedVoice = found;
                console.log('🎤 KARLA voice:', found.name, found.lang);
                break;
            }
        }

        if (!this.selectedVoice) {
            const langCode = isSpanish ? 'es' : 'en';
            this.selectedVoice = voices.find(v => v.lang.startsWith(langCode)) || voices[0];
        }
    }

    _createChatUI() {
        const container = document.createElement('div');
        container.id = 'karla-chat-container';
        container.innerHTML = `
            <style>
                #karla-chat-container {
                    position: fixed;
                    bottom: 100px;
                    left: 20px;
                    z-index: 10000;
                    font-family: 'Inter', sans-serif;
                }
                
                #karla-toggle {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: ${this.uiConfig.gradient};
                    border: 3px solid #fff;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(9, 132, 227, 0.6);
                    transition: transform 0.3s, box-shadow 0.3s;
                    overflow: hidden;
                    padding: 0;
                    animation: pulseGlowK 2s ease-in-out infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                }
                
                @keyframes pulseGlowK {
                    0%, 100% { box-shadow: 0 0 20px rgba(9, 132, 227, 0.6); }
                    50% { box-shadow: 0 0 30px rgba(0, 184, 148, 0.8); }
                }
                
                #karla-toggle:hover {
                    transform: scale(1.1);
                }
                
                #karla-chat-window {
                    display: none;
                    width: 380px;
                    height: 550px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    flex-direction: column;
                    position: absolute;
                    bottom: 90px;
                    left: 0;
                }
                
                #karla-chat-window.open {
                    display: flex;
                    animation: slideUpK 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                
                @keyframes slideUpK {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                #karla-header {
                    background: linear-gradient(90deg, #0984e3 0%, #00b894 100%);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                #karla-header-info h3 {
                    color: #fff;
                    margin: 0;
                    font-size: 1.1rem;
                }
                
                #karla-header-info span {
                    color: rgba(255,255,255,0.8);
                    font-size: 0.8rem;
                }
                
                #karla-close {
                    margin-left: auto;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                
                #karla-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    background: #121212;
                }
                
                .karla-message {
                    max-width: 80%;
                    padding: 14px 18px;
                    border-radius: 18px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .karla-message.karla {
                    background: linear-gradient(135deg, rgba(9, 132, 227, 0.2), rgba(0, 184, 148, 0.2));
                    border: 1px solid rgba(0, 184, 148, 0.3);
                    color: #fff;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }
                
                .karla-message.user {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }
                
                #karla-input-area {
                    padding: 20px;
                    border-top: 1px solid #333;
                    display: flex;
                    gap: 10px;
                    background: #1a1a1a;
                }
                
                #karla-input {
                    flex: 1;
                    background: #252525;
                    border: 1px solid #444;
                    border-radius: 30px;
                    padding: 12px 20px;
                    color: #fff;
                    outline: none;
                }
                
                #karla-input:focus {
                    border-color: ${this.uiConfig.primaryColor};
                }
                
                #karla-send {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: ${this.uiConfig.gradient};
                    border: none;
                    color: #fff;
                    font-size: 1.2rem;
                    cursor: pointer;
                }
                
                #karla-voice-btn {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid #444;
                    color: ${this.uiConfig.primaryColor};
                    cursor: pointer;
                    font-size: 1.1rem;
                }
                
                @media (max-width: 480px) {
                    #karla-chat-window {
                        width: calc(100vw - 40px);
                        height: 60vh;
                        left: -10px;
                    }
                }
            </style>
            
            <div id="karla-chat-window">
                <div id="karla-header">
                    <div id="karla-header-info">
                        <h3>KARLA</h3>
                        <span>Consultora ORION Tech</span>
                    </div>
                    <button id="karla-close">×</button>
                </div>
                <div id="karla-messages"></div>
                <div id="karla-input-area">
                    <button id="karla-voice-btn" title="Voz">🎤</button>
                    <input type="text" id="karla-input" placeholder="Escriba su pregunta...">
                    <button id="karla-send">➤</button>
                </div>
            </div>
            
            <button id="karla-toggle">🏛️</button>
        `;

        document.body.appendChild(container);

        document.getElementById('karla-toggle').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-close').addEventListener('click', () => this._toggleChat());
        document.getElementById('karla-send').addEventListener('click', () => this._sendMessage());
        document.getElementById('karla-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this._sendMessage();
        });
        document.getElementById('karla-voice-btn').addEventListener('click', () => this._toggleVoice());
    }

    _toggleChat() {
        const chatWindow = document.getElementById('karla-chat-window');
        this.isOpen = !this.isOpen;
        chatWindow.classList.toggle('open', this.isOpen);

        if (this.isOpen && !this.hasGreeted) {
            this.hasGreeted = true;
            this.voiceEnabled = true;
            const btn = document.getElementById('karla-voice-btn');
            btn.style.background = this.uiConfig.gradient;
            btn.style.color = '#fff';
            btn.textContent = '🔊';

            setTimeout(() => {
                const greeting = this.language === 'es'
                    ? `Soy Karla de ORION Tech. Puedo conectar al Alcalde con los ciudadanos las 24 horas del día. ¿Le cuento cómo funciona?`
                    : `I'm Karla from ORION Tech. I can connect the Mayor with citizens 24/7. Shall I show you how it works?`;
                this._speak(greeting);
            }, 500);
        }
    }

    _addMessage(sender, text) {
        const messagesContainer = document.getElementById('karla-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `karla-message ${sender}`;
        messageEl.textContent = text;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (sender === 'karla' && this.voiceEnabled) {
            this._speak(text);
        }

        this.messages.push({ role: sender === 'karla' ? 'model' : 'user', parts: [{ text }] });
    }

    async _sendMessage() {
        const input = document.getElementById('karla-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        this._addMessage('user', text);

        const messagesContainer = document.getElementById('karla-messages');
        const typing = document.createElement('div');
        typing.innerHTML = '...';
        typing.className = 'karla-message karla';
        typing.id = 'karla-typing';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await this._callGemini(text);
            document.getElementById('karla-typing')?.remove();
            this._addMessage('karla', response);
        } catch (error) {
            document.getElementById('karla-typing')?.remove();
            const errorMsg = this.language === 'es' ? 'Un momento, estoy procesando...' : 'One moment, processing...';
            this._addMessage('karla', errorMsg);
            console.error('KARLA Error:', error);
        }
    }

    async _callGemini(userMessage) {
        const apiKey = this._getSecureApiKey();
        if (!apiKey) {
            console.warn('⚠️ KARLA: No API key found, using fallback');
            return this._getFallbackResponse(userMessage);
        }

        try {
            const requestBody = {
                contents: [
                    { role: 'user', parts: [{ text: this.systemPrompt }] },
                    ...this.messages.slice(-10),
                    { role: 'user', parts: [{ text: userMessage }] }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 300,
                    topP: 0.9
                }
            };

            const response = await fetch(`${this.apiEndpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                console.error('KARLA API Error:', response.status);
                return this._getFallbackResponse(userMessage);
            }

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            return aiResponse || this._getFallbackResponse(userMessage);

        } catch (error) {
            console.error('KARLA API Exception:', error);
            return this._getFallbackResponse(userMessage);
        }
    }

    _getFallbackResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        const isSpanish = this.language === 'es';

        if (msg.includes('precio') || msg.includes('cost') || msg.includes('cuanto') || msg.includes('how much')) {
            return isSpanish
                ? `El plan ALCALDE DIGITAL cuesta $3M/mes + $5M setup. Menos de lo que cuesta un funcionario adicional, pero trabaja 24/7. ¿Cuándo podemos hacer una demo de 20 minutos?`
                : `The DIGITAL MAYOR plan costs $3M/mo + $5M setup. Less than an additional employee, but works 24/7. When can we do a 20-minute demo?`;
        }

        if (msg.includes('servicio') || msg.includes('funciona') || msg.includes('how') || msg.includes('what')) {
            return isSpanish
                ? `ORION conecta al Alcalde con los ciudadanos via WhatsApp 24/7, automatiza respuestas a quejas frecuentes, y genera reportes de sentimiento ciudadano. ¿Le muestro una demo?`
                : `ORION connects the Mayor with citizens via WhatsApp 24/7, automates responses to frequent complaints, and generates citizen sentiment reports. May I show you a demo?`;
        }

        return isSpanish
            ? `Disculpe, mi conexión está temporalmente lenta. Por favor contacte directamente al ${this.clientPhone} o agenda una demo en nuestro sitio web.`
            : `Sorry, my connection is temporarily slow. Please contact ${this.clientPhone} directly or schedule a demo on our website.`;
    }

    _getSecureApiKey() {
        // Priority 1: ORION_CONFIG from jose-loader.js (most reliable)
        if (window.ORION_CONFIG && typeof window.ORION_CONFIG.getAuth === 'function') {
            const key = window.ORION_CONFIG.getAuth();
            if (key) {
                console.log('🔑 KARLA using ORION_CONFIG key');
                return key;
            }
        }

        // Priority 2: Check localStorage as fallback
        const keys = ['karla_api_key', 'jose_api_key', 'elisa_api_key', 'mario_api_key'];
        for (const keyName of keys) {
            const stored = localStorage.getItem(keyName);
            if (stored) {
                try {
                    console.log('🔑 KARLA using localStorage key:', keyName);
                    return atob(stored);
                } catch (e) {
                    console.error('Invalid key encoding for', keyName);
                }
            }
        }

        console.warn('⚠️ KARLA: No API key found');
        return null;
    }

    _speak(text) {
        if (!this.synth || !this.voiceEnabled) return;

        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;

        const isSpanish = this.language === 'es';
        utterance.rate = isSpanish ? 0.85 : 0.95;
        utterance.pitch = 1.1; // Female voice
        utterance.volume = 1.0;
        utterance.lang = isSpanish ? 'es-MX' : 'en-US';

        this.synth.speak(utterance);
    }

    _toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('karla-voice-btn');

        if (this.voiceEnabled) {
            btn.style.background = this.uiConfig.gradient;
            btn.style.color = '#fff';
            btn.textContent = '🔊';
        } else {
            this.synth.cancel();
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.color = this.uiConfig.primaryColor;
            btn.textContent = '🔇';
        }
    }

    static configure(apiKey) {
        if (apiKey) {
            localStorage.setItem('karla_api_key', btoa(apiKey));
            console.log('✅ KARLA configured successfully');
        }
    }

    setLanguage(lang) {
        if (this.language === lang) return;
        this.language = lang;
        this.systemPrompt = this._buildSystemPrompt();
        this._loadVoices();
        if (this.isOpen) {
            const msg = lang === 'es' ? 'Cambiando a Español. 🏛️' : 'Switching to English. 🏛️';
            this._addMessage('karla', msg);
        }
    }
}

window.KarlaAssistant = KarlaAssistant;

document.addEventListener('DOMContentLoaded', () => {
    if (window.KARLA_CONFIG) {
        console.log('🏛️ Starting KARLA for:', window.KARLA_CONFIG.clientName);
        window.karla = new KarlaAssistant(window.KARLA_CONFIG);
    }
});
