# ORION Price Book Consolidator
# Extrae servicios del MASTER FULL y los convierte a formato JSON para el HTML

$masterFile = "C:\Users\alexp\OneDrive\Documentos\_Proyectos\PRICE_BOOK_ECOSYSTEM\PRICE_BOOK_MASTER_FULL.md"
$outputFile = "C:\Users\alexp\OneDrive\Documentos\_Proyectos\SEGURITI-USC\docs\services_expanded.json"

Write-Host "Extrayendo servicios del Price Book Master..." -ForegroundColor Cyan

# Leer archivo
$content = Get-Content $masterFile -Raw

# Array para almacenar servicios
$services = @()

# Patrones para detectar servicios (ej: "### FC-123: Kitchen Faucet")
$pattern = '###\s+([A-Z]{2,3}-\d{3}):\s+(.+?)[\r\n]+([\s\S]+?)(?=###|# \d\.|\z)'

# Buscar todos los servicios
$matches = [regex]::Matches($content, $pattern)

Write-Host "Encontrados $($matches.Count) servicios en el archivo maestro" -ForegroundColor Green

$counter = 0
foreach ($match in $matches) {
    $code = $match.Groups[1].Value
    $name = $match.Groups[2].Value.Trim()
    $body = $match.Groups[3].Value
    
    # Extraer precio si existe
    $priceMatch = [regex]::Match($body, '\*\*Precio Cliente:\*\*\s+\*\*\$(\d[\d,]*)\s*-\s*\$(\d[\d,]*)\*\*')
    $priceStandard = if ($priceMatch.Success) { $priceMatch.Groups[1].Value } else { "" }
    
    # Extraer imagen si existe  
    $imageMatch = [regex]::Match($body, '\!\[.+?\]\((.+?)\)')
    $image = if ($imageMatch.Success) { 
        Split-Path $imageMatch.Groups[1].Value -Leaf
    } else { "" }
    
    # Extraer descripción
    $descMatch = [regex]::Match($body, '\*\*Descripción:\*\*\s+(.+?)[\r\n]')
    $description = if ($descMatch.Success) { $descMatch.Groups[1].Value.Trim() } else { "" }
    
    # Extraer tiempo
    $timeMatch = [regex]::Match($body, '\*\*Tiempo:\*\*\s+(.+?)[\r\n|]')
    $time = if ($timeMatch.Success) { $timeMatch.Groups[1].Value.Trim() } else { "" }
    
    # Determinar categoría por código
    $category = switch -Regex ($code) {
        '^AP-' { 'Appliances'; break }
        '^GS-' { 'Gas Systems'; break }
        '^BF-' { 'Backflow'; break }
        '^DM-' { 'Demolition'; break }
        '^DR-' { 'Drain Cleaning'; break }
        '^FC-' { 'Faucets'; break }
        '^FI-' { 'Fixtures'; break }
        '^WH-' { 'Water Heaters'; break }
        '^RP-' { 'Repipe'; break }
        '^NC-' { 'New Construction'; break }
        default { 'Other' }
    }
    
    $counter++
    
    # Crear objeto JSON
    $service = [PSCustomObject]@{
        code = $code
        name = $name
        description = $description
        time = $time
        price_standard = if ($priceStandard) { "`$$priceStandard" } else { "" }
        category = $category
        image = $image
        has_detail = $true
    }
    
    $services += $service
    
    if ($counter % 50 -eq 0) {
        Write-Host "  Procesados: $counter servicios..." -ForegroundColor Yellow
    }
}

# Convertir a JSON
$json = $services | ConvertTo-Json -Depth 10

# Guardar
$json | Out-File $outputFile -Encoding UTF8

Write-Host "`n✓ Completado: $($services.Count) servicios extraídos" -ForegroundColor Green
Write-Host "  Archivo guardado: $outputFile" -ForegroundColor Cyan
Write-Host "`nPresiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
