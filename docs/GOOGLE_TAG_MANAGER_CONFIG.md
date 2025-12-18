# 🏷️ Google Tag Manager - ORION Tech

## ✅ Configuración Completada

### 🆔 GTM Container ID
```
GTM-PNTF4GM9
```

### 📍 Ubicación del Archivo
```
c:\Users\alexp\OneDrive\Documentos\_Proyectos\SEGURITI-USC\docs\orion-bots.html
```

### 🌐 URL Live (GitHub Pages)
```
https://agem2024.github.io/SEGURITI-USC/docs/orion-bots.html
```

### 🔗 Acceso a GTM Dashboard
```
https://tagmanager.google.com/
→ Cuenta: ORION Tech
→ Contenedor: GTM-PNTF4GM9
```

---

## 🎯 ¿Qué es Google Tag Manager?

**Google Tag Manager (GTM)** es un sistema de gestión de etiquetas que te permite actualizar códigos de seguimiento y eventos en tu sitio web **sin editar código HTML**.

### 💡 Beneficios para ORION Tech:

1. **Gestión Centralizada** → Todos los códigos de tracking en un solo lugar
2. **Sin Editar Código** → Cambios desde interfaz web, sin tocar HTML
3. **Múltiples Herramientas** → Google Analytics, Facebook Pixel, Google Ads, etc.
4. **Versionado** → Historial de cambios y rollback fácil
5. **Testing** → Vista previa antes de publicar

---

## 📦 Estado Actual de la Instalación

### ✅ Instalado:
- [x] GTM Container ID: `GTM-PNTF4GM9`
- [x] Script en `<head>` (antes de todo)
- [x] Noscript en `<body>` (inmediatamente después de apertura)
- [x] Google Analytics 4: `G-GY61W7K2B6` (instalado directamente, listo para migrar a GTM)

### 📊 Herramientas Activas:
- ✅ **Google Analytics 4** (instalación directa)
- ✅ **Eventos GA4** (configurados en código HTML)

### 🔄 Próximos Pasos Recomendados:
1. **Migrar Google Analytics a GTM** → Mejor práctica
2. **Migrar eventos personalizados a GTM** → Eventos sin tocar HTML
3. **Configurar conversiones** → Para medir ROI
4. **Agregar Facebook Pixel** → Para ads en Facebook/Instagram
5. **Configurar Remarketing** → Google Ads remarketing tag

---

## 🚀 Cómo Usar Google Tag Manager

### 1. **Acceder al Dashboard**
1. Ve a: https://tagmanager.google.com/
2. Inicia sesión con tu cuenta de Google
3. Selecciona:
   - **Cuenta:** ORION Tech
   - **Contenedor:** GTM-PNTF4GM9

---

### 2. **Estructura de GTM**

GTM funciona con 3 componentes principales:

#### **A. Tags (Etiquetas)**
Son los códigos que quieres ejecutar (Google Analytics, Facebook Pixel, etc.)

#### **B. Triggers (Activadores)**
Definen CUÁNDO se ejecutan las etiquetas (al cargar página, al hacer clic, etc.)

#### **C. Variables**
Datos dinámicos (URL de la página, texto del botón clicado, etc.)

---

### 3. **Migrar Google Analytics a GTM**

#### **Paso 1: Crear Tag de Google Analytics en GTM**

1. En GTM, haz clic en **"Tags"** (Etiquetas)
2. Clic en **"New"** (Nueva)
3. Haz clic en "Tag Configuration"
4. Selecciona **"Google Analytics: GA4 Configuration"**
5. **Measurement ID:** `G-GY61W7K2B6`
6. En "Triggering" (Activación):
   - Selecciona **"All Pages"** (Todas las páginas)
7. **Nombre de la etiqueta:** `GA4 - Page View`
8. Haz clic en **"Save"** (Guardar)

#### **Paso 2: Crear Eventos Personalizados**

**Ejemplo: Clic en "Deploy Now"**

1. Crear **Trigger:**
   - Tags → Triggers → New
   - Trigger Type: **"Click - All Elements"**
   - This trigger fires on: **"Some Clicks"**
   - Conditions:
     - Click Text **contains** `DEPLOY NOW`
   - Nombre: `Click - Deploy Now Button`
   - Save

2. Crear **Tag:**
   - Tags → New
   - Tag Type: **"Google Analytics: GA4 Event"**
   - Configuration Tag: Selecciona `GA4 - Page View`
   - Event Name: `deploy_now_click`
   - Event Parameters:
     - `event_category`: `CTA`
     - `event_label`: `Hero Deploy Now`
   - Triggering: Selecciona `Click - Deploy Now Button`
   - Nombre: `GA4 Event - Deploy Now`
   - Save

#### **Paso 3: Publicar Cambios**

1. Haz clic en **"Submit"** (Enviar) arriba a la derecha
2. Version Name: `Initial GTM Setup with GA4`
3. Version Description: `Added GA4 page view and deploy now click event`
4. Haz clic en **"Publish"** (Publicar)

#### **Paso 4: Remover GA4 del HTML (Opcional)**

Una vez que confirmes que GA4 funciona desde GTM:
- Puedes remover el código de Google Analytics directamente del HTML
- Así todo se gestiona desde GTM

---

### 4. **Agregar Facebook Pixel**

1. **En GTM:**
   - Tags → New
   - Tag Type: **"Custom HTML"**
   - Pega el código del Facebook Pixel
   - Triggering: **All Pages**
   - Save y Publish

2. **Obtener Facebook Pixel:**
   - Ve a: https://business.facebook.com/events_manager
   - Crea un Pixel
   - Copia el código base

---

### 5. **Configurar Google Ads Conversion Tracking**

Cuando lances campañas de Google Ads:

1. En Google Ads, crea una conversión
2. Obtén el **Conversion ID** y **Conversion Label**
3. En GTM:
   - Tags → New
   - Tag Type: **"Google Ads Conversion Tracking"**
   - Conversion ID: `AW-XXXXXXXXX`
   - Conversion Label: `xxxxx-xxxxx`
   - Triggering: (el evento que quieres medir, ej: clic en "Deploy Now")
   - Save y Publish

---

## 🧪 Verificar que GTM Funciona

### Método 1: Google Tag Assistant (Extensión Chrome)

1. Instala: [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Abre tu landing page: `orion-bots.html`
3. Haz clic en el icono de Tag Assistant
4. Deberías ver:
   - ✅ **Google Tag Manager** (verde)
   - ✅ **Google Analytics** (verde)

### Método 2: Vista Previa de GTM (Preview Mode)

1. En GTM Dashboard, haz clic en **"Preview"** (Vista previa)
2. Ingresa la URL: `https://agem2024.github.io/SEGURITI-USC/docs/orion-bots.html`
3. Haz clic en **"Connect"**
4. Se abrirá tu página con GTM en modo debug
5. Verás:
   - Tags que se dispararon
   - Variables capturadas
   - Eventos registrados

### Método 3: Consola del Navegador

1. Abre `orion-bots.html`
2. Presiona `F12` → Console
3. Escribe: `google_tag_manager`
4. Deberías ver el objeto GTM con tus datos

---

## 📊 Eventos Actuales (En HTML - Listos para Migrar a GTM)

| Evento | Categoría | Label | Ubicación |
|--------|-----------|-------|-----------|
| click | CTA | Hero Deploy Now - WhatsApp | Botón principal |
| click | Navigation | Hero View Demos | Botón secundario |
| language_change | Language | EN/ES/ZH/TL/VI | Selector de idioma |
| demo_request | Demos | Restaurant Bot / Booking App / Quote Bot | Links de demos |
| contact | AI Assistants | Alex WhatsApp / XONA Call / ORION Telegram / JARVIS Email | Botones de contacto |
| contact | WhatsApp Float | Floating Button Click | Botón flotante |

**Recomendación:** Migrar todos estos eventos a GTM para gestión centralizada.

---

## 🎯 Conversiones Recomendadas para ORION Tech

### 1. **Conversión Principal: Contacto**
- Click en "Deploy Now"
- Click en botón flotante de WhatsApp
- Click en cualquier botón de AI Assistants

### 2. **Micro-Conversiones:**
- Solicitud de Demo
- Cambio de idioma (engagement)
- Scroll al 50% o 100% de la página
- Tiempo en página > 30 segundos

### 3. **Valor de Conversiones (para Google Ads):**
- Deploy Now Click: **$1,497** (precio promedio de paquete)
- Demo Request: **$300** (lead calificado estimado)
- Contact AI Assistant: **$200** (lead estimado)

---

## 📈 Reportes Clave en Google Analytics (vía GTM)

1. **Conversions → Events**
   - Ver todos los eventos personalizados
   - Tasa de conversión por evento
   
2. **Acquisition → Traffic Acquisition**
   - De dónde vienen los visitantes
   - Qué canales convierten mejor
   
3. **Engagement → Pages and Screens**
   - Páginas más visitadas
   - Tiempo promedio en página
   
4. **User Attributes → Demographics**
   - Edad, género, ubicación
   - Dispositivos (mobile vs desktop)

---

## 🔧 Herramientas Adicionales que Puedes Agregar vía GTM

### Marketing:
- ✅ **Facebook Pixel** → Ads en Facebook/Instagram
- ✅ **LinkedIn Insight Tag** → B2B marketing
- ✅ **Twitter Pixel** → Ads en X (Twitter)
- ✅ **TikTok Pixel** → Ads en TikTok
- ✅ **Pinterest Tag** → Ads en Pinterest

### Analytics Avanzado:
- ✅ **Hotjar** → Mapas de calor y grabaciones de sesión
- ✅ **Crazy Egg** → Heatmaps y A/B testing
- ✅ **FullStory** → Análisis de experiencia de usuario
- ✅ **Mixpanel** → Analytics de producto

### Optimización:
- ✅ **Google Optimize** → A/B testing
- ✅ **Optimizely** → Experimentación avanzada
- ✅ **VWO** → Testing y personalización

### Conversión:
- ✅ **CallRail** → Call tracking
- ✅ **Drift** → Chatbot conversacional
- ✅ **Intercom** → Customer messaging

---

## ⚠️ Mejores Prácticas

### 1. **Versionado**
- Siempre pon un nombre descriptivo a cada versión
- Ejemplo: `v1.0 - Initial Setup`, `v1.1 - Added FB Pixel`

### 2. **Testing**
- SIEMPRE usa Preview Mode antes de publicar
- Verifica que los tags se disparen correctamente

### 3. **Organización**
- Usa nombres consistentes para Tags/Triggers/Variables
- Ejemplo: `GA4 Event - [Nombre del Evento]`

### 4. **Documentación**
- Mantén este archivo actualizado con cada cambio en GTM
- Anota qué tags están activos y para qué sirven

### 5. **No Duplicar Analytics**
- Una vez que migres GA4 a GTM, remueve el código directo del HTML
- Evita tener GA4 instalado 2 veces (directo + GTM)

---

## 🆘 Troubleshooting

### Problema: "GTM no está cargando"
**Solución:**
1. Verifica que el código esté en `<head>` y `<body>`
2. Revisa la consola del navegador (F12) en busca de errores
3. Usa Tag Assistant para verificar instalación

### Problema: "Los eventos no se registran en GA4"
**Solución:**
1. Asegúrate de haber publicado los cambios en GTM (Submit → Publish)
2. Usa Preview Mode para verificar que los triggers se activan
3. Espera hasta 24-48 horas para ver datos en GA4 reportes

### Problema: "Tengo GA4 instalado 2 veces"
**Solución:**
1. Decide: ¿Gestionar desde GTM o directo en HTML?
2. Recomendado: Migrar a GTM y remover código directo
3. Evita duplicación de pageviews y eventos

---

## 📚 Recursos Adicionales

### Documentación Oficial:
- **GTM:** https://support.google.com/tagmanager
- **GA4:** https://support.google.com/analytics
- **Google Ads Conversion Tracking:** https://support.google.com/google-ads/answer/6331314

### Cursos Gratuitos:
- **Google Tag Manager Fundamentals:** https://analytics.google.com/analytics/academy/
- **Analytics Academy:** https://skillshop.withgoogle.com/

### Comunidad:
- **GTM Forum:** https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google-Tag-Manager
- **Measure Slack:** https://www.measure.chat/

---

## ✅ Checklist de Implementación

### Instalación Base:
- [x] GTM instalado en `<head>` (**GTM-PNTF4GM9**)
- [x] GTM noscript en `<body>`
- [x] Google Analytics instalado (directo, listo para migrar)
- [ ] Verificación con Tag Assistant
- [ ] Preview Mode testeado

### Migración a GTM:
- [ ] GA4 migrado a GTM
- [ ] Eventos personalizados migrados a GTM
- [ ] Código GA4 removido del HTML (después de verificar)

### Herramientas Adicionales:
- [ ] Facebook Pixel agregado
- [ ] Google Ads Conversion Tracking configurado
- [ ] Remarketing Tag activado
- [ ] Hotjar o similar para heatmaps

### Optimización:
- [ ] Conversiones configuradas en Google Ads
- [ ] Audiencias de remarketing creadas
- [ ] Dashboard personalizado en GA4

---

**Fecha de configuración:** 2025-12-13  
**GTM Container ID:** GTM-PNTF4GM9  
**Google Analytics ID:** G-GY61W7K2B6  
**Configurado por:** Antigravity AI  
**Estado:** ✅ **GTM INSTALADO - LISTO PARA CONFIGURAR TAGS**
