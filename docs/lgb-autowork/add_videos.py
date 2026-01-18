# -*- coding: utf-8 -*-
import re

# Read the file
with open('keys.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Lost Keys Video after hero section
hero_video = '''    </section>

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

    <section class="services-section">'''

content = content.replace('    </section>\r\n\r\n    <section class="services-section">', hero_video, 1)

# 2. Add 2-video grid
video_grid = '''<section class="services-section">
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
        
        <div style="text-align: center; margin-bottom: 50px;">'''

content = content.replace('<section class="services-section">\r\n        <div style="text-align: center; margin-bottom: 50px;">', video_grid, 1)

# Write back
with open('keys.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Videos restored successfully!")
