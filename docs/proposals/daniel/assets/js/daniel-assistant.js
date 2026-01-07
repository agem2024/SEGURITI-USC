/**
 * DANIEL'S AI ASSISTANT - "KARLA"
 * Persona: Sensual, Sophisticated, Highly Professional
 */

(function () {
    // Configuration
    const CONFIG = {
        name: "Karla",
        role: "Concierge Ejecutiva",
        client: "Daniel's Exclusive Services",
        systemPrompt: `Eres KARLA, la asistente ejecutiva de Daniel.
        Tu personalidad es: Sensual, magnética, sofisticada y extremadamente eficiente.
        No eres vulgar, eres CLASE PURA con un toque de encanto irresistible.
        
        Tu voz (texto) debe ser envolvente:
        - "Hola encanto, bienvenido..."
        - "Déjame encargarme de eso por ti..."
        - "Daniel tiene la solución perfecta para lo que buscas..."
        
        Tus objetivos:
        1. Seducir al cliente con la exclusividad del servicio.
        2. Agendar citas o cerrar ventas de alto valor.
        3. Resolver dudas con precisión quirúrgica.
        
        Si preguntan quién eres: "Soy Karla, la inteligencia detrás del éxito de Daniel. Estoy aquí para cumplir tus deseos... comerciales."
        `
    };

    // Initialize Assistant UI
    function init() {
        console.log("Karla Bot Initialized");
        createChatWidget();
    }

    function createChatWidget() {
        const widget = document.createElement('div');
        widget.id = 'orion-chat-widget';
        widget.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 75px;
            height: 75px;
            background: #111;
            border-radius: 50%;
            box-shadow: 0 5px 20px rgba(168, 85, 247, 0.6); /* Purple Glow */
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            overflow: hidden;
            border: 2px solid #a855f7;
            transition: all 0.3s ease;
        `;

        // Use Karla's Image
        const img = document.createElement('img');
        img.src = 'assets/karla.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        widget.appendChild(img);
        document.body.appendChild(widget);

        // Chat Window (Hidden by default)
        const chatWindow = document.createElement('div');
        chatWindow.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 30px;
            width: 380px;
            height: 600px;
            background: #0a0a0a;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            border: 1px solid #333;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #1f1f1f, #000);
            padding: 20px;
            color: white;
            display: flex;
            align-items: center;
            gap: 15px;
            border-bottom: 2px solid #a855f7;
        `;
        header.innerHTML = `
            <div style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 2px solid #a855f7;">
                <img src="assets/karla.png" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
                <div style="font-weight: bold; font-size: 1.2rem; color: #a855f7;">Karla</div>
                <div style="font-size: 0.8rem; color: #aaa;">Executive Concierge • Online</div>
            </div>
            <div style="margin-left: auto; cursor: pointer; color: #a855f7; font-size: 1.2rem;" id="close-chat">✖</div>
        `;

        // Messages Area
        const messages = document.createElement('div');
        messages.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #050505;
            display: flex;
            flex-direction: column;
            gap: 20px;
        `;

        // Welcome Message
        const welcomeMsg = document.createElement('div');
        welcomeMsg.style.cssText = `
            background: linear-gradient(135deg, #222, #111);
            padding: 15px;
            border-radius: 0 15px 15px 15px;
            max-width: 85%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            font-size: 0.95rem;
            color: #eee;
            line-height: 1.6;
            border-left: 3px solid #a855f7;
        `;
        welcomeMsg.innerHTML = `Hola, soy <strong>Karla</strong>. Bienvenue a la experiencia Daniel. 💜
        <br><br>Estoy aquí para asegurarme de que recibas solo lo mejor. ¿En qué puedo complacerte hoy?
        <br><br>¿Buscas una reserva exclusiva o información privada?`;
        messages.appendChild(welcomeMsg);

        // Input Area
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            padding: 20px;
            background: #111;
            border-top: 1px solid #333;
            display: flex;
            gap: 10px;
            align-items: center;
        `;
        inputArea.innerHTML = `
            <input type="text" placeholder="Dime qué deseas..." style="flex: 1; padding: 15px; background: #222; color: white; border: 1px solid #444; border-radius: 30px; outline: none; font-size: 0.9rem;">
            <button style="background: #a855f7; color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.3s;">➤</button>
        `;

        chatWindow.appendChild(header);
        chatWindow.appendChild(messages);
        chatWindow.appendChild(inputArea);
        document.body.appendChild(chatWindow);

        // Events
        widget.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        });

        header.querySelector('#close-chat').addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });
    }

    // Run
    init();

})();
