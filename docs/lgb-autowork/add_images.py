# -*- coding: utf-8 -*-
# Add 6 unique images to service cards

with open('keys.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add image before each service card heading
replacements = [
    ('🔑 Traditional Metal Keys</h3>', '<img src="assets/images/key_traditional.png" alt="Traditional Keys" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;">🔑 Traditional Metal Keys</h3>'),
    ('🔐 Transponder Keys</h3>', '<img src="assets/images/key_transponder.png" alt="Transponder Key" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;">🔐 Transponder Keys</h3>'),
    ('🚗 Smart Keys / Fobs</h3>', '<img src="assets/images/key_smart_fob.png" alt="Smart Key Fob" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;">🚗 Smart Keys / Fobs</h3>'),
    ('⚡ Tesla Key Cards & Fobs</h3>', '<img src="assets/images/key_tesla.png" alt="Tesla Keys" style="width: 100%; max-width: 160px; height: auto; margin: 0 auto 12px; display: block;">⚡ Tesla Key Cards & Fobs</h3>'),
    ('🔓 Proximity Keys</h3>', '<img src="assets/images/key_proximity.png" alt="Proximity Key" style="width: 100%; max-width: 140px; height: auto; margin: 0 auto 12px; display: block;">🔓 Proximity Keys</h3>'),
    ('🚨 Emergency Service</h3>', '<img src="assets/images/key_emergency.png" alt="Emergency Service" style="width: 100%; max-width: 160px; height: auto; margin: 0 auto 12px; display: block;">🚨 Emergency Service</h3>')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('keys.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 6 images added to service cards!")
