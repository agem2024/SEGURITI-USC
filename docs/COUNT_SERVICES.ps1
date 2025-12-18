# ORION Price Book - Service Count Analysis
# Cuenta servicios en el archivo maestro

$masterFile = "C:\Users\alexp\OneDrive\Documentos\_Proyectos\PRICE_BOOK_ECOSYSTEM\PRICE_BOOK_MASTER_FULL.md"

Write-Host "Analizando Price Book Master..." -ForegroundColor Cyan

# Leer archivo
$content = Get-Content $masterFile -Raw

# Contar servicios (patron: ### XX-nnn:)
$servicePattern = '###\s+([A-Z]{2,3}-\d{3}):'
$matches = [regex]::Matches($content, $servicePattern)

Write-Host "Total servicios encontrados: $($matches.Count)" -ForegroundColor Green
Write-Host "Listando primeros 20:" -ForegroundColor Yellow

$counter = 0
foreach ($match in $matches | Select-Object -First 20) {
    $counter++
    $code = $match.Groups[1].Value
    Write-Host "  [$counter] $code"
}

Write-Host "`nArchivo tiene 1,375 lineas totales" -ForegroundColor Cyan
Write-Host "Listo para integrar al Price Book HTML" -ForegroundColor Green
