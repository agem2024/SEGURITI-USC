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
        console.log("Voces disponibles:", voces.map(v => v.name));

        // Prioridad Estricta: Voces Femeninas Conocidas en Español
        const mujeres = ['Microsoft Sabina', 'Microsoft Paulina', 'Google Español', 'Monica', 'Soledad', 'Paulina', 'Sabina'];

        // 1. Buscar coincidencia exacta
        vozSeleccionada = voces.find(v => mujeres.some(m => v.name.includes(m)));

        // 2. Si no, buscar cualquiera que diga "Female" o "Mujer" en Español
        if (!vozSeleccionada) {
            vozSeleccionada = voces.find(v => v.lang.startsWith('es') && (v.name.includes('Female') || v.name.includes('Mujer')));
        }

        // 3. Fallback: Cualquier voz en español (pero trataremos de ajustarla)
        if (!vozSeleccionada) {
            vozSeleccionada = voces.find(v => v.lang.startsWith('es'));
        }
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

        // Ajustes para sonar más femenina si toca usar voz genérica
        enunciado.lang = 'es-CO';
        enunciado.pitch = 1.0; // Tono natural
        enunciado.rate = 1.0;

        síntesisVoz.speak(enunciado);
    }

    // Enviar Mensaje
    async function enviarMensaje() {
        const texto = input.value.trim();
        if (!texto) return;

        input.value = '';
        agregarMensaje('usuario', texto);

        const idCarga = agregarMensaje('bot', 'Pensando...', true);

        // Timeout aviso
        const timeoutAviso = setTimeout(() => {
            const el = document.getElementById(idCarga);
            if (el) el.innerText = "Conectando con el servidor municipal...";
        }, 6000);

        try {
            // DETECCIÓN INTELIGENTE DE IDIOMA
            const esEmbera = /(embera|bêrea|zocai|kĩra|nũmí|chami|chamí)/i.test(texto);
            const esIngles = /(hello|help|english|price|thank)/i.test(texto);

            let contextoIA = `
Eres CHELA, asistente de la Alcaldía de Obando, Valle.
IDENTIDAD: Mujer, amable, eficiente.
IDIOMA BASE: Español.
REGLAS CRÍTICAS:
1. Si el usuario habla en INGLÉS, responde en INGLÉS.
2. Si el usuario usa palabras como "Bêrea" o "Zocai" (Embera), DEBES RESPONDER EN EMBERA CHAMÍ.
3. Sé breve y directa. No des respuestas de 3 párrafos.
`;

            if (esEmbera) {
                contextoIA += "\n[URGENTE: EL USUARIO ESTÁ HABLANDO EN EMBERA CHAMÍ. ACTIVA MODO TRADUCTOR INDÍGENA. RESPONDE EN EMBERA].";
            } else if (esIngles) {
                contextoIA += "\n[USER IS SPEAKING ENGLISH. REPLY IN ENGLISH ONLY].";
            }

            const respuesta = await fetch(CONFIG.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: `${contextoIA}\n\nUsuario: ${texto}`
                })
            });

            clearTimeout(timeoutAviso);

            if (!respuesta.ok) throw new Error('Error en el servidor');
            const datos = await respuesta.json();

            const elCarga = document.getElementById(idCarga);
            if (elCarga) elCarga.remove();

            if (datos.response) {
                agregarMensaje('bot', datos.response);
            } else {
                agregarMensaje('bot', "¿Podrías repetirlo?");
            }

        } catch (error) {
            clearTimeout(timeoutAviso);
            console.error(error);
            const elCarga = document.getElementById(idCarga);
            if (elCarga) elCarga.remove();
            agregarMensaje('bot', 'Sin conexión. Intenta de nuevo.');
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
