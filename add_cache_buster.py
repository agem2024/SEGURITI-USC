with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'karla-assistant.js"></script>',
    'karla-assistant.js?v=KARLA_V1"></script>'
)
content = content.replace(
    'jose-loader.js"></script>',
    'jose-loader.js?v=LOADER_V1"></script>'
)

with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Cache busters added!')
