/**
 * CHELA V14 - Massive Offline Database (100+ responses)
 * Autor: Antigravity
 * Fix: 50+ ES responses, 50+ EN responses for complete offline coverage
 */
(function () {
    if (document.getElementById('chela-boton-flotante')) return;
    console.log('🚀 CHELA V14 Iniciando...');

    const CHELA_IMG = 'https://agem2024.github.io/SEGURITI-USC/proposals/obando/assets/chela.png';

    // --- LANGUAGE STATE ---
    let currentLang = (window.CHELA_CONFIG && window.CHELA_CONFIG.language) ||
        localStorage.getItem('mcProposalLang') || 'es';

    // --- VOICE CONFIGURATION ---
    let synth = window.speechSynthesis;
    let voiceES = null;
    let voiceEN = null;

    function loadVoices() {
        const voices = synth.getVoices();
        voiceES = voices.find(v => v.name.includes('Paulina') || v.name.includes('Sabina') || v.name.includes('Helena'));
        if (!voiceES) voiceES = voices.find(v => v.lang.startsWith('es-'));
        if (!voiceES) voiceES = voices.find(v => v.lang.startsWith('es'));

        voiceEN = voices.find(v => v.name.includes('Samantha') || v.name.includes('Alex') || v.name.includes('Zira'));
        if (!voiceEN) voiceEN = voices.find(v => v.lang.startsWith('en-'));
        if (!voiceEN) voiceEN = voices.find(v => v.lang.startsWith('en'));

        console.log('🔊 Voces cargadas:', { ES: voiceES?.name, EN: voiceEN?.name });
    }
    if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;
    loadVoices();

    function speak(text) {
        if (!synth || !text) return;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        if (currentLang === 'en') {
            u.voice = voiceEN;
            u.lang = 'en-US';
        } else {
            u.voice = voiceES;
            u.lang = 'es-CO';
        }
        u.rate = 1.1;
        u.pitch = 1.1;
        synth.speak(u);
    }

    // --- EXPOSED API ---
    window.chela = {
        setLanguage: function (lang) {
            currentLang = lang;
            console.log('✅ CHELA Language set to:', lang);
        },
        getLanguage: function () {
            return currentLang;
        }
    };

    // --- ANTI-SPAM & KEYS ---
    let enviando = false;
    let ultimoEnvio = 0;
    let currentKeyIndex = 0;

    function getKeys() {
        const keys = [];
        if (window.CHELA_KEYS && typeof window.CHELA_KEYS.getKey === 'function') {
            const chelaKey = window.CHELA_KEYS.getKey();
            if (chelaKey) keys.push(chelaKey);
        }
        if (window.__MARIO_CONFIG__?.apiKey) keys.push(window.__MARIO_CONFIG__.apiKey);
        if (typeof window.__MARIO_CONFIG__?.getNextKey === 'function') {
            const k1 = window.__MARIO_CONFIG__.getNextKey();
            if (k1 && !keys.includes(k1)) keys.push(k1);
        }
        const stored = localStorage.getItem('mario_api_key');
        if (stored) {
            try {
                const k = stored.startsWith('AIza') ? stored : atob(stored);
                if (!keys.includes(k)) keys.push(k);
            } catch (e) { }
        }
        return keys;
    }

    function getCurrentKey() {
        const keys = getKeys();
        if (keys.length === 0) return null;
        return keys[currentKeyIndex % keys.length];
    }

    // =========================================================================
    // OFFLINE DATABASE - 100+ RESPONSES (50+ ES, 50+ EN)
    // =========================================================================
    const OFFLINE_DB = {
        es: [
            // --- SALUDOS Y DESPEDIDAS ---
            { keys: ['hola', 'buenas', 'saludo', 'buenos', 'ola'], resp: "¡Hola! Soy Chela de ORION Tech. ¿Listo para modernizar el municipio?" },
            { keys: ['gracias', 'agradec', 'te lo agradezco'], resp: "Con gusto. ORION Tech está para servir a Obando." },
            { keys: ['adios', 'chao', 'hasta luego', 'nos vemos'], resp: "Hasta luego. Quedamos atentos para iniciar la implementación." },
            { keys: ['buen dia', 'buen día'], resp: "¡Buen día! ¿En qué puedo ayudarle hoy con el Municipio Digital?" },
            { keys: ['buenas noches'], resp: "Buenas noches. Estoy disponible 24/7 para cualquier consulta." },
            { keys: ['buenas tardes'], resp: "Buenas tardes. ¿Cómo puedo ayudarle con la transformación digital?" },

            // --- IDENTIDAD ---
            { keys: ['nombre', 'quien er', 'quien es', 'llamas', 'eres tu', 'tu nombre'], resp: "Soy Chela, representante de ventas de ORION Tech. Traigo la solución de Municipio Digital." },
            { keys: ['orion', 'empresa', 'compañia', 'compañía'], resp: "ORION Tech es líder en transformación digital para gobiernos locales en Colombia." },
            { keys: ['donde', 'ubicacion', 'ubicación', 'oficina'], resp: "Tenemos sede en San José, California y equipos en Colombia, México y Perú." },
            { keys: ['contacto', 'telefono', 'teléfono', 'llamar'], resp: "Puede contactarnos al +1 669-234-2444 o por WhatsApp." },
            { keys: ['correo', 'email', 'mail'], resp: "Nuestro correo es info@orion-tech.com. Respondemos en menos de 2 horas." },

            // --- PRECIOS Y PLANES ---
            { keys: ['precio', 'costo', 'vale', 'cuanto', 'cuánto', 'tarifa'], resp: "La inversión inicial es de $15 millones COP con mensualidad de $3 millones. Garantizamos ahorro de 500 millones anuales." },
            { keys: ['paquete', 'plan', 'tier', 'nivel', 'opcion', 'opción'], resp: "Tenemos 3 planes: BÁSICO ($1.5M/mes), AVANZADO ($3M/mes) y ENTERPRISE ($5M/mes). ¿Cuál te interesa?" },
            { keys: ['basico', 'básico', 'starter', 'inicial'], resp: "El plan Básico incluye: Bot WhatsApp, PQRS automático, y Dashboard básico. $1.5M/mes." },
            { keys: ['avanzado', 'medio', 'standard'], resp: "El plan Avanzado incluye todo lo Básico + Transparencia, Reportes y Soporte prioritario. $3M/mes." },
            { keys: ['enterprise', 'completo', 'premium', 'full'], resp: "El plan Enterprise incluye TODO + IA avanzada, analítica predictiva y gerente de cuenta dedicado. $5M/mes." },
            { keys: ['descuento', 'rebaja', 'promocion', 'promoción'], resp: "Tenemos 20% de descuento si firma contrato anual. También piloto gratis de 30 días." },
            { keys: ['pago', 'forma de pago', 'tarjeta', 'transferencia'], resp: "Aceptamos transferencia bancaria, tarjeta de crédito y PSE. Facturación mensual o anual." },
            { keys: ['factura', 'recibo'], resp: "Emitimos factura electrónica válida ante la DIAN. Todo en regla." },
            { keys: ['presupuest', 'cotizacion', 'cotización'], resp: "Puedo enviarle una cotización formal por correo. ¿Me comparte su email?" },
            { keys: ['inversion', 'inversión', 'retorno', 'roi'], resp: "El ROI es de 10x. Invierte $15M, ahorra $500M anuales. Se paga solo en el primer mes." },

            // --- IMPLEMENTACIÓN Y TIEMPO ---
            { keys: ['tiempo', 'demora', 'tarda', 'cuando', 'cuándo', 'plazo'], resp: "Garantizamos implementación operativa en solo 30 días calendario." },
            { keys: ['implement', 'instala', 'configura'], resp: "La implementación es guiada por nuestros ingenieros. No requiere equipo técnico suyo." },
            { keys: ['capacita', 'entrena', 'curso'], resp: "Incluimos capacitación presencial y virtual para todo el personal de la Alcaldía." },
            { keys: ['requisito', 'necesit', 'requiere'], resp: "Solo necesitamos acceso a internet y un número de WhatsApp Business. Nosotros ponemos todo lo demás." },
            { keys: ['paso', 'proceso', 'etapa'], resp: "Proceso: 1) Firma contrato, 2) Configuración (7 días), 3) Capacitación (7 días), 4) Piloto (14 días), 5) Lanzamiento." },
            { keys: ['migracion', 'migración', 'datos actuales'], resp: "Migramos sus datos actuales sin costo adicional. Todo queda integrado." },

            // --- FUNCIONALIDADES ---
            { keys: ['fila', 'cola', 'espera', 'turno'], resp: "Nuestra meta es Cero Filas. Todo trámite se digitaliza vía WhatsApp." },
            { keys: ['tramite', 'trámite', 'servicio'], resp: "Digitalizamos todos los trámites: certificados, pagos, PQRS, citas y más." },
            { keys: ['whatsapp', 'bot', 'chat'], resp: "El bot de WhatsApp responde 24/7. Registra PQRS automáticamente y agenda citas." },
            { keys: ['pqrs', 'peticion', 'petición', 'queja', 'reclamo'], resp: "El módulo PQRS registra automáticamente todas las solicitudes ciudadanas y genera tickets." },
            { keys: ['pago', 'impuesto', 'predial', 'recaudo'], resp: "Integramos pagos en línea con PSE. Los ciudadanos pagan desde WhatsApp." },
            { keys: ['certificado', 'documento', 'constancia'], resp: "Los certificados se generan automáticamente y llegan por WhatsApp o email." },
            { keys: ['cita', 'agenda', 'turno'], resp: "El ciudadano agenda citas desde WhatsApp. El sistema asigna horarios disponibles." },
            { keys: ['reporte', 'informe', 'estadistica', 'estadística'], resp: "Generamos reportes automáticos: satisfacción ciudadana, tiempos de respuesta, volumen de trámites." },
            { keys: ['dashboard', 'panel', 'tablero'], resp: "El Dashboard muestra métricas en tiempo real: trámites, satisfacción, tiempos de respuesta." },
            { keys: ['notificacion', 'notificación', 'alerta', 'aviso'], resp: "Enviamos notificaciones automáticas por WhatsApp: recordatorios de pago, seguimiento PQRS." },
            { keys: ['transparencia', 'contrat', 'licita'], resp: "El módulo de Transparencia muestra todas las contrataciones en tiempo real." },
            { keys: ['archivo', 'historial', 'registro'], resp: "Todo queda registrado en la nube con historial completo y búsqueda avanzada." },

            // --- SEGURIDAD Y DATOS ---
            { keys: ['segur', 'dato', 'privacidad', 'protec', 'hack'], resp: "ORION Tech utiliza encriptación de grado militar. Los datos son intocables." },
            { keys: ['nube', 'cloud', 'servidor'], resp: "Usamos servidores en AWS con certificación SOC2 y respaldo en 3 ubicaciones." },
            { keys: ['backup', 'respaldo', 'copia'], resp: "Respaldos automáticos cada hora. Recuperación inmediata ante cualquier incidente." },
            { keys: ['ley', 'legal', 'normativa', 'habeas'], resp: "Cumplimos con Ley 1581 de Protección de Datos y normativas de Gobierno Digital." },
            { keys: ['auditoria', 'auditoría', 'control'], resp: "Sistema de auditoría completo. Cada acción queda registrada con usuario, fecha y hora." },

            // --- SOPORTE ---
            { keys: ['soporte', 'ayuda', 'asisten', 'problema'], resp: "Soporte técnico 24/7 directo con nuestros ingenieros. Respuesta en menos de 15 minutos." },
            { keys: ['actualiza', 'version', 'versión', 'update'], resp: "Actualizaciones automáticas sin costo adicional. Siempre tendrá la última versión." },
            { keys: ['garantia', 'garantía'], resp: "Garantía de satisfacción 100%. Si no cumple expectativas, devolvemos el dinero." },
            { keys: ['error', 'falla', 'bug', 'no funciona'], resp: "Reportando al equipo de soporte. Generalmente resolvemos en menos de 2 horas." },

            // --- CONTEXTO OBANDO ---
            { keys: ['embera', 'chami', 'indigena', 'indígena'], resp: "Respetamos profundamente la comunidad Emberá Chamí. El sistema está adaptado culturalmente." },
            { keys: ['obando', 'municipio', 'alcald'], resp: "ORION Tech ya trabaja con la Alcaldía de Obando. Somos expertos en gobierno digital." },
            { keys: ['valle', 'cauca'], resp: "Conocemos el Valle del Cauca. Entendemos las necesidades de los municipios de la región." },
            { keys: ['comunidad', 'ciudadan', 'gente', 'pueblo'], resp: "Nuestra misión es conectar a los ciudadanos con su gobierno de forma fácil y rápida." },
            { keys: ['rural', 'campo', 'vereda'], resp: "El sistema funciona con conexión básica. Ideal para zonas rurales con señal limitada." },

            // --- COMPETENCIA Y DIFERENCIACIÓN ---
            { keys: ['competencia', 'otro', 'alternativa', 'diferent'], resp: "ORION Tech es la única empresa con experiencia real en municipios colombianos pequeños." },
            { keys: ['mejor', 'ventaja', 'beneficio'], resp: "Ventajas: 30 días implementación, soporte 24/7, ahorro garantizado, y experiencia local." },
            { keys: ['porque', 'por qué', 'razon', 'razón'], resp: "Porque otros prometen y no cumplen. Nosotros tenemos casos de éxito verificables." },
            { keys: ['caso', 'exito', 'éxito', 'ejemplo', 'referencia'], resp: "Tenemos casos de éxito en varios municipios. Puedo conectarle con alcaldes que ya usan ORION." },
            { keys: ['testimonio', 'opinion', 'opinión', 'reseña'], resp: "El 98% de nuestros clientes nos recomiendan. Puedo compartir testimonios verificados." },

            // --- DEMO Y SIGUIENTE PASO ---
            { keys: ['demo', 'mostrar', 'ejemplo', 'probar', 'prueba'], resp: "¡Claro! Puedo agendar una demostración en vivo. ¿Qué día te queda bien?" },
            { keys: ['reunion', 'reunión', 'cita', 'agendar'], resp: "Agendemos una reunión. ¿Prefiere presencial o virtual?" },
            { keys: ['empezar', 'iniciar', 'comenzar', 'arrancar'], resp: "¡Excelente! El primer paso es firmar el contrato. Puedo enviárselo hoy mismo." },
            { keys: ['contrato', 'firmar', 'acuerdo'], resp: "El contrato es simple: 12 páginas, sin letra pequeña. Puedo explicar cada cláusula." },
            { keys: ['piloto', 'trial', 'gratis'], resp: "Ofrecemos piloto de 30 días sin compromiso. Si no le gusta, no paga nada." },
            { keys: ['pensar', 'decidir', 'consultar', 'jefe'], resp: "Entiendo. ¿Quiere que prepare material para presentar al equipo directivo?" },
            { keys: ['documento', 'pdf', 'presentacion', 'presentación', 'material'], resp: "Puedo enviarle un PDF ejecutivo con todos los detalles. ¿Cuál es su correo?" },

            // --- OBJECIONES ---
            { keys: ['caro', 'costoso', 'mucho dinero', 'no alcanza'], resp: "Entiendo la preocupación. Pero $3M/mes es menos que un salario mínimo. Y ahorra $500M al año." },
            { keys: ['no confio', 'no confío', 'desconfia', 'riesgo'], resp: "Es normal dudar. Por eso ofrecemos piloto gratis y garantía de devolución." },
            { keys: ['despues', 'después', 'luego', 'otro momento'], resp: "Cada día sin automatizar es dinero perdido. Pero respeto sus tiempos. ¿Cuándo retomamos?" },
            { keys: ['complicado', 'dificil', 'difícil', 'tecnico', 'técnico'], resp: "Nosotros manejamos toda la parte técnica. Su equipo solo necesita capacitación básica." },
            { keys: ['no tengo tiempo', 'ocupado'], resp: "Entiendo que está ocupado. Por eso la implementación no interrumpe operaciones. Es paralela." },
            { keys: ['funciona', 'sirve', 'real'], resp: "100% funcional. Puedo hacer demo en vivo ahora mismo si gusta." }
        ],
        en: [
            // --- GREETINGS ---
            { keys: ['hello', 'hi', 'hey', 'greetings'], resp: "Hello! I'm Chela from ORION Tech. Ready to modernize the municipality?" },
            { keys: ['good morning'], resp: "Good morning! How can I help you with the Digital Municipality today?" },
            { keys: ['good afternoon'], resp: "Good afternoon! I'm here to answer all your questions about ORION Tech." },
            { keys: ['good evening', 'good night'], resp: "Good evening. I'm available 24/7 for any questions." },
            { keys: ['thanks', 'thank you', 'appreciate'], resp: "My pleasure. ORION Tech is here to serve Obando." },
            { keys: ['bye', 'goodbye', 'see you'], resp: "Goodbye. We're ready to start implementation whenever you are." },

            // --- IDENTITY ---
            { keys: ['name', 'who are', 'your name', 'introduce'], resp: "I'm Chela, Senior Sales Representative at ORION Tech. I bring the Digital Municipality solution." },
            { keys: ['orion', 'company', 'business'], resp: "ORION Tech is a leader in digital transformation for local governments in Colombia." },
            { keys: ['where', 'location', 'office', 'based'], resp: "We have headquarters in San Jose, California and teams in Colombia, Mexico, and Peru." },
            { keys: ['contact', 'phone', 'call'], resp: "You can reach us at +1 669-234-2444 or via WhatsApp." },
            { keys: ['email', 'mail'], resp: "Our email is info@orion-tech.com. We respond within 2 hours." },

            // --- PRICING ---
            { keys: ['price', 'cost', 'how much', 'rate', 'fee'], resp: "The initial investment is $15M COP with a $3M monthly fee. We guarantee 500M annual savings." },
            { keys: ['package', 'plan', 'tier', 'option', 'level'], resp: "We have 3 plans: BASIC ($1.5M/month), ADVANCED ($3M/month), and ENTERPRISE ($5M/month). Which interests you?" },
            { keys: ['basic', 'starter', 'entry'], resp: "Basic plan includes: WhatsApp Bot, automatic PQRS, and basic Dashboard. $1.5M/month." },
            { keys: ['advanced', 'standard', 'middle'], resp: "Advanced includes Basic + Transparency, Reports, and priority support. $3M/month." },
            { keys: ['enterprise', 'premium', 'full', 'complete'], resp: "Enterprise includes EVERYTHING + advanced AI, predictive analytics, and dedicated account manager. $5M/month." },
            { keys: ['discount', 'offer', 'promotion', 'deal'], resp: "We offer 20% discount for annual contracts. Also a free 30-day pilot." },
            { keys: ['payment', 'pay', 'credit card', 'transfer'], resp: "We accept bank transfer, credit card, and PSE. Monthly or annual billing." },
            { keys: ['invoice', 'receipt', 'billing'], resp: "We issue electronic invoices valid with DIAN. Everything compliant." },
            { keys: ['quote', 'estimate', 'proposal'], resp: "I can send you a formal quote by email. Can you share your email?" },
            { keys: ['invest', 'roi', 'return'], resp: "ROI is 10x. Invest $15M, save $500M annually. Pays for itself in the first month." },

            // --- IMPLEMENTATION ---
            { keys: ['time', 'long', 'duration', 'when', 'deadline'], resp: "We guarantee full implementation in just 30 calendar days." },
            { keys: ['implement', 'install', 'setup', 'configure'], resp: "Implementation is guided by our engineers. No technical team needed on your end." },
            { keys: ['training', 'learn', 'course', 'teach'], resp: "We include in-person and virtual training for all City Hall staff." },
            { keys: ['require', 'need', 'prerequisite'], resp: "You only need internet access and a WhatsApp Business number. We provide everything else." },
            { keys: ['step', 'process', 'phase'], resp: "Process: 1) Sign contract, 2) Setup (7 days), 3) Training (7 days), 4) Pilot (14 days), 5) Launch." },
            { keys: ['migration', 'migrate', 'existing data'], resp: "We migrate your existing data at no additional cost. Everything integrated." },

            // --- FEATURES ---
            { keys: ['line', 'queue', 'wait', 'turn'], resp: "Our goal is Zero Lines. All procedures are digitized via WhatsApp." },
            { keys: ['procedure', 'service', 'paperwork'], resp: "We digitize all procedures: certificates, payments, PQRS, appointments, and more." },
            { keys: ['whatsapp', 'bot', 'chat', 'message'], resp: "The WhatsApp bot responds 24/7. It registers PQRS automatically and schedules appointments." },
            { keys: ['pqrs', 'petition', 'complaint', 'claim'], resp: "The PQRS module automatically registers all citizen requests and generates tickets." },
            { keys: ['payment', 'tax', 'property', 'collect'], resp: "We integrate online payments with PSE. Citizens pay directly from WhatsApp." },
            { keys: ['certificate', 'document', 'proof'], resp: "Certificates are generated automatically and delivered via WhatsApp or email." },
            { keys: ['appointment', 'schedule', 'book'], resp: "Citizens schedule appointments via WhatsApp. The system assigns available slots." },
            { keys: ['report', 'statistics', 'metrics', 'analytics'], resp: "We generate automatic reports: citizen satisfaction, response times, procedure volume." },
            { keys: ['dashboard', 'panel', 'board'], resp: "The Dashboard shows real-time metrics: procedures, satisfaction, response times." },
            { keys: ['notification', 'alert', 'reminder'], resp: "We send automatic WhatsApp notifications: payment reminders, PQRS updates." },
            { keys: ['transparency', 'contract', 'bidding'], resp: "The Transparency module shows all contracts in real time." },
            { keys: ['archive', 'history', 'record', 'log'], resp: "Everything is stored in the cloud with complete history and advanced search." },

            // --- SECURITY ---
            { keys: ['secur', 'data', 'privacy', 'protect', 'hack', 'safe'], resp: "ORION Tech uses military-grade encryption. Your data is untouchable." },
            { keys: ['cloud', 'server', 'hosting'], resp: "We use AWS servers with SOC2 certification and backup in 3 locations." },
            { keys: ['backup', 'restore', 'recovery'], resp: "Automatic backups every hour. Immediate recovery from any incident." },
            { keys: ['law', 'legal', 'complian', 'regulation'], resp: "We comply with Law 1581 on Data Protection and Digital Government regulations." },
            { keys: ['audit', 'control', 'track'], resp: "Complete audit system. Every action is logged with user, date, and time." },

            // --- SUPPORT ---
            { keys: ['support', 'help', 'assist', 'problem'], resp: "24/7 technical support directly with our engineers. Response in under 15 minutes." },
            { keys: ['update', 'version', 'upgrade'], resp: "Automatic updates at no extra cost. You'll always have the latest version." },
            { keys: ['guarantee', 'warranty'], resp: "100% satisfaction guarantee. If it doesn't meet expectations, we refund your money." },
            { keys: ['error', 'bug', 'issue', 'broken'], resp: "Reporting to support team. We typically resolve issues in under 2 hours." },

            // --- LOCAL CONTEXT ---
            { keys: ['embera', 'chami', 'indigenous'], resp: "We deeply respect the Emberá Chamí community. The system is culturally adapted." },
            { keys: ['obando', 'municipality', 'mayor', 'city hall'], resp: "ORION Tech already works with the Mayor's Office of Obando. We're experts in digital government." },
            { keys: ['valle', 'cauca', 'region'], resp: "We know Valle del Cauca. We understand the needs of municipalities in the region." },
            { keys: ['community', 'citizen', 'people', 'resident'], resp: "Our mission is to connect citizens with their government easily and quickly." },
            { keys: ['rural', 'remote', 'village'], resp: "The system works with basic connectivity. Ideal for rural areas with limited signal." },

            // --- COMPETITION ---
            { keys: ['competition', 'competitor', 'alternative', 'other'], resp: "ORION Tech is the only company with real experience in small Colombian municipalities." },
            { keys: ['better', 'advantage', 'benefit'], resp: "Advantages: 30-day implementation, 24/7 support, guaranteed savings, and local experience." },
            { keys: ['why', 'reason'], resp: "Because others promise and don't deliver. We have verifiable success stories." },
            { keys: ['case', 'success', 'example', 'reference'], resp: "We have success cases in several municipalities. I can connect you with mayors already using ORION." },
            { keys: ['testimonial', 'review', 'feedback'], resp: "98% of our clients recommend us. I can share verified testimonials." },

            // --- NEXT STEPS ---
            { keys: ['demo', 'show', 'example', 'try', 'test'], resp: "Absolutely! I can schedule a live demo. What day works for you?" },
            { keys: ['meeting', 'appointment', 'schedule', 'call'], resp: "Let's schedule a meeting. Do you prefer in-person or virtual?" },
            { keys: ['start', 'begin', 'get started'], resp: "Excellent! The first step is signing the contract. I can send it today." },
            { keys: ['contract', 'sign', 'agreement'], resp: "The contract is simple: 12 pages, no fine print. I can explain each clause." },
            { keys: ['pilot', 'trial', 'free'], resp: "We offer a 30-day pilot with no commitment. If you don't like it, you pay nothing." },
            { keys: ['think', 'decide', 'consult', 'boss'], resp: "I understand. Would you like me to prepare materials to present to the leadership team?" },
            { keys: ['document', 'pdf', 'presentation', 'brochure'], resp: "I can send you an executive PDF with all the details. What's your email?" },

            // --- OBJECTIONS ---
            { keys: ['expensive', 'costly', 'too much', 'afford'], resp: "I understand. But $3M/month is less than one minimum wage. And you save $500M yearly." },
            { keys: ['trust', 'doubt', 'risk', 'skeptic'], resp: "It's normal to have doubts. That's why we offer a free pilot and money-back guarantee." },
            { keys: ['later', 'future', 'another time', 'not now'], resp: "Every day without automation is lost money. But I respect your timing. When shall we reconnect?" },
            { keys: ['complicated', 'difficult', 'hard', 'technical'], resp: "We handle all the technical aspects. Your team only needs basic training." },
            { keys: ['busy', 'no time'], resp: "I understand you're busy. That's why implementation doesn't interrupt operations. It's parallel." },
            { keys: ['work', 'real', 'actually'], resp: "100% functional. I can do a live demo right now if you'd like." }
        ]
    };

    function getOfflineResponse(text) {
        const t = text.toLowerCase();
        const db = OFFLINE_DB[currentLang] || OFFLINE_DB['es'];
        for (const entry of db) {
            if (entry.keys.some(k => t.includes(k))) return entry.resp;
        }
        return currentLang === 'en'
            ? "I understand. The Digital Municipality connects people with the Mayor's Office. Would you like a demo?"
            : "Entiendo. El Municipio Digital conecta a la gente con la Alcaldía. ¿Te gustaría ver una demostración?";
    }

    // --- STYLES ---
    const estilo = document.createElement('style');
    estilo.textContent = `
        #chela-boton-flotante {
            position: fixed; bottom: 20px; right: 20px; width: 70px; height: 70px;
            border-radius: 50%; background-color: #00B050; background-image: url('${CHELA_IMG}');
            background-size: cover; border: 3px solid #00B050; box-shadow: 0 4px 15px rgba(0,176,80,0.5);
            cursor: pointer; z-index: 2147483647; transition: transform 0.2s;
        }
        #chela-boton-flotante:hover { transform: scale(1.1); }
        #chela-ventana {
            display: none; position: fixed; bottom: 100px; right: 20px; width: 350px; height: 480px;
            background: white; border-radius: 15px; box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 2147483647; flex-direction: column; overflow: hidden; border: 1px solid #ddd;
            font-family: Arial, sans-serif;
        }
        #chela-ventana.visible { display: flex; }
        #chela-cabecera { background: #00B050; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        #chela-mensajes { flex: 1; padding: 15px; overflow-y: auto; background-color: #f9f9f9; display: flex; flex-direction: column; gap: 10px; }
        .chela-msg { padding: 10px 15px; border-radius: 10px; max-width: 80%; font-size: 14px; line-height: 1.4; }
        .chela-msg.bot { background: white; border: 1px solid #eee; align-self: flex-start; color: #333; }
        .chela-msg.user { background: #00B050; color: white; align-self: flex-end; }
        #chela-input-area { padding: 15px; background: white; border-top: 1px solid #eee; display: flex; gap: 10px; }
        #chela-input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 20px; outline: none; }
        #chela-enviar { background: #00B050; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px; }
        #chela-enviar:disabled { background: #ccc; cursor: not-allowed; }
    `;
    document.head.appendChild(estilo);

    // --- UI ELEMENTS ---
    const boton = document.createElement('div');
    boton.id = 'chela-boton-flotante';

    const ventana = document.createElement('div');
    ventana.id = 'chela-ventana';
    ventana.innerHTML = `
        <div id="chela-cabecera">
            <strong>🌿 CHELA (ORION Tech)</strong>
            <button id="chela-cerrar" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">✕</button>
        </div>
        <div id="chela-mensajes"></div>
        <div id="chela-input-area">
            <input type="text" id="chela-input" placeholder="Escribe aquí..." autocomplete="off">
            <button id="chela-enviar">➤</button>
        </div>
    `;

    document.body.appendChild(boton);
    document.body.appendChild(ventana);

    const input = document.getElementById('chela-input');
    const enviarBtn = document.getElementById('chela-enviar');
    const mensajesDiv = document.getElementById('chela-mensajes');

    let abierto = false;
    let saludado = false;

    function getGreeting() {
        return currentLang === 'en'
            ? "Hello! I'm Chela from ORION Tech. How can I help you?"
            : "¡Hola! Soy Chela de ORION Tech. ¿En qué puedo ayudarte?";
    }

    function toggle() {
        abierto = !abierto;
        ventana.classList.toggle('visible', abierto);
        if (abierto) {
            input.focus();
            input.placeholder = currentLang === 'en' ? "Type here..." : "Escribe aquí...";
            if (!saludado) {
                const saludo = getGreeting();
                addMsg('bot', saludo);
                saludado = true;
            }
        }
    }

    boton.onclick = toggle;
    document.getElementById('chela-cerrar').onclick = toggle;

    function addMsg(role, text) {
        const d = document.createElement('div');
        d.className = `chela-msg ${role === 'bot' ? 'bot' : 'user'}`;
        d.textContent = text;
        mensajesDiv.appendChild(d);
        mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
        if (role === 'bot' && text !== '...') speak(text);
        return d;
    }

    // --- GEMINI API ---
    async function callGemini(txt, key) {
        const systemPrompt = currentLang === 'en' ? `
You are CHELA, Senior Sales Representative at ORION Tech.
YOUR GOAL: Persuade the Mayor to acquire the "Digital Municipality" platform.
YOUR ATTITUDE: Professional, persuasive, tech-savvy, but friendly.

RESPOND ONLY IN ENGLISH. Do NOT mix languages.

SALES INFO (Digital Municipality):
- Zero lines for citizens.
- 500 million annual savings in paperwork and overtime.
- Total transparency in contracting.
- Implementation in 30 days guaranteed.
- 24/7 ORION Tech support.
        `.trim() : `
Eres CHELA, Representante de Ventas Senior de ORION Tech.
TU OBJETIVO: Persuadir al Alcalde para adquirir la plataforma "Municipio Digital".
TU ACTITUD: Profesional, persuasiva, tecnológica, pero amable.

RESPONDE ÚNICAMENTE EN ESPAÑOL. NO MEZCLES IDIOMAS.

INFORMACIÓN DE VENTA (Municipio Digital):
- Cero filas para los ciudadanos.
- Ahorro de 500 millones anuales en papelería y horas extra.
- Transparencia total en contratación.
- Implementación en 30 días garantizada.
- Soporte 24/7 de ORION Tech.
        `.trim();

        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: txt }] }]
                })
            });

            if (!res.ok) throw new Error("API_FAIL_" + res.status);

            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || getOfflineResponse(txt);

        } catch (e) {
            console.warn("⚠️ API Error. Usando Offline.", e);
            return getOfflineResponse(txt);
        }
    }

    async function enviar() {
        const txt = input.value.trim();
        if (!txt) return;

        const ahora = Date.now();
        if (enviando) return;
        if (ahora - ultimoEnvio < 1000) return;
        enviando = true;
        ultimoEnvio = ahora;
        enviarBtn.disabled = true;

        input.value = '';
        addMsg('user', txt);

        const key = getCurrentKey();
        if (!key) {
            console.warn("No API Keys. Modo Offline Forzado.");
            setTimeout(() => {
                addMsg('bot', getOfflineResponse(txt));
                enviando = false;
                enviarBtn.disabled = false;
            }, 500);
            return;
        }

        const loadingMsg = addMsg('bot', '...');

        try {
            const reply = await callGemini(txt, key);
            loadingMsg.textContent = reply;
            speak(reply);
        } catch (e) {
            loadingMsg.textContent = getOfflineResponse(txt);
            speak(loadingMsg.textContent);
        } finally {
            enviando = false;
            enviarBtn.disabled = false;
        }
    }

    input.onkeydown = (e) => { if (e.key === 'Enter' && !enviando) enviar(); };
    enviarBtn.onclick = () => { if (!enviando) enviar(); };

    // Log count
    const totalResponses = OFFLINE_DB.es.length + OFFLINE_DB.en.length;
    console.log(`✅ CHELA V14 Lista. Idioma: ${currentLang}. Respuestas offline: ${totalResponses}`);
})();
