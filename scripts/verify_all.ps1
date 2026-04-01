$mangled_patterns = @(
    "Ă´", "á»™", "á»", "áº", "Æ°", "Ä‘", "Ă³", "á»›", "Há»™i", "Nhiá»‡m"
)

$files = Get-ChildItem -Recurse -Include *.tsx, *.ts, *.css, *.md -Exclude node_modules, .next, .git

Write-Host "Scanning for mangled Vietnamese sequences..." -ForegroundColor Cyan

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    foreach ($pattern in $mangled_patterns) {
        if ($content -match $pattern) {
            Write-Host "FOUND MANGLED PATTERN [$pattern] in: $($file.FullName)" -ForegroundColor Red
            break
        }
    }
}

Write-Host "Scan complete." -ForegroundColor Green
