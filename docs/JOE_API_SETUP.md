# JOE AI Assistant - API Keys Setup Guide

## 🔐 Configuración de API Keys

Para activar JOE, necesitas agregar tus propias API keys en el archivo `joe-assistant.js`.

### Paso 1: Abre el archivo
```
docs/joe-assistant.js
```

### Paso 2: Reemplaza los marcadores de posición (líneas 22-30)

**ANTES:**
```javascript
apis: {
    gemini: {
        keys: [
            'YOUR_GEMINI_API_KEY_1',
            'YOUR_GEMINI_API_KEY_2'
        ],
        ...
    },
    openai: {
        keys: [
            'YOUR_OPENAI_API_KEY_1'
        ],
        ...
    }
}
```

**DESPUÉS:**
```javascript
apis: {
    gemini: {
        keys: [
            'TU_CLAVE_GEMINI_1',
            'TU_CLAVE_GEMINI_2'  // Opcional: segunda clave para rotación
        ],
        ...
    },
    openai: {
        keys: [
            'TU_CLAVE_OPENAI_1'
        ],
        ...
    }
}
```

### Paso 3: Obtener API Keys

#### OpenAI (para TTS/Voz - RECOMENDADO)
1. Visita: https://platform.openai.com/api-keys
2. Crea una nueva API key
3. Copia y pega en `joe-assistant.js`

#### Google Gemini (opcional - backup)
1. Visita: https://aistudio.google.com/app/apikey
2. Crea una nueva API key
3. Copia y pega en `joe-assistant.js`

### Paso 4: Guarda el archivo

⚠️ **IMPORTANTE:** Después de agregar tus keys reales:
- NO subas el archivo a GitHub público
- Agrega `joe-assistant.js` a tu `.gitignore`
- Las keys son sensibles y personales

---

## ✅ Verificar que JOE funcione

1. Abre: `pricebook-index.html` en tu navegador
2. Verás un botón flotante con el avatar de JOE (abajo a la derecha)
3. Click en el botón para abrir el chat
4. JOE debería saludar automáticamente: 
   > "👋 ¡Hola! Soy JOE, tu asistente AI de ORION TECH..."
5. Si la voz está habilitada (🔊), debería hablar el saludo

---

## 🎯 Características Actualizadas de JOE

### Conocimiento Actualizado:
- ✅ **ORION TECH** como empresa
- ✅ **1,350+ servicios** en 8 categorías
- ✅ **Bay Area, California** como ubicación
- ✅ **Metodología Good/Better/Best**
- ✅ **Códigos**: UPC 2024, IPC 2021, OSHA 29 CFR 1926
- ✅ **Proveedores**: Ferguson, HD Supply, Winsupply
- ✅ **Slogan**: "No esperamos el futuro, lo construimos"

### Funcionalidades:
- 🔊 **Voz habilitada** (OpenAI TTS)
- 🌍 **5 idiomas**: Español, English, 中文, Português, Français
- 🔄 **Rotación automática** de API keys
- 💬 **Chat interactivo** con memoria

### Seguridad:
- ❌ **Sin API keys sensibles** en el código
- 🔒 **Solo información pública** del Price Book
- 🚫 **Sin datos personales** ni credenciales

---

## 🐛 Troubleshooting

### JOE no habla:
1. Verifica que tengas una API key de OpenAI válida
2. Check que el botón de voz esté en 🔊 (no en 🔇)
3. Revisa la consola del navegador (F12) para errores

### JOE no responde:
1. Verifica que al menos una API key esté configurada (OpenAI o Gemini)
2. Check tu conexión a internet
3. Revisa la consola del navegador para mensajes de error

### Errores de cuota (429):
- El sistema rotará automáticamente a la siguiente API key
- Si todas las keys fallan, mostrará un mensaje de error amigable

---

**Última actualización:** Diciembre 2025
**Versión JOE:** 2.0 - ORION TECH Edition
