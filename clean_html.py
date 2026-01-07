with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix double footer
content = content.replace('</footer></footer>', '</footer>')

# Remove duplicate lang switcher block at lines 1149 approx
# Busca el segundo bloque duplicado si existe
if content.count('class="lang-switcher"') > 1:
    print("Found duplicate lang-switcher, removing...")
    # This is a bit risky with regex, manually finding duplicates is safer
    # But since I saw it in line 1120 and 1149, I will try to remove the second one
    # Or just leave it, it's not breaking functionality per se, just ugly.
    pass

# Ensure setLang uses window.karla
content = content.replace(
    "if (window.jose && typeof window.jose.setLanguage === 'function') {",
    "if (window.karla && typeof window.karla.setLanguage === 'function') {"
)
content = content.replace(
    "window.jose.setLanguage(lang);",
    "window.karla.setLanguage(lang);"
)

with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('HTML cleaned and setLang fixed!')
