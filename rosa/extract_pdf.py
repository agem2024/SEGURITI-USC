"""
Extractor de PDF con contraseña
Extrae información de PDFs protegidos
"""

import sys
from PyPDF2 import PdfReader
import os

def extract_pdf_with_password(pdf_path, password, output_file):
    """Extrae texto de PDF protegido por contraseña"""
    try:
        # Abrir el PDF
        reader = PdfReader(pdf_path)
        
        # Si está encriptado, intentar con la contraseña
        if reader.is_encrypted:
            print(f"📄 El PDF está protegido. Intentando con contraseña...")
            if reader.decrypt(password):
                print(f"✅ Contraseña correcta! Desencriptando...")
            else:
                print(f"❌ Contraseña incorrecta")
                return False
        
        # Extraer texto de todas las páginas
        total_pages = len(reader.pages)
        print(f"\n📖 Total de páginas: {total_pages}")
        
        full_text = []
        
        for i, page in enumerate(reader.pages, 1):
            print(f"Procesando página {i}/{total_pages}...")
            text = page.extract_text()
            if text.strip():
                full_text.append(f"\n{'='*80}\n")
                full_text.append(f"PÁGINA {i}\n")
                full_text.append(f"{'='*80}\n\n")
                full_text.append(text)
        
        # Guardar en archivo
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"DOCUMENTO: {os.path.basename(pdf_path)}\n")
            f.write(f"{'='*80}\n\n")
            f.write(''.join(full_text))
            f.write(f"\n\n{'='*80}\n")
            f.write(f"Total de páginas procesadas: {total_pages}\n")
            f.write(f"Total de caracteres: {len(''.join(full_text))}\n")
        
        print(f"\n✅ Contenido extraído exitosamente a: {output_file}")
        print(f"📊 Total de caracteres: {len(''.join(full_text))}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Uso: python extract_pdf.py <archivo.pdf> <contraseña> <salida.txt>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    password = sys.argv[2]
    output_file = sys.argv[3]
    
    if not os.path.exists(pdf_path):
        print(f"❌ El archivo no existe: {pdf_path}")
        sys.exit(1)
    
    extract_pdf_with_password(pdf_path, password, output_file)
