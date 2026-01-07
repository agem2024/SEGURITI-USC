import re

# Read the file
with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Find where </footer> ends and replace everything after with clean template
footer_match = re.search(r'</footer>', content, re.IGNORECASE)
if footer_match:
    clean_ending = """</footer>

    <script>
        function setLang(lang) {
            document.body.classList.toggle('es', lang === 'es');
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.textContent.includes(lang.toUpperCase()));
            });
            localStorage.setItem('mcProposalLang', lang);
            if (window.karla && typeof window.karla.setLanguage === 'function') {
                window.karla.setLanguage(lang);
            }
        }
        const savedLang = localStorage.getItem('mcProposalLang');
        if (savedLang) setLang(savedLang);
    </script>

    <script>
        window.KARLA_CONFIG = {
            clientName: 'Alcalde Diego Ortiz',
            clientPhone: '+57 310 888 4014',
            language: localStorage.getItem('mcProposalLang') || 'es',
            ownerName: 'Diego Armando Ortiz Buitrago',
            proposalContext: 'Marca Personal Digital para Alcalde de Obando, Valle del Cauca'
        };
    </script>
    <script src="https://agem2024.github.io/SEGURITI-USC/proposals/jose-loader.js"></script>
    <script src="https://agem2024.github.io/SEGURITI-USC/proposals/karla-assistant.js"></script>

</body>
</html>
"""
    cleaned = content[:footer_match.end()] + clean_ending
    with open('docs/proposals/diego-ortiz-personal/propuesta_orion_diego_ortiz.html', 'w', encoding='utf-8') as f:
        f.write(cleaned)
    print('Fixed with KARLA!')
else:
    print('Footer not found')
