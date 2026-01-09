/**
 * CHELA - Asistente Virtual V7 (Pro Patch: SystemInstruction + Selector + RobustKey)
 * Alcaldía de Obando
 * Autor: Antigravity (Siguiendo instrucciones técnicas EXPERTAS)
 */

(function () {
    // Evitar duplicados
    if (document.getElementById('chela-boton-flotante')) return;

    console.log('🚀 Iniciando CHELA V7...');

    // CONFIGURACIÓN
    const CONFIG = {
        nombre: 'CHELA',
        rol: 'Asistente Virtual Alcaldía de Obando',
        imagen: 'assets/chela.png'
    };

    // VARIABLES ESTADO
    let estaAbierto = false;
    let haSaludado = false;
    let síntesisVoz = window.speechSynthesis;
    let vozSeleccionada = null;
    let esperandoApiKey = false; // ESTADO CRÍTICO PARA CAPTURA DE KEY

    // 1. ESTILOS GUI
    const estilo = document.createElement('style');
    estilo.textContent = `
        #chela-boton-flotante {
            position: fixed; bottom: 20px; right: 20px; width: 70px; height: 70px;
            border-radius: 50%; background-color: white; background-image: url('${CONFIG.imagen}');
            background-size: cover; border: 3px solid #00B050; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            cursor: pointer; z-index: 2147483647; transition: transform 0.2s;
        }
        #chela-boton-flotante:hover { transform: scale(1.1); }
        #chela-ventana {
            display: none; position: fixed; bottom: 100px; right: 20px; width: 350px; height: 500px;
            background: white; border-radius: 15px; box-shadow: 0 5px 30px rgba(0,0,0,0.3);
            z-index: 2147483647; flex-direction: column; overflow: hidden; border: 1px solid #ddd;
            font-family: Arial, sans-serif;
        }
        #chela-ventana.visible { display: flex; }
        #chela-cabecera { background: #00B050; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        #chela-mensajes { flex: 1; padding: 15px; overflow-y: auto; background-color: #f9f9f9; display: flex; flex-direction: column; gap: 10px; }
        .mensaje { padding: 10px 15px; border-radius: 10px; max-width: 80%; font-size: 14px; line-height: 1.4; }
        .mensaje.bot { background: white; border: 1px solid #eee; align-self: flex-start; color: #333; }
        .mensaje.usuario { background: #00B050; color: white; align-self: flex-end; }
        #chela-input-area { padding: 15px; background: white; border-top: 1px solid #eee; display: flex; gap: 10px; z-index: 2147483647; position: relative; }
        #chela-input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 20px; outline: none; pointer-events: auto; }
        #chela-enviar { background: #00B050; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }
    `;
    document.head.appendChild(estilo);

    // 2. GUI CON SELECTOR (PATCH 1)
    const boton = document.createElement('div'); boton.id = 'chela-boton-flotante';
    const ventana = document.createElement('div'); ventana.id = 'chela-ventana';
    ventana.innerHTML = `
        <div id="chela-cabecera">
            <strong>${CONFIG.nombre}</strong>
            <div style="display:flex; gap:8px; align-items:center;">
                <select id="chela-idioma" style="padding:4px;border-radius:8px;border:none;outline:none;font-size:12px;cursor:pointer;">
                    <option value="auto">Auto</option>
                    <option value="es">Español</option>
                    <option value="embera">Embera</option>
                </select>
                <button id="chela-cerrar" style="background:none; border:none; color:white; font-size:18px; cursor:pointer;" title="Cerrar">X</button>
            </div>
        </div>
        <div id="chela-mensajes"></div>
        <div id="chela-input-area">
            <input type="text" id="chela-input" placeholder="..." autocomplete="off">
            <button id="chela-enviar">➤</button>
        </div>
    `;
    document.body.appendChild(boton); document.body.appendChild(ventana);

    const input = document.getElementById('chela-input');
    const enviarBtn = document.getElementById('chela-enviar');
    const mensajesDiv = document.getElementById('chela-mensajes');
    const idiomaSel = document.getElementById('chela-idioma');

    function alternar() {
        estaAbierto = !estaAbierto; ventana.classList.toggle('visible', estaAbierto);
        if (estaAbierto) setTimeout(() => input.focus(), 100);
        if (estaAbierto && !haSaludado) { agregarMensaje('bot', '¡Bêrea! Soy Chela. ¿En qué te ayudo?'); haSaludado = true; }
    }
    boton.onclick = alternar; document.getElementById('chela-cerrar').onclick = alternar;

    // 3. LOGICA KEY
    function getApiKey() {
        const manual = localStorage.getItem('mario_api_key');
        if (manual) {
            try { return manual.startsWith('AIza') ? manual : atob(manual); } catch (e) { return manual; }
        }
        if (window.__MARIO_CONFIG__?.apiKey) return window.__MARIO_CONFIG__.apiKey;
        return null;
    }

    // 4. LOGICA EMBERA
    function isEmbera(text) {
        const t = (text || "").toLowerCase();
        return ["bêrea", "zocai", "kare", "mũra", "kĩra", "bʉra", "embera"].some(k => t.includes(k));
    }

    // 5. TTS (PATCH 4: SILENCIO EN EMBERA)
    function cargarVoces() {
        const voces = síntesisVoz.getVoices();
        const mujeres = ['Paulina', 'Sabina', 'Helena', 'Google Español', 'Monica'];
        vozSeleccionada = voces.find(v => mujeres.some(m => v.name.includes(m)));
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-MX');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang.startsWith('es'));
    }
    síntesisVoz.onvoiceschanged = cargarVoces; cargarVoces();

    function hablar(texto) {
        if (!síntesisVoz) return;

        // Si el selector está en embera o el texto parece embera, ignorar TTS
        const modo = idiomaSel?.value || 'auto';
        if (modo === 'embera' || isEmbera(texto)) return;

        síntesisVoz.cancel();
        let clean = texto.replace(/[*#]/g, '').replace(/https?:\/\/\S+/g, '');
        clean = clean.replace(/(\d+)x/gi, '$1 veces').replace(/\bAI\b/g, 'Inteligencia Artificial').replace(/\$/g, 'pesos ');
        const u = new SpeechSynthesisUtterance(clean);
        if (vozSeleccionada) u.voice = vozSeleccionada;
        u.lang = 'es-MX'; u.pitch = 1.1; u.rate = 1.1;
        síntesisVoz.speak(u);
    }

    // 6. MANEJO DE KEY SEGURA (PATCH 2)
    function manejarKeyInput() {
        if (esperandoApiKey) {
            const val = input.value.trim();
            input.value = '';
            if (val.startsWith('AIza')) {
                localStorage.setItem('mario_api_key', btoa(val));
                esperandoApiKey = false;
                agregarMensaje('bot', "✅ Key guardada. Ahora sí, escríbeme tu pregunta.");
            } else {
                agregarMensaje('bot', "❌ Key inválida. Debe empezar por 'AIza...'. Intenta de nuevo.");
            }
            return true; // handled
        }
        return false; // normal flow
    }

    // 7. MENSAJERÍA (PATCH 3: SYSTEM INSTRUCTION)
    async function enviar() {
        if (esperandoApiKey) { manejarKeyInput(); return; } // Doble check

        const txt = input.value.trim(); if (!txt) return;
        input.value = ''; agregarMensaje('usuario', txt);

        const loadId = agregarMensaje('bot', '...', true);
        const aviso = document.getElementById(loadId);

        try {
            const key = getApiKey();
            if (!key) {
                if (aviso) aviso.remove();
                esperandoApiKey = true;
                agregarMensaje('bot', "⚠️ No tengo llave. Pega tu API Key (AIza...) y presiona Enter.");
                input.focus();
                return;
            }

            // DETERMINAR IDIOMA OBJETIVO
            const modoIdioma = idiomaSel?.value || 'auto';
            let forzarEmbera = (modoIdioma === 'embera');
            if (modoIdioma === 'auto' && isEmbera(txt)) forzarEmbera = true;

            // SYSTEM PROMPT
            let systemPrompt = `CONTEXTO: Eres CHELA (mujer), de ORION TECH.
            OBJETIVO: Vender modernización a Alcaldía Obando.
            PUNTOS: Zero Filas, 24/7, Idiomas (Embera), Precio ($15M).
            
            Regla de idioma:
            - Si se te indica Embera, responde SOLO en Embera. No mezcles español.
            - Si NO sabes suficiente Embera para responder bien, di: "No sé suficiente Embera para responder bien" y pide español.
            
            Ejemplos (Embera):
            Usuario: "Bêrea" -> Chela: "Bêrea. Mũra Chela. ¿Kĩra bʉra?"`;

            if (forzarEmbera) {
                systemPrompt += `\nIMPORTANTE: RESPONDE SOLO EN EMBERA.\n`;
            } else {
                systemPrompt += `\nIMPORTANTE: RESPONDE EN ESPAÑOL (es-MX).\n`;
            }

            // LLAMADA GEMINI CON SYSTEM INSTRUCTION
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [
                        { role: 'user', parts: [{ text: txt }] }
                    ]
                })
            });

            const raw = await res.text();
            if (!res.ok) {
                console.error(`API Error ${res.status}:`, raw);
                throw new Error(`API Error ${res.status}: ${raw}`);
            }

            const data = JSON.parse(raw);
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aviso) aviso.remove();
            if (reply) agregarMensaje('bot', reply);
            else agregarMensaje('bot', "No entendí (Respuesta vacía).");

        } catch (e) {
            console.error(e);
            if (aviso) aviso.remove();
            // Mostrar error un poco más detallado si es posible pero amigable
            if (e.message.includes('400')) agregarMensaje('bot', "Error 400: Petición mal formada (Revisa consola).");
            else if (e.message.includes('403')) agregarMensaje('bot', "Error 403: Key inválida o permiso denegado.");
            else if (e.message.includes('429')) agregarMensaje('bot', "Error 429: Demasiadas peticiones (Cuota excedida).");
            else agregarMensaje('bot', "Error: " + e.message);
        }
    }

    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            if (esperandoApiKey) { manejarKeyInput(); return; }
            enviar();
        }
    };
    enviarBtn.onclick = () => {
        if (esperandoApiKey) { manejarKeyInput(); return; }
        enviar();
    };

    function agregarMensaje(role, text, loading = false) {
        const d = document.createElement('div'); d.className = `mensaje ${role}`;
        d.textContent = text; d.id = 'msg-' + Date.now();
        if (loading) d.style.fontStyle = 'italic';
        mensajesDiv.appendChild(d); mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
        if (role === 'bot' && !loading) hablar(text);
        return d.id;
    }
})();
