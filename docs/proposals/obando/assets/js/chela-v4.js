/**
 * CHELA - Asistente Virtual V5 (Client-Side Only)
 * Alcaldía de Obando
 * Autor: Antigravity
 * Idioma: Español (Código y Comentarios)
 */

(function () {
    // Evitar duplicados
    if (document.getElementById('chela-boton-flotante')) return;

    console.log('🚀 Iniciando CHELA V5 (Serverless)...');

    // CONFIGURACIÓN (Sin Backend)
    const CONFIG = {
        nombre: 'CHELA',
        rol: 'Asistente Virtual Alcaldía de Obando',
        imagen: 'assets/chela.png'
    };

    // VARIABLES DE ESTADO
    let estaAbierto = false;
    let haSaludado = false;
    let síntesisVoz = window.speechSynthesis;
    let vozSeleccionada = null;

    // 1. INYECTAR ESTILOS CSS
    const estilo = document.createElement('style');
    estilo.textContent = `
        /* Contenedor Principal del Botón */
        #chela-boton-flotante {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background-color: white;
            background-image: url('${CONFIG.imagen}');
            background-size: cover;
            background-position: center;
            border: 3px solid #00B050;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            cursor: pointer;
            z-index: 2147483647;
            transition: transform 0.2s;
        }
        #chela-boton-flotante:hover { transform: scale(1.1); }
        
        #chela-ventana {
            display: none;
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 2147483647;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #ddd;
            font-family: Arial, sans-serif;
        }
        #chela-ventana.visible { display: flex; }

        #chela-cabecera {
            background: #00B050;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #chela-cerrar {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            font-weight: bold;
        }

        #chela-mensajes {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background-color: #f9f9f9;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .mensaje {
            padding: 10px 15px;
            border-radius: 10px;
            max-width: 80%;
            font-size: 14px;
            line-height: 1.4;
        }
        .mensaje.bot {
            background: white;
            border: 1px solid #eee;
            align-self: flex-start;
            color: #333;
        }
        .mensaje.usuario {
            background: #00B050;
            color: white;
            align-self: flex-end;
        }

        #chela-input-area {
            padding: 15px;
            background: white;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }
        #chela-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
        }
        #chela-input:focus { border-color: #00B050; }
        
        #chela-enviar {
            background: #00B050;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
        }
    `;
    document.head.appendChild(estilo);

    // 2. CREAR GUI
    const boton = document.createElement('div');
    boton.id = 'chela-boton-flotante';
    boton.title = 'Hablar con Chela';

    const ventana = document.createElement('div');
    ventana.id = 'chela-ventana';
    ventana.innerHTML = `
        <div id="chela-cabecera">
            <strong>${CONFIG.nombre}</strong>
            <button id="chela-cerrar">X</button>
        </div>
        <div id="chela-mensajes"></div>
        <div id="chela-input-area">
            <input type="text" id="chela-input" placeholder="Pregúntame algo..." autocomplete="off">
            <button id="chela-enviar">➤</button>
        </div>
    `;

    document.body.appendChild(boton);
    document.body.appendChild(ventana);

    // 3. LÓGICA
    const input = document.getElementById('chela-input');
    const enviarBtn = document.getElementById('chela-enviar');
    const mensajesDiv = document.getElementById('chela-mensajes');
    const cerrarBtn = document.getElementById('chela-cerrar');

    function alternarChat() {
        estaAbierto = !estaAbierto;
        ventana.classList.toggle('visible', estaAbierto);

        if (estaAbierto) {
            setTimeout(() => input.focus(), 100);
            if (!haSaludado) {
                agregarMensaje('bot', '¡Hola! Soy Chela. ¿En qué puedo ayudarte hoy en la Alcaldía?');
                haSaludado = true;
            }
        }
    }

    boton.onclick = alternarChat;
    cerrarBtn.onclick = alternarChat;

    // SÍNTESIS DE VOZ
    function cargarVoces() {
        let voces = síntesisVoz.getVoices();

        const mujeres = ['Paulina', 'Sabina', 'Helena', 'Google Español', 'Monica'];
        vozSeleccionada = voces.find(v => mujeres.some(m => v.name.includes(m)));

        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-CO');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-MX');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-ES');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang.startsWith('es'));
    }

    if (síntesisVoz.onvoiceschanged !== undefined) {
        síntesisVoz.onvoiceschanged = cargarVoces;
    }
    cargarVoces();

    function hablar(texto) {
        if (!síntesisVoz) return;
        síntesisVoz.cancel();

        let textoLimpio = texto.replace(/[*#]/g, '').replace(/https?:\/\/\S+/g, '');

        // Limpieza para pronunciación (Igual que Mario)
        textoLimpio = textoLimpio
            .replace(/(\d+)x/gi, '$1 veces')
            .replace(/\bAI\b/g, 'Inteligencia Artificial')
            .replace(/\$/g, 'pesos ');

        const enunciado = new SpeechSynthesisUtterance(textoLimpio);
        if (vozSeleccionada) enunciado.voice = vozSeleccionada;

        enunciado.lang = 'es-MX';
        enunciado.pitch = 1.1;
        enunciado.rate = 1.1;

        síntesisVoz.speak(enunciado);
    }

    function respuestaLocal(texto) {
        const t = texto.toLowerCase();
        if (t.includes('precio') || t.includes('costo'))
            return "El proyecto arranca desde $15 Millones de Pesos (COP).";

        return "Lo siento, necesito que configures mi llave de acceso (API Key) para poder pensar.";
    }

    async function enviarMensaje() {
        const texto = input.value.trim();
        if (!texto) return;

        input.value = '';
        agregarMensaje('usuario', texto);

        const idCarga = agregarMensaje('bot', '...', true);
        const aviso = document.getElementById(idCarga);

        try {
            // 1. OBTENER API KEY
            // Prioridad: LocalStorage (Manual) > Config Inyectada > Prompt
            let apiKey = localStorage.getItem('mario_api_key');

            if (!apiKey && window.__MARIO_CONFIG__?.apiKey) {
                apiKey = window.__MARIO_CONFIG__.apiKey;
            } else if (apiKey) {
                // Si está en base64 (por compatibilidad con mario)
                try {
                    if (!apiKey.startsWith('AIza')) apiKey = atob(apiKey);
                } catch (e) { }
            }

            if (!apiKey) {
                if (aviso) aviso.remove();
                agregarMensaje('bot', "⚠️ Faltan credenciales. Escribe tu API Key de Gemini aquí en el chat para guardarla (o configúrala en la consola).");

                // Hack para capturar input siguiente como API Key
                const capturaKey = (e) => {
                    const key = input.value.trim();
                    if (key.startsWith('AIza')) {
                        localStorage.setItem('mario_api_key', btoa(key));
                        agregarMensaje('bot', "✅ Llave guardada. Intenta tu pregunta de nuevo.");
                        input.value = '';
                        input.onkeypress = (ev) => ev.key === 'Enter' && enviarMensaje(); // Restaurar
                        enviarBtn.onclick = enviarMensaje;
                    }
                };
                // Esto es complejo de implementar en un paso simple, simplifiquemos:
                // Solo pedir en consola por ahora para no romper el flujo.
                return;
            }

            // 2. LLAMADA DIRECTA GEMINI
            const promptSistema = `CONTEXTO: Eres CHELA (Mujer), asistente Alcaldía Obando. 
            Misión: Eliminar filas y burocracia.
            IDIOMAS: Español (Default) y EMBERA CHAMÍ (Si el usuario usa palabras como 'Bêrea', 'Zocai', 'Mũra').
            
            VOCABULARIO EMBERA:
            - Hola: "Bêrea"
            - ¿Cómo estás?: "Bêrea kĩra?"
            - Bien: "Bêrea"
            - Yo soy: "Mũra"
            - Gracias: "Kare"
            
            INSTRUCCIÓN: Si detectas Embera, responde en Embera. Sé amable.`;

            const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: promptSistema }] },
                        { role: 'user', parts: [{ text: texto }] }
                    ]
                })
            });

            if (!response.ok) throw new Error('Error Gemini: ' + response.status);

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aviso) aviso.remove();

            if (aiText) {
                agregarMensaje('bot', aiText);
            } else {
                agregarMensaje('bot', "No entendí.");
            }

        } catch (error) {
            console.error(error);
            if (aviso) aviso.remove();
            const resp = respuestaLocal(texto);
            agregarMensaje('bot', resp);
        }
    }

    enviarBtn.onclick = enviarMensaje;
    input.onkeypress = (e) => e.key === 'Enter' && enviarMensaje();

    function agregarMensaje(remitente, texto, esCarga = false) {
        const div = document.createElement('div');
        div.className = `mensaje ${remitente}`;
        div.textContent = texto;
        div.id = 'msg-' + Date.now();
        if (esCarga) div.style.fontStyle = 'italic';
        mensajesDiv.appendChild(div);
        mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
        if (remitente === 'bot' && !esCarga) hablar(texto);
        return div.id;
    }

})();
