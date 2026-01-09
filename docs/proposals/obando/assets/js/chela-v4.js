/**
 * CHELA V11 - API Key Rotation + Anti-spam
 * Autor: Antigravity
 */
(function () {
    if (document.getElementById('chela-boton-flotante')) return;
    console.log('🚀 CHELA V11 Iniciando...');

    const CHELA_IMG = 'https://agem2024.github.io/SEGURITI-USC/proposals/obando/assets/chela.png';

    // ANTI-SPAM
    let enviando = false;
    let ultimoEnvio = 0;

    // API KEY ROTATION - Uses Mario Loader V3
    let currentKeyIndex = 0;
    function getKeys() {
        const keys = [];
        // 1. Key del loader (mario-loader-v3.js) - tiene múltiples keys
        if (window.__MARIO_CONFIG__?.apiKey) keys.push(window.__MARIO_CONFIG__.apiKey);

        // 2. Segunda key del loader (si existe getNextKey)
        if (window.__MARIO_CONFIG__?.getNextKey && window.__MARIO_CONFIG__?.keyCount > 1) {
            const backupKey = window.__MARIO_CONFIG__.getNextKey();
            if (backupKey && !keys.includes(backupKey)) keys.push(backupKey);
            // Volver a la primera key
            window.__MARIO_CONFIG__.getNextKey();
        }

        // 3. Key del localStorage
        const stored = localStorage.getItem('mario_api_key');
        if (stored) {
            try {
                const k = stored.startsWith('AIza') ? stored : atob(stored);
                if (!keys.includes(k)) keys.push(k);
            } catch (e) { }
        }
        return keys;
    }

    function getNextKey() {
        const keys = getKeys();
        if (keys.length === 0) return null;
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        console.log(`🔑 Rotando a key ${currentKeyIndex + 1}/${keys.length}`);
        return keys[currentKeyIndex];
    }

    function getCurrentKey() {
        const keys = getKeys();
        if (keys.length === 0) return null;
        return keys[currentKeyIndex % keys.length];
    }

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
        #chela-enviar:disabled { background: #ccc; cursor: not-allowed; }
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
                addMsg('bot', '¡Bêrea! Soy Chela. ¿En qué te ayudo?');
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
        return d;
    }

    function isEmbera(t) {
        return ['bêrea', 'zocai', 'kare', 'mũra', 'embera', 'berea'].some(k => t.toLowerCase().includes(k));
    }

    async function callGemini(txt, keyArg, retryCount = 0) {
        // Use global loader if available
        let key = keyArg;
        if (window.__MARIO_CONFIG__?.apiKey) key = window.__MARIO_CONFIG__.apiKey;

        const forzarEmbera = idiomaSel.value === 'embera' || isEmbera(txt);
        const systemPrompt = `Eres CHELA, asistente de ORION Tech para Alcaldía de Obando.
OBJETIVO: Vender "Municipio Digital". Zero filas, 24/7, transparencia.
IDIOMAS: Español y Embera. Vocabulario: Bêrea (Hola), Zocai (Amigo), Kare (Gracias).
${forzarEmbera ? 'RESPONDE EN EMBERA.' : 'RESPONDE EN ESPAÑOL.'}`;

        try {
            // Using gemini-1.5-flash for better stability
            const modelVersion = 'gemini-1.5-flash';
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelVersion}:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: txt }] }]
                })
            });

            if (res.status === 429 || res.status === 403) {
                throw new Error("RATE_LIMIT");
            }

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`API_ERROR: ${res.status} ${errText}`);
            }

            const data = await res.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude responder.';

        } catch (e) {
            // Auto-Rotate Logic
            if ((e.message.includes("RATE_LIMIT") || e.message.includes("429") || e.message.includes("403")) && retryCount < 6) {
                console.warn(`⚠️ API Key Error (Attempt ${retryCount + 1}). Rotating...`);

                if (window.__MARIO_CONFIG__?.getNextKey) {
                    window.__MARIO_CONFIG__.getNextKey(); // Updates global key
                    // Wait 1s before retry
                    await new Promise(r => setTimeout(r, 1000));
                    // Retry with new key from global state
                    return callGemini(txt, null, retryCount + 1);
                }
            }
            throw e;
        }
    }

    async function enviar() {
        const txt = input.value.trim();
        if (!txt) return;

        const ahora = Date.now();
        if (enviando) return;
        if (ahora - ultimoEnvio < 1500) return;
        enviando = true;
        ultimoEnvio = ahora;
        enviarBtn.disabled = true;

        input.value = '';
        addMsg('user', txt);

        const key = getCurrentKey();
        if (!key) {
            addMsg('bot', '⚠️ No hay API Key. Pega una (AIza...) aquí.');
            enviando = false;
            enviarBtn.disabled = false;
            return;
        }

        const loadingMsg = addMsg('bot', '...');

        try {
            const reply = await callGemini(txt, key);
            loadingMsg.textContent = reply;
        } catch (e) {
            console.error(e);
            const msg = String(e?.message || "");
            if (msg.includes("429")) {
                loadingMsg.textContent = "⚠️ Todas las keys agotadas (429). Espera 1 minuto.";
            } else if (msg.includes("403")) {
                loadingMsg.textContent = "❌ Todas las keys inválidas.";
            } else {
                loadingMsg.textContent = 'Error: ' + msg.substring(0, 80);
            }
        } finally {
            enviando = false;
            enviarBtn.disabled = false;
        }
    }

    input.onkeydown = (e) => { if (e.key === 'Enter' && !enviando) enviar(); };
    enviarBtn.onclick = () => { if (!enviando) enviar(); };

    console.log('✅ CHELA V11 Lista - Keys disponibles:', getKeys().length);
})();
