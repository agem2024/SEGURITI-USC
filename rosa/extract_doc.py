"""
Script mejorado para extraer texto de documentos Word
Guarda el contenido en formato UTF-8
"""

import sys
import os

def read_docx_to_file(file_path, output_file):
    """Lee .docx y guarda en archivo de texto"""
    from docx import Document
    doc = Document(file_path)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"DOCUMENTO: {os.path.basename(file_path)}\n")
        f.write("="*80 + "\n\n")
        
        for para in doc.paragraphs:
            if para.text.strip():
                f.write(para.text + "\n")
        
        f.write("\n" + "="*80 + "\n")
        f.write(f"Documento procesado correctamente\n")

def read_doc_to_file(file_path, output_file):
    """Lee .doc y guarda en archivo de texto"""
    import win32com.client
    
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    doc = word.Documents.Open(os.path.abspath(file_path))
    text = doc.Content.Text
    doc.Close(False)
    word.Quit()
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"DOCUMENTO: {os.path.basename(file_path)}\n")
        f.write("="*80 + "\n\n")
        f.write(text)
        f.write("\n" + "="*80 + "\n")
        f.write(f"Documento procesado correctamente\n")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python extract_doc.py <archivo.doc[x]> <salida.txt>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    output_file = sys.argv[2]
    
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.docx':
        read_docx_to_file(file_path, output_file)
    elif ext == '.doc':
        read_doc_to_file(file_path, output_file)
    else:
        print(f"Formato no soportado: {ext}")
        sys.exit(1)
    
    print(f"✓ Contenido extraído a: {output_file}")
