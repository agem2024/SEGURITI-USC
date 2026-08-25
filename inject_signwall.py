import os

file_path = r'C:\Users\alexp\Documentos_Locales_Backup\Morales plumbing\SEGURITI-USC\proposals\sandhu-4423\propuesta_cotizacion_4423_vistapark.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ADD CSS
NEW_CSS = '''
        /* LOCK SCREEN (SIGN-WALL) CSS */
        .blurred-locked {
            filter: blur(8px);
            pointer-events: none;
            user-select: none;
            overflow: hidden;
            height: 100vh;
        }
        #signwall-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(10, 25, 47, 0.85);
            backdrop-filter: blur(4px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .signwall-card {
            background: #fff;
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            border-top: 6px solid #D4AF37;
        }
        .signwall-card h2 { color: #0A192F; margin-bottom: 10px; font-size: 22px; }
        .signwall-card p { color: #334155; font-size: 14px; margin-bottom: 20px; }
        .signwall-canvas-container {
            border: 2px dashed #CBD5E1;
            background: #F8FAFC;
            border-radius: 8px;
            margin-bottom: 15px;
            touch-action: none;
        }
        .signwall-canvas { cursor: crosshair; }
        .signwall-btn {
            background: linear-gradient(135deg, #0A192F 0%, #112240 100%);
            color: #D4AF37;
            border: none;
            padding: 12px 20px;
            width: 100%;
            font-size: 16px;
            font-weight: 700;
            border-radius: 6px;
            cursor: pointer;
            text-transform: uppercase;
            transition: all 0.2s;
        }
        .signwall-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .signwall-input {
            width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #CBD5E1; border-radius: 4px; font-family: 'Inter', sans-serif;
        }
'''

if '/* LOCK SCREEN (SIGN-WALL) CSS */' not in html:
    html = html.replace('</style>', NEW_CSS + '\n</style>')

# 2. Add the wrapper and overlay if not there
if '<div id="proposal-content-wrapper"' not in html:
    html = html.replace('<body>', '<body>\n\n' + '''
<div id="signwall-overlay">
    <div class="signwall-card">
        <h2>🔒 Documento Bloqueado</h2>
        <p>Para desbloquear y visualizar los detalles y precios de su propuesta, por favor firme confirmando que la ha recibido.</p>
        
        <form id="signwall-form">
            <input type="text" id="sw-name" class="signwall-input" placeholder="Nombre completo" required>
            <input type="email" id="sw-email" class="signwall-input" placeholder="Correo electrónico" required>
            <div class="signwall-canvas-container">
                <canvas id="sw-canvas" class="signwall-canvas"></canvas>
            </div>
            <div style="text-align: right; margin-bottom: 10px;">
                <button type="button" onclick="clearSWCanvas()" style="background:none;border:none;color:#B91C1C;cursor:pointer;font-size:12px;text-decoration:underline;">&#8634; Borrar firma</button>
            </div>
            <button type="submit" id="sw-submit-btn" class="signwall-btn">Firmar Acuso de Recibo y Desbloquear</button>
        </form>
    </div>
</div>

<div id="proposal-content-wrapper" class="blurred-locked">
''')

# We need to close the wrapper right before the old esign-portal
if '<style>\n#esign-portal' in html: # The old injection CSS starts with this
    html = html.replace('<style>\n#esign-portal', '</div>\n\n<style>\n#esign-portal')
else:
    # Just replace the start of esign portal with closing div
    idx_esign = html.find('<div id="esign-portal"')
    if idx_esign != -1 and '</div>\n<div id="esign-portal"' not in html:
        html = html.replace('<div id="esign-portal"', '</div>\n<div id="esign-portal"')


# 3. Add JS for the signwall logic before </body>
NEW_JS = '''
<script>
(function(){
  'use strict';
  function el(id){return document.getElementById(id);}
  var swC = el('sw-canvas');
  if(!swC) return;
  var swCtx = swC.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  swC.width = (swC.parentElement.offsetWidth - 4) * dpr;
  swC.height = 150 * dpr;
  swC.style.width = '100%';
  swC.style.height = '150px';
  swCtx.scale(dpr, dpr);
  swCtx.strokeStyle = '#0A192F'; swCtx.lineWidth = 2.5; swCtx.lineCap = 'round'; swCtx.lineJoin = 'round';
  
  var swDrawing = false;
  var swSigned = false;
  
  function getPos(e){
      var r = swC.getBoundingClientRect();
      var t = e.touches ? e.touches[0] : e;
      return { x: (t.clientX - r.left) * (swC.offsetWidth / r.width), y: (t.clientY - r.top) * (swC.offsetHeight / r.height) };
  }
  
  swC.addEventListener('mousedown', function(e){ swDrawing = true; var p = getPos(e); swCtx.beginPath(); swCtx.moveTo(p.x, p.y); });
  swC.addEventListener('mousemove', function(e){ if(!swDrawing) return; var p = getPos(e); swCtx.lineTo(p.x, p.y); swCtx.stroke(); swSigned = true; });
  swC.addEventListener('mouseup', function(){ swDrawing = false; });
  swC.addEventListener('mouseleave', function(){ swDrawing = false; });
  
  swC.addEventListener('touchstart', function(e){ e.preventDefault(); swDrawing = true; var p = getPos(e); swCtx.beginPath(); swCtx.moveTo(p.x, p.y); }, {passive: false});
  swC.addEventListener('touchmove', function(e){ e.preventDefault(); if(!swDrawing) return; var p = getPos(e); swCtx.lineTo(p.x, p.y); swCtx.stroke(); swSigned = true; }, {passive: false});
  swC.addEventListener('touchend', function(){ swDrawing = false; });
  
  window.clearSWCanvas = function(){ swCtx.clearRect(0,0,swC.width,swC.height); swSigned = false; };
  
  el('signwall-form').addEventListener('submit', async function(e){
      e.preventDefault();
      var n = el('sw-name').value.trim();
      var em = el('sw-email').value.trim();
      if(!n || !em){ alert('Complete su nombre y correo.'); return; }
      if(!swSigned){ alert('Por favor firme en el recuadro con su dedo o mouse.'); return; }
      
      var btn = el('sw-submit-btn');
      btn.disabled = true;
      btn.textContent = 'Desbloqueando...';
      
      var d = {
          _subject: '[MORALES PLUMBING] RECEIPT SIGNED - MP-PROP-4423V-SANDHU',
          event: 'ACKNOWLEDGMENT_OF_RECEIPT_SIGNWALL',
          proposal_id: 'MP-PROP-4423V-SANDHU',
          client: 'Manjinder S. Sandhu & Gurmeet K. Sandhu',
          signer_name: n,
          signer_email: em,
          signed_at: new Date().toISOString()
      };
      
      try {
          await fetch('https://formspree.io/f/xanyzgll', {
              method: 'POST',
              headers: {'Accept':'application/json','Content-Type':'application/json'},
              body: JSON.stringify(d)
          });
      } catch(ex){}
      
      // Unlock
      el('signwall-overlay').style.display = 'none';
      var wrapper = el('proposal-content-wrapper');
      wrapper.classList.remove('blurred-locked');
      wrapper.style.height = 'auto';
      wrapper.style.overflow = 'visible';
      
      // Also pre-fill the acceptance form at the bottom
      if(el('accept-name')) el('accept-name').value = n;
      if(el('accept-email')) el('accept-email').value = em;
      
      // Auto scroll to top
      window.scrollTo(0,0);
  });
})();
</script>
'''

if 'id="signwall-form"' not in html or 'function clearSWCanvas' not in html:
    html = html.replace('</body>', NEW_JS + '\n</body>')

# Remove the old step 1 (receipt) from the bottom portal since it's now handled by the signwall
if 'id="receipt-section"' in html:
    # Just visually hide the old receipt section and activate the acceptance section immediately
    html = html.replace('id="receipt-section"', 'id="receipt-section" style="display:none;"')
    html = html.replace('id="acceptance-locked"', 'id="acceptance-locked" style="display:none;"')
    html = html.replace('id="acceptance-form-wrapper" style="display:none;"', 'id="acceptance-form-wrapper" style="display:block;"')
    html = html.replace('<div class="esign-step active" id="step-1-indicator">', '<div class="esign-step done" id="step-1-indicator" style="display:none;">')
    html = html.replace('<div class="esign-step" id="step-2-indicator">', '<div class="esign-step active" id="step-2-indicator">')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Sign-wall injected successfully.")
