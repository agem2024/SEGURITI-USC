/**
 * CHELA - Asistente Virtual V6 (Robust Client-Side + Embera Logic)
 * Alcaldía de Obando
 * Autor: Antigravity (Siguiendo instrucciones técnicas estrictas)
 */

(function () {
    // Evitar duplicados
    if (document.getElementById('chela-boton-flotante')) return;

    console.log('🚀 Iniciando CHELA V6...');

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

    // 1. ESTILOS GUI (Igual que antes)
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

    // 2. GUI
    const boton = document.createElement('div'); boton.id = 'chela-boton-flotante';
    const ventana = document.createElement('div'); ventana.id = 'chela-ventana';
    ventana.innerHTML = `
        <div id="chela-cabecera"><strong>${CONFIG.nombre}</strong><button id="chela-cerrar">X</button></div>
        <div id="chela-mensajes"></div>
        <div id="chela-input-area"><input type="text" id="chela-input" placeholder="..." autocomplete="off"><button id="chela-enviar">➤</button></div>
    `;
    document.body.appendChild(boton); document.body.appendChild(ventana);

    const input = document.getElementById('chela-input');
    const enviarBtn = document.getElementById('chela-enviar');
    const mensajesDiv = document.getElementById('chela-mensajes');

    function alternar() {
        estaAbierto = !estaAbierto; ventana.classList.toggle('visible', estaAbierto);
        if (estaAbierto) setTimeout(() => input.focus(), 100);
        if (estaAbierto && !haSaludado) { agregarMensaje('bot', '¡Bêrea! Soy Chela. ¿En qué te ayudo?'); haSaludado = true; }
    }
    boton.onclick = alternar; document.getElementById('chela-cerrar').onclick = alternar;

    // 3. LOGICA KEY (Plan A - Modificado para Prioridad Manual)
    function getApiKey() {
        // 1. Prioridad: Manual (localStorage) para respetar configuración del usuario
        const manual = localStorage.getItem('mario_api_key');
        if (manual) {
            try { return manual.startsWith('AIza') ? manual : atob(manual); } catch (e) { return manual; }
        }

        // 2. Fallback: Loader (si existe)
        if (window.__MARIO_CONFIG__?.apiKey) return window.__MARIO_CONFIG__.apiKey;

        return null;
    }

    // 4. LOGICA EMBERA (Plan C)
    function isEmbera(text) {
        const t = (text || "").toLowerCase();
        return ["bêrea", "zocai", "kare", "mũra", "kĩra", "bʉra", "embera"].some(k => t.includes(k));
    }

    // 5. TTS
    function cargarVoces() {
        const voces = síntesisVoz.getVoices();
        // Buscar voz mujer español (NO ZIRA)
        const mujeres = ['Paulina', 'Sabina', 'Helena', 'Google Español', 'Monica'];
        vozSeleccionada = voces.find(v => mujeres.some(m => v.name.includes(m)));
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-MX');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang === 'es-CO');
        if (!vozSeleccionada) vozSeleccionada = voces.find(v => v.lang.startsWith('es'));
    }
    síntesisVoz.onvoiceschanged = cargarVoces; cargarVoces();

    function hablar(texto) {
        if (!síntesisVoz) return;
        síntesisVoz.cancel();
        let clean = texto.replace(/[*#]/g, '').replace(/https?:\/\/\S+/g, '');
        // Limpieza Pronunciación
        clean = clean.replace(/(\d+)x/gi, '$1 veces').replace(/\bAI\b/g, 'Inteligencia Artificial').replace(/\$/g, 'pesos ');

        const u = new SpeechSynthesisUtterance(clean);
        if (vozSeleccionada) u.voice = vozSeleccionada;
        u.lang = 'es-MX'; u.pitch = 1.1; u.rate = 1.1;
        síntesisVoz.speak(u);
    }

    // 6. MENSAJERÍA
    async function enviar() {
        const txt = input.value.trim(); if (!txt) return;
        input.value = ''; agregarMensaje('usuario', txt);

        const loadId = agregarMensaje('bot', '...', true);
        const aviso = document.getElementById(loadId);

        try {
            const key = getApiKey();
            if (!key) {
                if (aviso) aviso.remove();
                agregarMensaje('bot', "⚠️ No tengo llave. Escribe tu API Key (AIza...) aquí y la guardaré.");
                // Capturar siguiente input como key
                const handler = (e) => {
                    if (e.key === 'Enter') {
                        const val = input.value.trim();
                        if (val.startsWith('AIza')) {
                            localStorage.setItem('mario_api_key', btoa(val));
                            agregarMensaje('bot', "✅ Key guardada. Pregunta de nuevo.");
                            input.onkeypress = (ev) => ev.key === 'Enter' && enviar(); // Restaurar
                            enviarBtn.onclick = enviar;
                        }
                        input.value = '';
                    }
                };
                input.onkeypress = handler; enviarBtn.onclick = () => { if (input.value) handler({ key: 'Enter' }); };
                return;
            }

            // PROMPT DINÁMICO DE VENTAS
            let systemPrompt = `CONTEXTO: Eres CHELA (mujer), una IA Avanzada creada por ORION TECH.
            TU OBJETIVO: Demostrar a la Alcaldía de Obando por qué deben contratar a ORION TECH.
            
            PUNTOS DE VENTA (PITCH):
            1. MODERNIZACIÓN: Conviertes a Obando en una Smart City.
            2. EFICIENCIA: Eliminas filas y atiendes a miles de ciudadanos simultáneamente 24/7.
            3. INCLUSIÓN: Hablas múltiples idiomas (incluyendo Embera Chamí).
            4. PRECIO: El piloto cuesta desde $15 Millones COP (muy económico para el impacto).
            
            SI TE PREGUNTAN QUIÉN ERES: "Soy Chela, un agente de Inteligencia Artificial de ORION TECH, diseñado para transformar la atención ciudadana en Obando."
            
            Ejemplos Embera:
            Usuario: "Bêrea" -> Chela: "Bêrea. Mũra Chela, ORION Tech ía. ¿Kĩra bʉra?"`;

            if (isEmbera(txt)) {
                systemPrompt += `\n\nIMPORTANTE: El usuario habla EMBERA. RESPONDE SOLO EN EMBERA O ESPAÑOL MUY SIMPLE SI NO SABES.`;
            }

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] },
                        { role: 'user', parts: [{ text: txt }] }
                    ]
                })
            });

            if (!res.ok) throw new Error('API Error ' + res.status);
            const data = await res.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aviso) aviso.remove();
            if (reply) agregarMensaje('bot', reply);

        } catch (e) {
            console.error(e);
            if (aviso) aviso.remove();
            agregarMensaje('bot', "Red lenta. (Error IA)");
        }
    }

    function agregarMensaje(role, text, loading = false) {
        const d = document.createElement('div'); d.className = `mensaje ${role}`;
        d.textContent = text; d.id = 'msg-' + Date.now();
        if (loading) d.style.fontStyle = 'italic';
        mensajesDiv.appendChild(d); mensajesDiv.scrollTop = mensajesDiv.scrollHeight;
        if (role === 'bot' && !loading) hablar(text);
        return d.id;
    }

    enviarBtn.onclick = enviar;
    input.onkeypress = (e) => e.key === 'Enter' && enviar();

})();
