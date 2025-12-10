@echo off
echo ====================================
echo SUBIENDO DOCUMENTOS I-601A A GITHUB
echo ====================================
echo.

cd /d "c:\Users\alexp\OneDrive\Documentos\_Proyectos\acwater\rosa\migra"

echo [1/6] Inicializando Git...
git init

echo [2/6] Agregando archivos...
git add .

echo [3/6] Creando commit...
git commit -m "I-601A Complete Documentation - All Files"

echo [4/6] Conectando con GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/agem2024/SEGURITI-USC.git

echo [5/6] Configurando branch main...
git branch -M main

echo [6/6] Subiendo a GitHub...
echo IMPORTANTE: Necesitarás autenticarte con tu cuenta GitHub
echo.
git push -u origin main

echo.
echo ====================================
echo COMPLETADO!
echo ====================================
echo.
echo Documentos subidos a:
echo https://github.com/agem2024/SEGURITI-USC
echo.
echo Ahora Orion puede acceder desde WhatsApp!
echo.
pause
