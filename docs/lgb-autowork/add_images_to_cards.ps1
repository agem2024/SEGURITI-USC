# Fix keys.html - Add images to service cards
$content = Get-Content 'keys.html' -Raw -Encoding UTF8

# Add image to each service card right after the opening div tag
# We'll insert before each <h3> tag

$content = $content -replace '(<div class="service-card featured">)\s*(<h3)', '$1`r`n                <img src="assets/images/tesla_key_collection.png" alt="Key Services" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px 12px 0 0; margin: -20px -20px 15px -20px;">`r`n                $2'

# For the Tesla specialty card with the badge, insert after the badge div
$content = $content -replace '(SPECIALTY</div>)\s*(<h3 style="color: var\(--accent-gold\);">)', '$1`r`n                <img src="assets/images/tesla_key_collection.png" alt="Tesla Keys" style="width: 100%; height: 180px; object-fit: cover; border-radius: 12px 12px 0 0; margin: 0 -20px 15px -20px;">`r`n                $2'

[System.IO.File]::WriteAllText((Resolve-Path 'keys.html').Path, $content, [System.Text.UTF8Encoding]::new($false))

Write-Host "✅ Images added to all service cards!"
