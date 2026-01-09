/**
 * CHELA - Asistente Virtual V4 (Reescrito desde cero)
 * Alcaldía de Obando
 * Autor: Antigravity
 * Idioma: Español (Código y Comentarios)
 */

(function () {
    // Evitar duplicados si el script se carga dos veces
    if (document.getElementById('chela-main-container')) return;

    console.log('🚀 Iniciando CHELA V4...');

    // CONFIGURACIÓN
    const CONFIG = {
        nombre: 'CHELA',
        rol: 'Asistente Virtual Alcaldía de Obando',
        endpoint: 'https://seguriti-usc.onrender.com/chat', // Servidor Compartido (Proxy Seguro)
        imagen: 'assets/chela.png' // Ruta relativa al archivo HTML
    };

    // VARIABLES DE ESTADO
    let estaAbierto = false;
    let haSaludado = false;
    let síntesisVoz = window.speechSynthesis;
    let vozSeleccionada = null;

    // 1. INYECTAR ESTILOS CSS
    const estilo = document.createElement('style');
    estilo.textContent = `
        /* Contenedor Principal del Botón - Z-Index ALTÍSIMO para que flote sobre todo */
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
            border: 3px solid #00B050; /* Verde Obando */
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            cursor: pointer;
            z-index: 2147483647; /* Máxima prioridad */
            transition: transform 0.2s;
        }
        #chela-boton-flotante:hover { transform: scale(1.1); }
        
        /* Ventana de Chat */
        #chela-ventana {
            display: none; /* Oculto por defecto */
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

        /* Cabecera */
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

        /* Área de Mensajes */
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

        /* Área de Entrada (Input) */
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

    // 3. LÓGICA Y EVENTOS
    const input = document.getElementById('chela-input');
    const enviarBtn = document.getElementById('chela-enviar');
    const mensajesDiv = document.getElementById('chela-mensajes');
    const cerrarBtn = document.getElementById('chela-cerrar');

    function alternarChat() {
        estaAbierto = !estaAbierto;
        ventana.classList.toggle('visible', estaAbierto);

        if (estaAbierto) {
            setTimeout(() => input.focus(), 100); // Foco automático
            if (!haSaludado) {
                agregarMensaje('bot', '¡Hola! Soy Chela. ¿En qué puedo ayudarte hoy en la Alcaldía?');
                haSaludado = true;
            }
        }
    }

    boton.onclick = alternarChat;
    cerrarBtn.onclick = alternarChat;

    // SÍNTESIS DE VOZ (TTS)
    function cargarVoces() {
        let voces = síntesisVoz.getVoices();

        // Estrategia para Windows/Android:
        // 1. Buscamos nombres de mujer conocidos
        const mujeres = ['Sabina', 'Paulina', 'Helena', 'Zira', 'Google Español', 'Monica'];
        vozSeleccionada = voces.find(v => mujeres.some(m => v.name.includes(m)));

        // 2. Si no, buscamos por idioma específico (MX y US suelen ser mujer)
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-MX');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-US');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-ES');

        // 3. Último recurso: Cualquiera en español
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang.startsWith('es'));
    }

    if (síntesisVoz.onvoiceschanged !== undefined) {
        síntesisVoz.onvoiceschanged = cargarVoces;
    }
    cargarVoces();

    function hablar(texto) {
        if (!síntesisVoz) return;
        síntesisVoz.cancel();

        const textoLimpio = texto.replace(/[*#]/g, '').replace(/https?:\/\/\S+/g, '');

        const enunciado = new SpeechSynthesisUtterance(textoLimpio);
        if (vozSeleccionada) enunciado.voice = vozSeleccionada;

        // Forzar atributos femeninos si la voz es genérica
        enunciado.pitch = 1.2; // Un poco más agudo (ayuda si es voz de hombre)
        enunciado.rate = 1.1;  // Velocidad fluida

        síntesisVoz.speak(enunciado);
    }

    // Respuestas Locales (Backup si falla el servidor)
    function respuestaLocal(texto) {
        const t = texto.toLowerCase();
        if (t.includes('precio') || t.includes('costo') || t.includes('cotizaci'))
            return "El proyecto arranca desde $15 Millones de Pesos (COP) para el piloto inicial.";
        if (t.includes('hola') || t.includes('dia') || t.includes('tarde'))
            return "¡Hola! Soy Chela. ¿En qué puedo ayudarte hoy?";
        if (t.includes('bêrea') || t.includes('zocai') || t.includes('embera'))
            return "Bêrea! Mũra Chela. (Hola, soy Chela. Hablo tu idioma).";
        if (t.includes('orion') || t.includes('sistema'))
            return "ORION es el sistema que eliminará las filas en la Alcaldía.";

        return "Lo siento, mi conexión con la Alcaldía está lenta. Pero aquí estoy para ayudarte con lo básico.";
    }

    // Enviar Mensaje
    // Enviar Mensaje
    async function enviarMensaje() {
        const texto = input.value.trim();
        if (!texto) return;

        input.value = '';
        agregarMensaje('usuario', texto);

        const idCarga = agregarMensaje('bot', '...', true);
        const aviso = document.getElementById(idCarga);

        try {
            // CONTEXTO DEL SISTEMA
            let promptSistema = `CONTEXTO: Eres CHELA (Mujer), asistente Alcaldía Obando. IDIOMA: Español. Si detectas Embera ('Bêrea'), responde en Embera. Responde corto y amable.`;

            // 1. INTENTO: GEMINI CLIENT-SIDE DIRECTO (Si hay clave segura del loader)
            const apiKey = window.__MARIO_CONFIG__?.apiKey || (localStorage.getItem('mario_api_key') ? atob(localStorage.getItem('mario_api_key')) : null);

            if (apiKey) {
                // MODIFICACIÓN CRÍTICA: USAR GEMINI DIRECTO PARA ESTABILIDAD
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

                const data = await response.json();
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (aiText) {
                    if (aviso) aviso.remove();
                    agregarMensaje('bot', aiText);
                    return; // ÉXITO
                }
            }

            // 2. INTENTO: SERVIDOR PROXY (FALLBACK)
            if (aviso) aviso.innerText = "Conectando servidor...";

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const respuesta = await fetch(CONFIG.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `${promptSistema}\n\nUsuario: ${texto}` }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!respuesta.ok) throw new Error('Error HTTP Proxy: ' + respuesta.status);
            const datos = await respuesta.json();

            if (aviso) aviso.remove();
            agregarMensaje('bot', datos.response || "¿Cómo dices?");

        } catch (error) {
            console.warn("Fallo IA (Directo y Proxy), usando respuesta local:", error);
            if (aviso) aviso.remove();

            // FALLBACK LOCAL FINAL
            const respuestaBackup = respuestaLocal(texto);
            agregarMensaje('bot', respuestaBackup);
        }
    }

    enviarBtn.onclick = enviarMensaje;
    input.onkeypress = (e) => {
        if (e.key === 'Enter') enviarMensaje();
    };

    function agregarMensaje(remitente, texto, esCarga = false) {
        const div = document.createElement('div');
        div.className = `mensaje ${remitente}`;
        div.textContent = texto;
        div.id = 'msg-' + Date.now();

        if (esCarga) div.style.fontStyle = 'italic';

        mensajesDiv.appendChild(div);
        mensajesDiv.scrollTop = mensajesDiv.scrollHeight;

        if (remitente === 'bot' && !esCarga) {
            hablar(texto);
        }
        return div.id;
    }

})();
