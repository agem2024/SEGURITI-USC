# Restore ALL content to keys.html - Videos + Images
$content = Get-Content 'keys.html' -Raw -Encoding UTF8

# 1. Add Lost Keys Video after hero section (line 47)
$content = $content -replace '(    </section>\r\n\r\n    <section class="services-section">)', @'
    </section>

    <!-- Video Hero: Lost Keys Scenario -->
    <section class="services-section" style="background: linear-gradient(135deg, rgba(255, 107, 0, 0.05), rgba(26, 115, 232, 0.05)); padding: 40px 20px;">
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            <h3 class="lang-en" style="color: var(--napa-orange); font-family: Orbitron; margin-bottom: 20px;">😰 We've All Been There...</h3>
            <h3 class="lang-es" style="color: var(--napa-orange); font-family: Orbitron; margin-bottom: 20px;">😰 Todos Hemos Estado Ahí...</h3>
            <video controls autoplay muted loop style="width: 100%; max-width: 700px; border-radius: 16px; box-shadow: 0 15px 40px rgba(255, 107, 0, 0.3);">
                <source src="assets/images/Lost_Keys_Late_For_Meeting.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p class="lang-en" style="margin-top: 20px; color: var(--text-gray); font-size: 1.1rem;">Don't let lost keys ruin your day. We're here to help - fast!</p>
            <p class="lang-es" style="margin-top: 20px; color: var(--text-gray); font-size: 1.1rem;">No dejes que las llaves perdidas arruinen tu día. ¡Estamos aquí para ayudarte - rápido!</p>
        </div>
    </section>

    <section class="services-section">
'@

# 2. Add 2-video grid before main image
$content = $content -replace '(<section class="services-section">\r\n        <div style="text-align: center; margin-bottom: 50px;">)', @'
<section class="services-section">
        <div style="text-align: center; margin-bottom: 30px;">
            <h3 class="lang-en" style="color: var(--napa-blue); font-family: Orbitron; margin-bottom: 20px;">📹 See Our Process</h3>
            <h3 class="lang-es" style="color: var(--napa-blue); font-family: Orbitron; margin-bottom: 20px;">📹 Vea Nuestro Proceso</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">
                <video controls style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(26, 115, 232, 0.2);">
                    <source src="assets/images/NAPA_AutoCare_Spare_Key_Memory.mp4" type="video/mp4">
                </video>
                <video controls style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(26, 115, 232, 0.2);">
                    <source src="assets/images/lgb_lost _keys a.mp4" type="video/mp4">
                </video>
            </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 50px;">
'@

# 3. Add images to each service card
$content = $content -replace '<h3>🔑 Traditional Metal Keys</h3>', '<img src="assets/images/key_traditional.png" alt="Traditional Key" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;"><h3>🔑 Traditional Metal Keys</h3>'
$content = $content -replace '<h3>🔐 Transponder Keys</h3>', '<img src="assets/images/key_transponder.png" alt="Transponder Key" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;"><h3>🔐 Transponder Keys</h3>'
$content = $content -replace '<h3>🚗 Smart Keys / Fobs</h3>', '<img src="assets/images/key_smart_fob.png" alt="Smart Key Fob" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;"><h3>🚗 Smart Keys / Fobs</h3>'
$content = $content -replace '(<h3 style="color: var\(--accent-gold\);">)⚡ Tesla Key Cards', '<img src="assets/images/key_tesla.png" alt="Tesla Keys" style="width: 100%; max-width: 160px; height: auto; margin: 0 auto 12px; display: block;">$1⚡ Tesla Key Cards'
$content = $content -replace '<h3>🔓 Proximity Keys</h3>', '<img src="assets/images/key_proximity.png" alt="Proximity Key" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;"><h3>🔓 Proximity Keys</h3>'
$content = $content -replace '<h3>🚨 Emergency Service</h3>', '<img src="assets/images/key_emergency.png" alt="Emergency Service" style="width: 100%; max-width: 160px; height: auto; margin: 0 auto 12px; display: block;"><h3>🚨 Emergency Service</h3>'

[System.IO.File]::WriteAllText((Resolve-Path 'keys.html').Path, $content, [System.Text.UTF8Encoding]::new($false))

Write-Host "✅ RESTORED: 3 videos + 6 images added to keys.html!"
