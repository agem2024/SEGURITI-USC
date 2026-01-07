---
description: Flujo de trabajo estándar para crear propuestas de venta ORION Tech de alto impacto.
---

# 🚀 Workflow: Creación de Propuestas ORION Tech

Este flujo garantiza que CADA propuesta mantenga el estándar de calidad, estructura y persuasión de ORION, evitando omisiones y errores.

## 1. 🕵️ Investigación Profunda (Deep Dive)
Antes de escribir una sola línea de código:
1.  **Perfil del Cliente:** Nombre del dueño, historia (desde cuándo operan), valores (familia, calidad, velocidad?), ubicación.
2.  **Auditoría Digital:** ¿Tienen web? ¿Cómo son sus reviews en Google/Yelp? ¿Tienen Facebook/IG activo?
    *   *Objetivo:* Identificar si son "Old School" (necesitan digitalización) o "Modernos" (necesitan integración).
3.  **Análisis de Competencia:** Identificar 2-3 competidores locales directos. ¿Qué hacen mal? (No responden, web lenta, sin citas online).
4.  **Pain Points (Puntos de Dolor):** Hipótesis basada en su industria.
    *   *Ejemplo Restauración:* Inventario de telas caótico, visitas presenciales inútiles.
    *   *Ejemplo Auto:* Llamadas perdidas, piezas incorrectas.

## 2. 💰 Análisis Financiero y ROI
Genera un documento `ANALISIS_FINANCIERO.md` con:
1.  **Ticket Promedio:** Estima cuánto cobran por servicio (ej. Sofa: $800, Motor: $600).
2.  **Costo de Ineficiencia:**
    *   Llamadas perdidas x Ticket Promedio = Dinero Perdido Diario.
    *   Horas admin/semana x Costo Hora = Gasto Operativo Reducible.
3.  **Proyección ROI:** Calcula cuánto ahorrarán/ganarán con ORION. El ROI debe ser >300%.

## 3. 📝 Clonado y Estructura (CRÍTICO)
**REGLA DE ORO:** NO inventes estructuras nuevas. Clona la estructura ganadora de `propuesta_orion_lgb_autowork.html`.

La propuesta DEBE tener estas 8 SECCIONES obligatorias:
1.  **HERO:** Título, Subtítulo, Botón CTA.
2.  **CAPACITY BANNER:** ∞ Quotes, 0s Hold Time, 24/7 Ops.
3.  **PROBLEMS & SOLUTIONS:** 3 Tarjetas de Dolor vs Solución IA.
4.  **COMPETITIVE LANDSCAPE:** Tabla comparativa (Cliente vs Competencia vs ORION).
5.  **COMPLETE OPERATIONS PLATFORM (Modules):** Mínimo 3-6 tarjetas de módulos detallados con botones "TRY LIVE".
6.  **PARTNERS & PAPERLESS:** Logos de confianza (BBB, etc) y Banner de "Cero Papel".
7.  **ROI BREAKDOWN:**
    *   Grid de Ahorros ($).
    *   Animación VS (Inversión vs Ahorro).
8.  **PRICING & CTA:** 3 Tiers de precio (Smart, Pro, Leader) y Footer completo.

## 4. 🧠 Configuración del Agente IA (Mike/Jose)
1.  Duplicar `jose-assistant.js` a `[nombre]-assistant.js`.
2.  **Entrenamiento:** Configurar `window.[NOMBRE]_CONFIG` con:
    *   `painPoints`: Los detectados en el paso 1.
    *   `pricingTiers`: Los definidos en el paso 2.
    *   `proposalContext`: Un prompt de sistema DETALLADO con manejo de objeciones específico para esa industria.

## 5. 🎨 Adaptación y Assets
1.  **Imágenes:** Generar o buscar imágenes de alta calidad (Hero, Ejemplo de App).
2.  **Textos:** Traducir el contexto de "Auto" a "Industria Cliente" (ej. "Piezas" -> "Telas").
3.  **Links:**
    *   **Inventario:** Usar link `...1qqUcvHx...` (InvAI).
    *   **WhatsApp:** Usar `wa.me` con mensaje personalizado.
    *   **Orion Web:** Usar `agem2024.github.io/SEGURITI-USC/orion-bots.html`.

## 6. ✅ Validación y Deploy
1.  **Checklist Final:**
    *   ¿Funcionan los 3 botones flotantes?
    *   ¿Está la sección de PRECIOS?
    *   ¿El link de la app de inventario NO es el de plomería?
    *   ¿El Agente IA responde con el nombre del cliente?
2.  **Git Push:** Solo subir archivos necesarios. NO subir keys reales en texto plano.

// turbo
## 7. Notificación
Avisar al usuario con el link final: `https://agem2024.github.io/SEGURITI-USC/proposals/[cliente]/[archivo].html`
