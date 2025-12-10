"""
Organizador de Fotos para Caso I-601A
Analiza y organiza fotos cronológicamente
"""

import os
import sys
from datetime import datetime
from pathlib import Path

def extract_date_from_filename(filename):
    """Extrae fecha del nombre de archivo formato YYYYMMDD"""
    try:
        # Formato: 20191208_155846.jpg
        if filename.startswith('20'):
            date_str = filename[:8]
            date_obj = datetime.strptime(date_str, '%Y%m%d')
            return date_obj, date_str
    except:
        pass
    return None, None

def organize_photos(directory, output_file):
    """Organiza todas las fotos por fecha"""
    
    photos = []
    
    # Buscar todas las fotos
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, directory)
                
                date_obj, date_str = extract_date_from_filename(file)
                
                if date_obj:
                    photos.append({
                        'filename': file,
                        'path': rel_path,
                        'full_path': filepath,
                        'date': date_obj,
                        'date_str': date_str,
                        'size': os.path.getsize(filepath)
                    })
    
    # Ordenar por fecha
    photos.sort(key=lambda x: x['date'])
    
    # Generar reporte
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# ORGANIZACIÓN DE FOTOS PARA CASO I-601A\n")
        f.write("# ALEX GIOVANNI ESPINOSA MORALES\n\n")
        f.write(f"Total de fotos encontradas: {len(photos)}\n")
        f.write("="*80 + "\n\n")
        
        current_year = None
        current_month = None
        
        for i, photo in enumerate(photos, 1):
            year = photo['date'].year
            month = photo['date'].month
            month_name = photo['date'].strftime('%B')
            
            # Encabezado de año
            if year != current_year:
                f.write(f"\n{'='*80}\n")
                f.write(f"AÑO {year}\n")
                f.write(f"{'='*80}\n\n")
                current_year = year
                current_month = None
            
            # Encabezado de mes
            if month != current_month:
                f.write(f"\n--- {month_name.upper()} {year} ---\n\n")
                current_month = month
            
            # Información de foto
            f.write(f"{i}. FOTO: {photo['filename']}\n")
            f.write(f"   Fecha: {photo['date'].strftime('%d de %B de %Y')} ({photo['date'].strftime('%A')})\n")
            f.write(f"   Ruta: {photo['path']}\n")
            f.write(f"   Tamaño: {photo['size']:,} bytes\n")
            f.write(f"   [ ] Seleccionada para caso I-601A\n")
            f.write(f"   [ ] Descripción: _________________________________\n")
            f.write(f"   [ ] Personas: ___________________________________\n")
            f.write(f"   [ ] Evento: _____________________________________\n")
            f.write(f"\n")
        
        # Resumen por año
        f.write("\n" + "="*80 + "\n")
        f.write("RESUMEN POR AÑO\n")
        f.write("="*80 + "\n\n")
        
        years = {}
        for photo in photos:
            year = photo['date'].year
            years[year] = years.get(year, 0) + 1
        
        for year in sorted(years.keys()):
            f.write(f"{year}: {years[year]} fotos\n")
        
        # Sugerencias
        f.write("\n" + "="*80 + "\n")
        f.write("SUGERENCIAS PARA SELECCIÓN\n")
        f.write("="*80 + "\n\n")
        f.write("Seleccionar 20-30 fotos que muestren:\n\n")
        f.write("1. CUIDADO FAMILIAR (5-7 fotos)\n")
        f.write("   - Alex ayudando/cuidando a Olivia\n")
        f.write("   - Actividades diarias juntos\n")
        f.write("   - Visitas médicas\n\n")
        
        f.write("2. REUNIONES FAMILIARES (3-5 fotos)\n")
        f.write("   - Toda la familia junta\n")
        f.write("   - Con hermanas (Stefanny, Susana)\n")
        f.write("   - Con padrastro Carlos\n\n")
        
        f.write("3. CELEBRACIONES (3-5 fotos)\n")
        f.write("   - Navidad, Año Nuevo\n")
        f.write("   - Cumpleaños\n")
        f.write("   - Día de Acción de Gracias\n\n")
        
        f.write("4. TRABAJO PROFESIONAL (2-3 fotos)\n")
        f.write("   - Alex en su trabajo de plomería\n")
        f.write("   - Proyectos completados\n\n")
        
        f.write("5. ACTIVIDADES COMUNITARIAS (2-3 fotos)\n")
        f.write("   - Iglesia\n")
        f.write("   - Eventos comunitarios\n")
        f.write("   - Voluntariado\n\n")
        
        f.write("6. VIDA COTIDIANA (5-7 fotos)\n")
        f.write("   - Rutina familiar\n")
        f.write("   - Compras, paseos\n")
        f.write("   - Tiempo en familia\n\n")
    
    print(f"\n✅ Organización completada!")
    print(f"📊 Total de fotos: {len(photos)}")
    print(f"📅 Período: {photos[0]['date'].strftime('%Y-%m-%d')} a {photos[-1]['date'].strftime('%Y-%m-%d')}")
    print(f"📄 Reporte guardado en: {output_file}")
    
    return photos

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python organize_photos.py <directorio_fotos> <archivo_salida>")
        sys.exit(1)
    
    directory = sys.argv[1]
    output_file = sys.argv[2]
    
    organize_photos(directory, output_file)
