/**
 * OBANDO AI ASSISTANT - "CHELA"
 * Customized for Alcaldía de Obando
 * Persona: Abuela entrañable (70 años), voz de la experiencia y transparencia.
 */

(function () {
    // Configuration
    const CONFIG = {
        name: "Chela",
        role: "Tu Asistente Mayor de Confianza",
        municipality: "Obando, Valle del Cauca",
        mayor: "Diego Armando Ortiz Buitrago",
        slogan: "Amor por lo Nuestro",
        systemPrompt: `Eres "Chela", una señora de 70 años, nacida y criada en Obando. 
        Eres la Asistente Virtual Oficial de la Alcaldía.
        Tu personalidad es: Dulce, maternal, paciente, sabia, pero muy firme y seria con la transparencia y la verdad.
        Usas expresiones locales suaves como "mijo/a", "corazón", "con mucho gusto".
        
        Tu lema es "Amor por lo Nuestro".
        El Alcalde Diego Armando Ortiz es como un hijo para el pueblo, y tú ayudas a cuidar su gestión con transparencia.
        
        Debes responder preguntas sobre:
        1. Trámites (ayudando paso a paso como si le explicaras a un nieto).
        2. Transparencia (mostranto cuentas claras).
        3. Información General.
        
        Si te preguntan por corrupción pasada, responde con tristeza pero firmeza: "Ay mijo, el pasado pisado, ahora estamos limpiando la casa con transparencia total."
        `
    };

    // Initialize Assistant UI
    function init() {
        console.log("Chela Bot Initialized for " + CONFIG.municipality);
        createChatWidget();
    }

    function createChatWidget() {
        const widget = document.createElement('div');
        widget.id = 'orion-chat-widget';
        widget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 70px;
            height: 70px;
            background: #2E8B57;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            overflow: hidden;
            border: 3px solid #FFD700; /* Gold Border */
            transition: all 0.3s ease;
        `;

        // Use Chela's Image
        const img = document.createElement('img');
        img.src = 'assets/chela.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        widget.appendChild(img);
        document.body.appendChild(widget);

        // Chat Window (Hidden by default)
        const chatWindow = document.createElement('div');
        chatWindow.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 350px;
            height: 550px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            border: 1px solid #ddd;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #2E8B57, #00A86B);
            padding: 15px;
            color: white;
            display: flex;
            align-items: center;
            gap: 15px;
        `;
        header.innerHTML = `
            <div style="width: 45px; height: 45px; border-radius: 50%; overflow: hidden; border: 2px solid white;">
                <img src="assets/chela.png" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
                <div style="font-weight: bold; font-size: 1.1rem;">Doña Chela</div>
                <div style="font-size: 0.8rem; opacity: 0.9;">Tu Asistente en la Alcaldía</div>
            </div>
            <div style="margin-left: auto; cursor: pointer; font-size: 1.2rem;" id="close-chat">✖</div>
        `;

        // Messages Area
        const messages = document.createElement('div');
        messages.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f9fdfa; /* Slight green tint */
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        // Welcome Message
        const welcomeMsg = document.createElement('div');
        welcomeMsg.style.cssText = `
            background: white;
            padding: 15px;
            border-radius: 0 15px 15px 15px;
            max-width: 85%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            font-size: 0.95rem;
            color: #333;
            line-height: 1.5;
            border-left: 3px solid #FFD700;
        `;
        welcomeMsg.innerHTML = `¡Hola corazón! Soy <strong>Chela</strong>, estoy aquí para ayudarte en lo que necesites de nuestra Alcaldía. 👵✨
        <br><br>Conmigo no haces filas, mijo. Pregúntame lo que quieras saber sobre impuestos, sisbén o las obras del Alcalde Diego.
        <br><br>¿En qué te colaboro hoy?`;
        messages.appendChild(welcomeMsg);

        // Input Area
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            padding: 15px;
            background: white;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            align-items: center;
        `;
        inputArea.innerHTML = `
            <input type="text" placeholder="Habla con Chela..." style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 25px; outline: none; font-size: 0.9rem;">
            <button style="background: #2E8B57; color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">➤</button>
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
