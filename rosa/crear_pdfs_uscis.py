import markdown
import pdfkit
from datetime import datetime

# Script para convertir documentos MD a PDF profesional para USCIS

def convertir_a_pdf_uscis(archivo_md, archivo_pdf, titulo):
    """
    Convierte archivo Markdown a PDF con formato oficial USCIS
    """
    
    # Leer contenido MD
    with open(archivo_md, 'r', encoding='utf-8') as f:
        contenido_md = f.read()
    
    # Convertir MD a HTML
    html_content = markdown.markdown(contenido_md, extensions=['tables', 'nl2br'])
    
    # CSS profesional estilo USCIS
    css_uscis = """
    <style>
        @page {
            size: letter;
            margin: 1in 1in 1in 1in;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            max-width: 8.5in;
        }
        h1 {
            font-size: 16pt;
            font-weight: bold;
            text-align: center;
            margin-top: 0;
            margin-bottom: 20pt;
            text-transform: uppercase;
        }
        h2 {
            font-size: 14pt;
            font-weight: bold;
            margin-top: 16pt;
            margin-bottom: 8pt;
            border-bottom: 2px solid #000;
        }
        h3 {
            font-size: 13pt;
            font-weight: bold;
            margin-top: 12pt;
            margin-bottom: 6pt;
        }
        p {
            text-align: justify;
            margin-bottom: 8pt;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 12pt 0;
        }
        th, td {
            border: 1px solid #000;
            padding: 6pt;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .firma-seccion {
            margin-top: 40pt;
            page-break-inside: avoid;
        }
        .firma-linea {
            border-top: 1px solid #000;
            width: 3in;
            margin-top: 30pt;
            margin-bottom: 4pt;
        }
        .header-oficial {
            text-align: center;
            font-size: 10pt;
            color: #666;
            margin-bottom: 20pt;
        }
        .footer-oficial {
            text-align: center;
            font-size: 9pt;
            color: #666;
            margin-top: 20pt;
            border-top: 1px solid #ccc;
            padding-top: 8pt;
        }
        strong {
            font-weight: bold;
        }
        em {
            font-style: italic;
        }
    </style>
    """
    
    # Header oficial USCIS
    header_html = f"""
    <div class="header-oficial">
        <strong>U.S. CITIZENSHIP AND IMMIGRATION SERVICES</strong><br>
        FORM I-601A SUPPORTING DOCUMENTATION<br>
        {titulo}<br>
        Generated: {datetime.now().strftime('%B %d, %Y')}
    </div>
    """
    
    # Footer oficial
    footer_html = """
    <div class="footer-oficial">
        This document is submitted as part of Form I-601A Application for Provisional Unlawful Presence Waiver<br>
        All information provided is true and correct to the best of applicant's knowledge
    </div>
    """
    
    # HTML completo
    html_completo = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{titulo}</title>
        {css_uscis}
    </head>
    <body>
        {header_html}
        {html_content}
        {footer_html}
    </body>
    </html>
    """
    
    # Opciones para PDF
    opciones = {
        'page-size': 'Letter',
        'margin-top': '1in',
        'margin-right': '1in',
        'margin-bottom': '1in',
        'margin-left': '1in',
        'encoding': 'UTF-8',
        'no-outline': None,
        'enable-local-file-access': None
    }
    
    try:
        # Convertir a PDF
        pdfkit.from_string(html_completo, archivo_pdf, options=opciones)
        print(f"✓ PDF creado: {archivo_pdf}")
        return True
    except Exception as e:
        print(f"✗ Error creando PDF: {e}")
        # Guardar HTML como alternativa
        html_file = archivo_pdf.replace('.pdf', '.html')
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_completo)
        print(f"✓ HTML alternativo creado: {html_file}")
        print("  Puede abrir el HTML en navegador y usar 'Imprimir a PDF'")
        return False

# Crear PDFs
if __name__ == "__main__":
    
    print("Generando PDFs oficiales para USCIS...")
    print("-" * 60)
    
    # 1. Declaración Personal
    convertir_a_pdf_uscis(
        "migra/DECLARACION_PERSONAL_ALEX_I601A.md",
        "migra/DECLARACION_PERSONAL_ALEX_I601A_OFICIAL.pdf",
        "APPLICANT'S PERSONAL STATEMENT"
    )
    
    # 2. Lista de Gastos
    convertir_a_pdf_uscis(
        "migra/LISTA_GASTOS_MENSUALES_COMPLETA.md",
        "migra/LISTA_GASTOS_MENSUALES_OFICIAL.pdf",
        "MONTHLY EXPENSES LIST"
    )
    
    print("-" * 60)
    print("✓ Proceso completado")
    print("\nSi los PDFs no se generaron, use los archivos HTML:")
    print("1. Abra el HTML en su navegador")
    print("2. Presione Ctrl+P (Imprimir)")
    print("3. Seleccione 'Guardar como PDF'")
    print("4. Configure márgenes a 1 pulgada")
