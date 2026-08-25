import os

file_path = r'C:\Users\alexp\Documentos_Locales_Backup\Morales plumbing\SEGURITI-USC\proposals\sandhu-4423\propuesta_cotizacion_4423_vistapark.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('id="esign-portal"')
print('Found at:', idx)

css_idx = content.find('<style>')
print('Style at:', css_idx)

