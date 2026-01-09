/**
 * CHELA V9 - FUNCIONANDO
 * Sin Firebase módulos (causa errores CORS en GitHub Pages)
 * Autor: Antigravity
 */
(function () {
    if (document.getElementById('chela-boton-flotante')) return;
    console.log('🚀 CHELA V9 Iniciando...');

    // IMAGEN ABSOLUTA (EVITA PROBLEMAS DE RUTA)
    const CHELA_IMG = 'https://agem2024.github.io/SEGURITI-USC/proposals/obando/assets/chela.png';

    // ESTILOS
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
    `;
    document.head.appendChild(estilo);

    // CREAR ELEMENTOS
    const boton = document.createElement('div');
    boton.id = 'chela-boton-flotante';

    const ventana = document.createElement('div');
    ventana.id = 'chela-ventana';
    ventana.innerHTML = `
        <div id="chela-cabecera">
            <strong>🌿 CHELA</strong>
            <div style="display:flex; gap:8px; align-items:center;">
                <select id="chela-idioma" style="padding:4px;border-radius:8px;border:none;font-size:12px;">
                    <option value="es">Español</option>
                    <option value="embera">Embera</option>
                </select>
                <button id="chela-cerrar" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">✕</button>
            </div>
        </div>
        <div id="chela-mensajes"></div>
        <div id="chela-input-area">
            <input type="text" id="chela-input" placeholder="Escribe aquí..." autocomplete="off">
            <button id="chela-enviar">➤</button>
        </div>
    `;

    document.body.appendChild(boton);
    document.body.appendChild(ventana);

    // REFERENCIAS
    const input = document.getElementById('chela-input');
    const enviarBtn = document.getElementById('chela-enviar');
    const mensajesDiv = document.getElementById('chela-mensajes');
    const idiomaSel = document.getElementById('chela-idioma');

    let abierto = false;
    let saludado = false;

    function toggle() {
        abierto = !abierto;
        ventana.classList.toggle('visible', abierto);
        if (abierto) {
            input.focus();
            if (!saludado) {
                addMsg('bot', '¡Bêrea! Soy Chela, tu asistente virtual. ¿En qué te ayudo hoy?');
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
    }

    // API KEY
    function getKey() {
        if (window.__MARIO_CONFIG__?.apiKey) return window.__MARIO_CONFIG__.apiKey;
        const stored = localStorage.getItem('mario_api_key');
        if (stored) {
            try { return stored.startsWith('AIza') ? stored : atob(stored); } catch (e) { return stored; }
        }
        return null;
    }

    // EMBERA CHECK
    function isEmbera(t) {
        return ['bêrea', 'zocai', 'kare', 'mũra', 'embera', 'berea'].some(k => t.toLowerCase().includes(k));
    }

    async function enviar() {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        addMsg('user', txt);

        const key = getKey();
        if (!key) {
            addMsg('bot', '⚠️ Necesito la API Key. Pégala aquí (AIza...) y presiona Enter.');
            return;
        }

        addMsg('bot', '...');
        const loadingMsg = mensajesDiv.lastChild;

        try {
            const forzarEmbera = idiomaSel.value === 'embera' || isEmbera(txt);

            const systemPrompt = `Eres CHELA, asistente virtual de ORION Tech para la Alcaldía de Obando.
OBJETIVO: Vender "Municipio Digital". Zero filas, atención 24/7, transparencia.

IDIOMAS: Español y Embera Chamí.
VOCABULARIO EMBERA: Bêrea (Hola), Zocai (Amigo), Kare (Gracias), Mũra (Yo soy).

${forzarEmbera ? 'RESPONDE EN EMBERA.' : 'RESPONDE EN ESPAÑOL.'}`;

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: txt }] }]
                })
            });

            if (!res.ok) throw new Error(`Error ${res.status}`);

            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude responder.';

            loadingMsg.textContent = reply;

        } catch (e) {
            console.error(e);
            loadingMsg.textContent = 'Error: ' + e.message;
        }
    }

    input.onkeydown = (e) => { if (e.key === 'Enter') enviar(); };
    enviarBtn.onclick = enviar;

    console.log('✅ CHELA V9 Lista');
})();
