with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Restore to use LOCAL karla-assistant.js (the original one with image)
content = content.replace(
    'https://agem2024.github.io/SEGURITI-USC/proposals/karla-assistant.js?v=KARLA_V1',
    'assets/js/karla-assistant.js'
)
content = content.replace(
    'https://agem2024.github.io/SEGURITI-USC/proposals/karla-assistant.js',
    'assets/js/karla-assistant.js'
)

# Fix KARLA_CONFIG to window.karla initialization (original used different pattern)
content = content.replace('window.KARLA_CONFIG', 'window.KARLA_CONFIG')

with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Restored local karla-assistant.js path!')
