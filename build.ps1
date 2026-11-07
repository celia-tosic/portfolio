# ===================================================================
# build.ps1 - recopie les partials (partials/*.html) dans les pages
#
# Les pages contiennent des marqueurs :
#   <!-- include:footer --> ... <!-- /include:footer -->
# Le contenu entre les marqueurs est remplace par partials/footer.html.
# Le HTML final est donc complet dans chaque page (bon pour le SEO),
# mais le header/footer/CTA ne s'ecrit qu'une seule fois.
#
# Usage : .\build.ps1   (a relancer apres chaque modification d'un partial)
# ===================================================================
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false
$pattern = '(?m)^([ \t]*)<!-- include:([\w-]+) -->.*?<!-- /include:\2 -->'
$options = [System.Text.RegularExpressions.RegexOptions]::Singleline

$partials = @{}
Get-ChildItem (Join-Path $root "partials\*.html") | ForEach-Object {
    $partials[$_.BaseName] = [System.IO.File]::ReadAllText($_.FullName, $utf8).TrimEnd()
}

function Expand-Includes([string]$html, [string]$page, [string]$nl) {
    return [regex]::Replace($html, $pattern, {
        param($m)
        $indent = $m.Groups[1].Value
        $name = $m.Groups[2].Value
        if (-not $partials.ContainsKey($name)) {
            throw "Partial introuvable : partials/$name.html (utilise dans $page)"
        }
        # Les partials peuvent eux-memes contenir des includes.
        $body = Expand-Includes $partials[$name] $page "`n"
        # Lien actif du menu pour la page en cours (classe + annonce pour les lecteurs d'ecran).
        $body = $body.Replace('<li><a href="' + $page + '">', '<li class="current"><a href="' + $page + '" aria-current="page">')
        $lines = ($body -split "`r?`n") | ForEach-Object { if ($_ -eq "") { "" } else { $indent + $_ } }
        return $indent + "<!-- include:$name -->" + $nl + ($lines -join $nl) + $nl + $indent + "<!-- /include:$name -->"
    }, $options)
}

Get-ChildItem (Join-Path $root "*.html") | ForEach-Object {
    $page = $_.Name
    $html = [System.IO.File]::ReadAllText($_.FullName, $utf8)
    if ($html -notmatch "<!-- include:") { return }
    $nl = if ($html.Contains("`r`n")) { "`r`n" } else { "`n" }
    $new = Expand-Includes $html $page $nl
    if ($new -ne $html) {
        [System.IO.File]::WriteAllText($_.FullName, $new, $utf8)
        Write-Host "mis a jour : $page"
    } else {
        Write-Host "inchange   : $page"
    }
}
