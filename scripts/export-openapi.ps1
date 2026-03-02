$ErrorActionPreference = "Stop"

$uri = "http://localhost:8080/v3/api-docs"
$outDir = "docs"
$outFile = Join-Path $outDir "swagger.json"

if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

Write-Host "Baixando OpenAPI de $uri ..."
Invoke-WebRequest -Uri $uri -OutFile $outFile

Write-Host "OK -> $outFile"