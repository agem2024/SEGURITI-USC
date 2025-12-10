"""
Herramienta para leer documentos Word (.doc y .docx)
Extrae el texto de archivos Word para análisis
"""

import sys
import os

def read_docx(file_path):
    """Lee archivos .docx usando python-docx"""
    try:
        from docx import Document
        doc = Document(file_path)
        full_text = []
        
        print(f"\n{'='*80}")
        print(f"DOCUMENTO: {os.path.basename(file_path)}")
        print(f"RUTA: {file_path}")
        print(f"{'='*80}\n")
        
        for i, para in enumerate(doc.paragraphs, 1):
            if para.text.strip():
                full_text.append(para.text)
        
        content = '\n'.join(full_text)
        print(content)
        print(f"\n{'='*80}")
        print(f"Total de párrafos: {len(full_text)}")
        print(f"Total de caracteres: {len(content)}")
        print(f"{'='*80}\n")
        
        return content
    except ImportError:
        print("ERROR: La librería 'python-docx' no está instalada.")
        print("Instálala con: pip install python-docx")
        return None
    except Exception as e:
        print(f"Error leyendo .docx: {e}")
        return None

def read_doc(file_path):
    """Lee archivos .doc antiguos usando Microsoft Word COM (Windows)"""
    try:
        import win32com.client
        
        # Crear instancia de Word
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        
        # Abrir el documento
        doc = word.Documents.Open(os.path.abspath(file_path))
        
        # Extraer el texto
        text = doc.Content.Text
        
        # Cerrar el documento y Word
        doc.Close(False)
        word.Quit()
        
        print(f"\n{'='*80}")
        print(f"DOCUMENTO: {os.path.basename(file_path)}")
        print(f"RUTA: {file_path}")
        print(f"{'='*80}\n")
        print(text)
        print(f"\n{'='*80}")
        print(f"Total de caracteres: {len(text)}")
        print(f"{'='*80}\n")
        
        return text
    except ImportError:
        print("ERROR: La librería 'pywin32' no está instalada.")
        print("Instálala con: pip install pywin32")
        return None
    except Exception as e:
        print(f"Error leyendo .doc: {e}")
        print("Nota: Necesitas tener Microsoft Word instalado en Windows")
        return None

def read_word_document(file_path):
    """Lee cualquier documento Word (.doc o .docx)"""
    if not os.path.exists(file_path):
        print(f"ERROR: El archivo no existe: {file_path}")
        return None
    
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.docx':
        return read_docx(file_path)
    elif ext == '.doc':
        return read_doc(file_path)
    else:
        print(f"ERROR: Formato no soportado: {ext}")
        print("Solo se admiten archivos .doc y .docx")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python doc_reader.py <ruta_al_archivo.doc[x]>")
        print("\nEjemplo:")
        print("  python doc_reader.py documento.docx")
        sys.exit(1)
    
    file_path = sys.argv[1]
    read_word_document(file_path)
