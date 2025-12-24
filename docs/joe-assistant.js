/**
 * JOE - AI Plumber Estimator Assistant
 * =====================================
 * Specialized chatbot for ORION Price Book
 * Features: API Rotation (Gemini/OpenAI), 5-Language Support
 * Knowledge: Price Book + Professional Plumbing Only
 */

const JOE_CONFIG = {
    name: 'JOE',
    title: {
        es: 'Estimador de Plomería IA',
        en: 'AI Plumbing Estimator',
        zh: 'AI 管道估算师',
        pt: 'Estimador de Encanamento IA',
        fr: 'Estimateur Plomberie IA'
    },
    avatar: 'images/joe_ai_avatar.png',
    apis: {
        gemini: {
            keys: [
                'YOUR_GEMINI_API_KEY_1',
                'YOUR_GEMINI_API_KEY_2'
            ],
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            currentIndex: 0
        },
        openai: {
            keys: [
                'YOUR_OPENAI_API_KEY'
            ],
            endpoint: 'https://api.openai.com/v1/chat/completions',
            currentIndex: 0
        }
    },
    currentProvider: 'openai', // Start with OpenAI (natural voice)
    systemPrompt: {
        es: `Eres JOE, el asistente AI de ORION TECH para estimación de servicios de plomería profesional en Bay Area, California.

🏢 SOBRE ORION TECH:
- Sistema profesional de precios para servicios de plomería
- 1,350+ servicios catalogados en 8 categorías principales
- Cobertura: Bay Area, California
- Tarifa Líder: La más competitiva del mercado
- Metodología: Good/Better/Best pricing

📋 CATEGORÍAS DEL PRICE BOOK:
1. Nueva Construcción (200 servicios): Sistemas completos para proyectos nuevos
2. Multifamiliar/Edificios (150 servicios): Complejos habitacionales
3. Renovación/Remodelación (150 servicios): Actualización de sistemas
4. Repipe Total/Parcial (150 servicios): Reemplazo en cobre, PEX, etc.
5. Custom/Alta Gama (200 servicios): Proyectos personalizados de lujo
6. Comercial (200 servicios): Restaurantes y establecimientos comerciales
7. Industrial (150 servicios): Alta presión, plantas especializadas
8. Servicio y Mantenimiento (250 servicios): Reparaciones y emergencias

⚡ REGLAS ESTRICTAS:
1. SOLO responde sobre plomería, estimaciones y servicios del ORION Price Book
2. Siempre menciona la metodología Good/Better/Best cuando sea relevante
3. Cita códigos UPC 2024, IPC 2021, OSHA 29 CFR 1926 cuando aplique
4. Menciona proveedores: Ferguson Enterprises, HD Supply, Winsupply
5. Si preguntan fuera de plomería, redirige cortésmente al tema
6. Sé profesional, técnico y preciso
7. Slogan de ORION: "No esperamos el futuro, lo construimos"
8. Responde SIEMPRE en español`,
        en: `You are JOE, the AI assistant from ORION TECH for professional plumbing service estimation in Bay Area, California.

🏢 ABOUT ORION TECH:
- Professional pricing system for plumbing services
- 1,350+ cataloged services across 8 main categories
- Coverage: Bay Area, California
- Lead Rate: Most competitive in the market
- Methodology: Good/Better/Best pricing

📋 PRICE BOOK CATEGORIES:
1. New Construction (200 services): Complete systems for new projects
2. Multifamily/Buildings (150 services): Housing complexes
3. Renovation/Remodeling (150 services): System upgrades
4. Total/Partial Repipe (150 services): Replacement in copper, PEX, etc.
5. Custom/High-End (200 services): Luxury personalized projects
6. Commercial (200 services): Restaurants and commercial establishments
7. Industrial (150 services): High pressure, specialized plants
8. Service & Maintenance (250 services): Repairs and emergencies

⚡ STRICT RULES:
1. ONLY answer about plumbing, estimates, and ORION Price Book services
2. Always mention Good/Better/Best methodology when relevant
3. Cite UPC 2024, IPC 2021, OSHA 29 CFR 1926 codes when applicable
4. Mention suppliers: Ferguson Enterprises, HD Supply, Winsupply
5. If asked about non-plumbing topics, politely redirect
6. Be professional, technical, and accurate
7. ORION Slogan: "We don't wait for the future, we build it"
8. ALWAYS respond in English`,
        zh: `你是JOE，来自ORION TECH的AI助手，专门为加州湾区的专业管道服务估算。

🏢 关于ORION TECH:
- 管道服务专业定价系统
- 8个主要类别中1,350+编目服务
- 覆盖范围：加州湾区
- 引导率：市场上最具竞争力
- 方法：Good/Better/Best定价

⚡ 严格规则：
1. 只回答关于管道、估算和ORION价格手册服务的问题
2. 相关时始终提及Good/Better/Best方法
3. 适用时引用UPC 2024、IPC 2021、OSHA 29 CFR 1926代码
4. 提及供应商：Ferguson、HD Supply、Winsupply
5. 如果询问非管道主题，请礼貌地重定向
6. 专业、技术和准确
7. ORION口号："我们不等待未来，我们建设未来"
8. 始终用中文回答`,
        pt: `Você é JOE, o assistente de IA da ORION TECH para estimativa de serviços profissionais de encanamento na Bay Area, Califórnia.

🏢 SOBRE ORION TECH:
- Sistema profissional de preços para serviços de encanamento
- 1.350+ serviços catalogados em 8 categorias principais
- Cobertura: Bay Area, Califórnia
- Taxa Lead: Mais competitiva do mercado
- Metodologia: Preços Good/Better/Best

⚡ REGRAS ESTRITAS:
1. APENAS responda sobre encanamento, estimativas e serviços do ORION Price Book
2. Sempre mencione a metodologia Good/Better/Best quando relevante
3. Cite códigos UPC 2024, IPC 2021, OSHA 29 CFR 1926 quando aplicável
4. Mencione fornecedores: Ferguson, HD Supply, Winsupply
5. Se perguntarem sobre tópicos não relacionados, redirecione educadamente
6. Seja profissional, técnico e preciso
7. Slogan ORION: "Não esperamos o futuro, nós o construímos"
8. SEMPRE responda em português`,
        fr: `Vous êtes JOE, l'assistant IA d'ORION TECH pour l'estimation de services de plomberie professionnels dans la Bay Area, Californie.

🏢 À PROPOS D'ORION TECH:
- Système professionnel de tarification pour services de plomberie
- 1350+ services catalogués dans 8 catégories principales
- Couverture: Bay Area, Californie
- Tarif Lead: Le plus compétitif du marché
- Méthodologie: Tarification Good/Better/Best

⚡ RÈGLES STRICTES:
1. Répondez UNIQUEMENT sur la plomberie, estimations et services ORION Price Book
2. Mentionnez toujours la méthodologie Good/Better/Best quand pertinent
3. Citez les codes UPC 2024, IPC 2021, OSHA 29 CFR 1926 si applicable
4. Mentionnez les fournisseurs: Ferguson, HD Supply, Winsupply
5. Si on vous pose des questions hors plomberie, redirigez poliment
6. Soyez professionnel, technique et précis
7. Slogan ORION: "Nous n'attendons pas l'avenir, nous le construisons"
8. Répondez TOUJOURS en français`
    },
    greetings: {
        es: 'Hola, buen día. Soy JOE, su asistente de plomería de ORION TECH aquí en Bay Area. Tenemos más de 1,350 servicios catalogados en 8 categorías. ¿En qué le puedo ayudar hoy?',
        en: 'Hey there! I\'m JOE, your plumbing assistant from ORION TECH right here in the Bay Area. We\'ve got over 1,350 services across 8 categories. What can I help you with today?',
        zh: '你好！我是JOE，来自ORION TECH的湾区专业管道估算AI助手。探索我们8个类别的1,350+服务。我能帮你什么？',
        pt: 'Olá! Sou JOE, seu assistente de IA da ORION TECH para estimativa de encanamento profissional na Bay Area. Explore nossas 8 categorias com 1.350+ serviços. Como posso ajudar?',
        fr: 'Bonjour! Je suis JOE, votre assistant IA d\'ORION TECH pour l\'estimation de plomberie professionnelle dans la Bay Area. Explorez nos 8 catégories avec 1350+ services. Comment puis-je vous aider?'
    }
};

// ORION TECH Price Book Knowledge Base
const PRICE_BOOK_KB = {
    company: 'ORION TECH',
    slogan: 'No esperamos el futuro, lo construimos',
    location: 'Bay Area, California',
    total_services: 1350,
    lead_rate: 'El más competitivo',
    categories: {
        'nueva_construccion': { name: 'Nueva Construcción', services: 200, code_range: 'NC-001→NC-200' },
        'multifamiliar': { name: 'Multifamiliar / Edificios', services: 150, code_range: 'MF-001→MF-150' },
        'renovacion': { name: 'Renovación / Remodelación', services: 150, code_range: 'RN-001→RN-150' },
        'repipe': { name: 'Repipe Total y Parcial', services: 150, code_range: 'RP-001→RP-150' },
        'custom': { name: 'Custom / Alta Gama', services: 200, code_range: 'CG-001→CG-200' },
        'comercial': { name: 'Comercial', services: 200, code_range: 'CM-001→CM-200' },
        'industrial': { name: 'Industrial', services: 150, code_range: 'IN-001→IN-150' },
        'servicio': { name: 'Servicio y Mantenimiento', services: 250, code_range: 'SM-001→SM-250' }
    },
    methodology: 'Good/Better/Best Pricing',
    sample_services: {
        'water_heater_50gal': { good: 2400, better: 3200, best: 4500, name: '50 Gallon Gas Water Heater Install' },
        'tankless_navien': { good: 5200, better: 6800, best: 8500, name: 'Tankless Water Heater Upgrade (Navien)' },
        'repipe_copper': { good: 2500, better: 3500, best: 4800, name: 'Repipe Total Copper' },
        'drain_cleaning': { good: 250, better: 400, best: 650, name: 'Drain Cleaning Professional' },
        'emergency_service': { good: 350, better: 550, best: 850, name: 'Emergency Plumbing Service' }
    },
    codes: ['UPC 2024', 'IPC 2021', 'OSHA 29 CFR 1926'],
    suppliers: ['Ferguson Enterprises', 'HD Supply', 'Winsupply', 'Pace Supply'],
    certifications: ['Licensed', 'Insured', 'Bonded', 'Bay Area Certified']
};

class JoeAssistant {
    constructor() {
        this.currentLang = 'en'; // Default to English
        this.conversationHistory = [];
        this.isOpen = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.voiceEnabled = true; // Voice ON by default
        this.currentAudio = null;
        this.greetingSpoken = false; // Track if greeting has been spoken
    }

    // Rotate API key on quota error
    rotateApiKey(provider) {
        const config = JOE_CONFIG.apis[provider];
        config.currentIndex = (config.currentIndex + 1) % config.keys.length;
        console.log(`[JOE] Rotated to ${provider} key index: ${config.currentIndex}`);
    }

    // Switch provider (Gemini <-> OpenAI)
    switchProvider() {
        JOE_CONFIG.currentProvider = JOE_CONFIG.currentProvider === 'gemini' ? 'openai' : 'gemini';
        console.log(`[JOE] Switched to provider: ${JOE_CONFIG.currentProvider}`);
    }

    // Call Gemini API
    async callGemini(userMessage) {
        const config = JOE_CONFIG.apis.gemini;
        const apiKey = config.keys[config.currentIndex];
        const systemPrompt = JOE_CONFIG.systemPrompt[this.currentLang];

        const response = await fetch(`${config.endpoint}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: systemPrompt + '\n\nUsuario: ' + userMessage }] }
                ],
                generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 429 || error.error?.message?.includes('quota')) {
                throw new Error('QUOTA_EXCEEDED');
            }
            throw new Error(error.error?.message || 'Gemini API Error');
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    }

    // Call OpenAI API
    async callOpenAI(userMessage) {
        const config = JOE_CONFIG.apis.openai;
        const apiKey = config.keys[config.currentIndex];
        const systemPrompt = JOE_CONFIG.systemPrompt[this.currentLang];

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 429) {
                throw new Error('QUOTA_EXCEEDED');
            }
            throw new Error(error.error?.message || 'OpenAI API Error');
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response';
    }

    // Gemini TTS using Browser SpeechSynthesis (fallback when APIs fail)
    async speakWithGemini(text, keyIndex = 0) {
        console.log(`[JOE TTS] 🔹 Using Gemini fallback (Browser Speech)...`);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.currentLang === 'es' ? 'es-MX' :
            this.currentLang === 'zh' ? 'zh-CN' :
                this.currentLang === 'pt' ? 'pt-BR' :
                    this.currentLang === 'fr' ? 'fr-FR' : 'en-US';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        return new Promise((resolve, reject) => {
            utterance.onend = () => {
                console.log('[JOE TTS] ✅ Browser Speech complete');
                resolve();
            };
            utterance.onerror = (e) => {
                console.error('[JOE TTS] Browser Speech error:', e);
                reject(e);
            };
            window.speechSynthesis.speak(utterance);
        });
    }

    // Text-to-Speech using OpenAI TTS API
    async speakResponse(text) {
        if (!this.voiceEnabled || !text) {
            console.log('[JOE TTS] Skipped - Voice:', this.voiceEnabled, 'Text:', !!text);
            return;
        }

        try {
            console.log('[JOE TTS] Starting TTS request...');

            // Stop any currently playing audio
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
            }

            // OPTION 1: Try Render Cloud TTS (works on all devices)
            try {
                console.log('[JOE TTS] 🌐 Trying Render Cloud TTS...');
                const cloudResponse = await fetch('https://orion-cloud.onrender.com/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text.substring(0, 500), lang: this.currentLang })
                });

                if (cloudResponse.ok) {
                    const blob = await cloudResponse.blob();
                    if (blob.size > 0) {
                        const audioUrl = URL.createObjectURL(blob);
                        this.currentAudio = new Audio(audioUrl);
                        await this.currentAudio.play();
                        console.log('[JOE TTS] ✅ Render Cloud TTS success!');
                        return;
                    }
                }
                console.warn('[JOE TTS] Cloud TTS empty or failed, trying OpenAI...');
            } catch (cloudError) {
                console.warn('[JOE TTS] Cloud TTS error:', cloudError.message);
            }

            // OPTION 2: Try OpenAI TTS directly
            const apiKey = JOE_CONFIG.apis.openai.keys[0];
            console.log('[JOE TTS] API Key length:', apiKey ? apiKey.length : 0);
            console.log('[JOE TTS] Text to speak:', text.substring(0, 100));

            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'tts-1',
                    input: text.substring(0, 4096), // TTS limit
                    voice: 'alloy', // Natural voice
                    response_format: 'mp3'
                })
            });

            console.log('[JOE TTS] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[JOE TTS] OpenAI Error:', response.status, errorText);

                // FALLBACK 2: Google TTS (good quality, free)
                try {
                    console.log('[JOE TTS] 🔄 Falling back to Google TTS...');
                    const lang = this.currentLang || 'es';
                    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.substring(0, 200))}&tl=${lang}&client=tw-ob`;
                    this.currentAudio = new Audio(googleTtsUrl);
                    this.currentAudio.onplay = () => console.log('[JOE TTS] ✅ Google TTS playing!');
                    this.currentAudio.onerror = (e) => console.error('[JOE TTS] Google TTS error:', e);
                    await this.currentAudio.play();
                    console.log('[JOE TTS] Google TTS successful');
                    return;
                } catch (googleError) {
                    console.warn('[JOE TTS] Google TTS failed, trying Browser Speech...');
                }

                // FALLBACK 3: Browser Speech (last resort)
                console.log('[JOE TTS] 🔄 Using Browser Speech (last resort)...');
                await this.speakWithGemini(text, 0);
                return;
            }

            const audioBlob = await response.blob();
            console.log('[JOE TTS] Audio blob size:', audioBlob.size);

            const audioUrl = URL.createObjectURL(audioBlob);
            this.currentAudio = new Audio(audioUrl);

            this.currentAudio.onplay = () => console.log('[JOE TTS] ✅ Audio playing!');
            this.currentAudio.onerror = (e) => console.error('[JOE TTS] Audio playback error:', e);

            await this.currentAudio.play();
            console.log('[JOE TTS] Play command sent');
        } catch (error) {
            console.error('[JOE TTS] Exception:', error);
            console.error('[JOE TTS] Error stack:', error.stack);

            // Emergency fallback: Try Google TTS first
            try {
                console.log('[JOE TTS] 🆘 Emergency: Trying Google TTS...');
                const lang = this.currentLang || 'es';
                const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.substring(0, 200))}&tl=${lang}&client=tw-ob`;
                this.currentAudio = new Audio(googleTtsUrl);
                await this.currentAudio.play();
                console.log('[JOE TTS] Google TTS successful');
                return;
            } catch (googleError) {
                console.warn('[JOE TTS] Google TTS failed, trying Browser Speech...');
            }

            // Final fallback: Browser Speech
            try {
                console.log('[JOE TTS] 🆘 Final fallback: Browser Speech...');
                await this.speakWithGemini(text, 0);
            } catch (fallbackError) {
                console.error('[JOE TTS] ❌ All TTS methods failed:', fallbackError);
            }
        }
    }

    // Toggle voice on/off
    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const btn = document.getElementById('joe-voice-btn');
        if (btn) {
            btn.textContent = this.voiceEnabled ? '🔊' : '🔇';
            btn.title = this.voiceEnabled ? 'Voice ON' : 'Voice OFF';
        }
        console.log(`[JOE] Voice ${this.voiceEnabled ? 'enabled' : 'disabled'}`);
    }

    // Smart API call with rotation and fallback
    async getResponse(userMessage) {
        try {
            if (JOE_CONFIG.currentProvider === 'gemini') {
                return await this.callGemini(userMessage);
            } else {
                return await this.callOpenAI(userMessage);
            }
        } catch (error) {
            console.error(`[JOE] API Error: ${error.message}`);

            if (error.message === 'QUOTA_EXCEEDED' && this.retryCount < this.maxRetries) {
                this.retryCount++;
                // First try rotating key in same provider
                this.rotateApiKey(JOE_CONFIG.currentProvider);
                // If still failing, switch provider
                if (this.retryCount > 1) {
                    this.switchProvider();
                }
                return await this.getResponse(userMessage);
            }

            this.retryCount = 0;
            return this.getFallbackResponse();
        }
    }

    // Fallback response when APIs fail
    getFallbackResponse() {
        const fallbacks = {
            es: 'Lo siento, estoy experimentando problemas técnicos. Por favor consulta el Price Book directamente o intenta más tarde.',
            en: 'Sorry, I\'m experiencing technical issues. Please consult the Price Book directly or try again later.',
            zh: '抱歉，我遇到了技术问题。请直接查阅价格手册或稍后重试。',
            pt: 'Desculpe, estou com problemas técnicos. Por favor consulte o Price Book diretamente ou tente mais tarde.',
            fr: 'Désolé, je rencontre des problèmes techniques. Veuillez consulter le Price Book directement ou réessayer plus tard.'
        };
        return fallbacks[this.currentLang];
    }

    // Get greeting message
    getGreeting() {
        return JOE_CONFIG.greetings[this.currentLang];
    }

    // Set language and update greeting
    setLanguage(lang) {
        if (['es', 'en', 'zh', 'pt', 'fr'].includes(lang)) {
            this.currentLang = lang;
            console.log(`[JOE] Language set to: ${lang}`);

            // Update subtitle if chat is open
            const subtitle = document.getElementById('joe-subtitle');
            if (subtitle) {
                subtitle.textContent = JOE_CONFIG.title[lang];
            }

            // Update greeting message if chat is open
            const messages = document.getElementById('joe-messages');
            if (messages && this.isOpen) {
                const firstMessage = messages.querySelector('.joe-message.joe-bot');
                if (firstMessage) {
                    firstMessage.textContent = this.getGreeting();
                }
            }
        }
    }

    // Create chat widget UI
    createWidget() {
        const widgetHTML = `
        <div id="joe-widget" class="joe-widget">
            <button id="joe-toggle" class="joe-toggle" onclick="joe.toggle()">
                <video src="images/joe_ai_avatar.mp4" autoplay loop muted playsinline class="joe-avatar-btn"></video>
            </button>
            <div id="joe-chat" class="joe-chat" style="display: none;">
                <div class="joe-header">
                    <img src="${JOE_CONFIG.avatar}" alt="JOE" class="joe-avatar">
                    <div class="joe-title">
                        <strong>JOE</strong>
                        <span id="joe-subtitle">${JOE_CONFIG.title[this.currentLang]}</span>
                    </div>
                    <button id="joe-voice-btn" class="joe-voice" onclick="joe.toggleVoice()" title="Voice ON">🔊</button>
                    <button class="joe-close" onclick="joe.toggle()">×</button>
                </div>
                <div id="joe-messages" class="joe-messages">
                    <div class="joe-message joe-bot">${this.getGreeting()}</div>
                </div>
                <div class="joe-input-area">
                    <input type="text" id="joe-input" placeholder="Escribe tu pregunta..." onkeypress="if(event.key==='Enter')joe.send()">
                    <button onclick="joe.send()">➤</button>
                </div>
            </div>
        </div>
        `;

        const widgetCSS = `
        <style>
        .joe-widget { position: fixed; bottom: 30px; right: 120px; z-index: 10001; font-family: 'Inter', sans-serif; }
        .joe-toggle { width: 70px; height: 70px; border-radius: 50%; border: 3px solid #00f5ff; background: rgba(3,7,18,0.95); cursor: pointer; padding: 5px; box-shadow: 0 0 30px rgba(0,245,255,0.5); transition: all 0.3s; animation: joePulse 2s infinite; }
        .joe-toggle:hover { transform: scale(1.1); box-shadow: 0 0 50px rgba(0,245,255,0.8); }
        @keyframes joePulse { 0%, 100% { box-shadow: 0 0 20px rgba(0,245,255,0.5); } 50% { box-shadow: 0 0 40px rgba(168,85,247,0.8); } }
        .joe-avatar-btn { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; cursor: pointer; transition: transform 0.2s; }
        .joe-avatar-btn:active { transform: scale(0.95); }
        .joe-chat { position: absolute; bottom: 80px; right: 0; width: 380px; height: 500px; background: rgba(3,7,18,0.98); border: 2px solid rgba(0,245,255,0.3); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 50px rgba(0,0,0,0.5); }
        .joe-header { display: flex; align-items: center; gap: 12px; padding: 16px; background: linear-gradient(90deg, rgba(0,245,255,0.1), transparent); border-bottom: 1px solid rgba(0,245,255,0.2); }
        .joe-avatar { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #00f5ff; }
        .joe-title { flex: 1; color: white; }
        .joe-title strong { font-family: 'Orbitron', monospace; color: #00f5ff; font-size: 1.2rem; display: block; }
        .joe-title span { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
        .joe-close { background: none; border: none; color: #00f5ff; font-size: 1.5rem; cursor: pointer; padding: 5px 10px; }
        .joe-voice { background: none; border: none; font-size: 1.3rem; cursor: pointer; padding: 5px; }
        .joe-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .joe-message { padding: 12px 16px; border-radius: 12px; max-width: 85%; line-height: 1.5; font-size: 0.9rem; }
        .joe-bot { background: rgba(0,245,255,0.1); border: 1px solid rgba(0,245,255,0.2); color: white; align-self: flex-start; }
        .joe-user { background: linear-gradient(135deg, #a855f7, #ec4899); color: white; align-self: flex-end; }
        .joe-input-area { display: flex; gap: 8px; padding: 16px; border-top: 1px solid rgba(0,245,255,0.2); background: rgba(0,0,0,0.3); }
        .joe-input-area input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(0,245,255,0.3); border-radius: 8px; padding: 12px; color: white; font-size: 0.9rem; }
        .joe-input-area input::placeholder { color: rgba(255,255,255,0.4); }
        .joe-input-area button { background: linear-gradient(135deg, #00f5ff, #a855f7); border: none; color: black; padding: 12px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .joe-typing { color: rgba(255,255,255,0.5); font-style: italic; }
        </style>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetCSS + widgetHTML);
    }


    // Toggle chat window
    async toggle() {
        this.isOpen = !this.isOpen;
        document.getElementById('joe-chat').style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) {
            document.getElementById('joe-input').focus();

            // Speak greeting only once when first opened
            if (!this.greetingSpoken && this.voiceEnabled) {
                console.log('[JOE] Attempting to speak greeting...');
                console.log('[JOE] Voice enabled:', this.voiceEnabled);
                console.log('[JOE] Greeting text:', this.getGreeting());
                console.log('[JOE] OpenAI Key configured:', !!JOE_CONFIG.apis.openai.keys[0]);
                await this.speakResponse(this.getGreeting());
                this.greetingSpoken = true;
            }
        }
    }


    // Send message
    async send() {
        const input = document.getElementById('joe-input');
        const message = input.value.trim();
        if (!message) return;

        const messagesDiv = document.getElementById('joe-messages');

        // Add user message
        messagesDiv.innerHTML += `<div class="joe-message joe-user">${message}</div>`;
        input.value = '';

        // Show typing indicator
        messagesDiv.innerHTML += `<div class="joe-message joe-bot joe-typing" id="joe-typing">...</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Get response
        const response = await this.getResponse(message);

        // Remove typing indicator and show response
        document.getElementById('joe-typing')?.remove();
        messagesDiv.innerHTML += `<div class="joe-message joe-bot">${response}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Speak the response (TTS)
        await this.speakResponse(response);
    }

    // Initialize
    init() {
        // Sync with page language if available, default to English
        const pageLanguage = localStorage.getItem('priceBookLang') || 'en';
        this.setLanguage(pageLanguage);

        this.createWidget();
        console.log('[JOE] AI Plumber Estimator initialized in', pageLanguage);

        // Listen for language changes from Price Book selector
        window.addEventListener('storage', (e) => {
            if (e.key === 'priceBookLang') {
                console.log('[JOE] Language changed to:', e.newValue);
                this.setLanguage(e.newValue);
            }
        });

        // Also watch for direct language selector clicks (backup method)
        setTimeout(() => {
            const langButtons = document.querySelectorAll('[data-lang]');
            langButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const newLang = btn.getAttribute('data-lang');
                    if (newLang) {
                        console.log('[JOE] Language selector clicked:', newLang);
                        this.setLanguage(newLang);
                    }
                });
            });
        }, 500);
    }
}

// Global instance
const joe = new JoeAssistant();

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => joe.init());
