# ===================================================================
# deploy.ps1 - prepare le site a envoyer sur O2switch
#
# 1. regenere les pages (build.ps1)
# 2. copie dans dist/ uniquement les fichiers utiles au site en ligne
#    (dist/ est vide puis recree a chaque lancement : ne rien y ranger)
# 3. ajoute un numero de version aux liens vers site.css et main.js,
#    pour que les visiteurs recoivent toujours la derniere version
# 4. cree codelia-site.zip, a envoyer puis extraire dans public_html
#
# Usage : .\deploy.ps1
# ===================================================================
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$dist = Join-Path $root "dist"
$zip = Join-Path $root "codelia-site.zip"
$utf8 = New-Object System.Text.UTF8Encoding $false

# Fichiers du site en ligne (a completer si une page ou une image est ajoutee)
$files = @(
    "index.html", "about.html", "services.html", "contact.html",
    "css/site.css",
    "js/main.js",
    "images/portrait-400.jpg", "images/portrait-800.jpg",
    "favicon.ico", "favicon-16x16.png", "favicon-32x32.png",
    "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png",
    "site.webmanifest",
    "llms.txt",
    ".htaccess"
)

# 1. Pages a jour
& (Join-Path $root "build.ps1")

# 2. Copie des fichiers utiles
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
foreach ($file in $files) {
    $source = Join-Path $root $file
    if (-not (Test-Path $source)) { throw "Fichier manquant : $file" }
    $target = Join-Path $dist $file
    New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
    Copy-Item $source $target
}

# 3. Numero de version = empreinte du contenu (change seulement si le fichier change)
function Get-Version([string]$path) {
    return (Get-FileHash $path -Algorithm SHA256).Hash.Substring(0, 8).ToLower()
}
$cssVersion = Get-Version (Join-Path $root "css/site.css")
$jsVersion = Get-Version (Join-Path $root "js/main.js")
Get-ChildItem (Join-Path $dist "*.html") | ForEach-Object {
    $html = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    $html = $html.Replace('href="css/site.css"', 'href="css/site.css?v=' + $cssVersion + '"')
    $html = $html.Replace('src="js/main.js"', 'src="js/main.js?v=' + $jsVersion + '"')
    [System.IO.File]::WriteAllText($_.FullName, $html, $utf8)
}

# 4. Archive zip (chemins avec "/" pour le serveur Linux d'O2switch)
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $zip) { Remove-Item $zip -Force }
$distPath = (Resolve-Path $dist).Path.TrimEnd('\')
$archive = [System.IO.Compression.ZipFile]::Open($zip, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem $distPath -Recurse -File -Force | ForEach-Object {
        $entry = $_.FullName.Substring($distPath.Length + 1).Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entry) | Out-Null
    }
} finally {
    $archive.Dispose()
}

$count = (Get-ChildItem $distPath -Recurse -File -Force).Count
$size = [math]::Round((Get-Item $zip).Length / 1KB)
Write-Host ""
Write-Host "Pret : $count fichiers dans dist\ et codelia-site.zip ($size Ko)"
