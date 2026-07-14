$ErrorActionPreference = "Stop"

$projectRoot = "C:\Projects\ezlife-registration"

if (-not (Test-Path $projectRoot)) {
    Write-Host "Project folder not found: $projectRoot" -ForegroundColor Red
    exit 1
}

Set-Location $projectRoot

$replacements = @{
    "app\login\page.tsx" = @(
        @('className="absolute -left-40 top-0 h-[430px] w-[430px] rounded-full bg-[#172B63]/60 blur-[140px]"',
          'className="absolute -left-40 top-0 hidden h-[430px] w-[430px] rounded-full bg-[#172B63]/60 blur-[140px] sm:block"'),
        @('className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/25 blur-[150px]"',
          'className="absolute -right-40 bottom-0 hidden h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/25 blur-[150px] sm:block"'),
        @('backdrop-blur-xl', 'sm:backdrop-blur-xl'),
        @('backdrop-blur-2xl', 'sm:backdrop-blur-2xl')
    )

    "app\register\page.tsx" = @(
        @('className="absolute -left-40 top-10 h-[430px] w-[430px] rounded-full bg-[#172B63]/55 blur-[140px]"',
          'className="absolute -left-40 top-10 hidden h-[430px] w-[430px] rounded-full bg-[#172B63]/55 blur-[140px] sm:block"'),
        @('className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/25 blur-[150px]"',
          'className="absolute -right-40 bottom-0 hidden h-[460px] w-[460px] rounded-full bg-[#6D3BFF]/25 blur-[150px] sm:block"'),
        @('className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"',
          'className="absolute -right-24 -top-24 hidden h-72 w-72 rounded-full bg-white/10 blur-3xl sm:block"'),
        @('className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#8C5CFF]/30 blur-3xl"',
          'className="absolute -bottom-28 -left-20 hidden h-72 w-72 rounded-full bg-[#8C5CFF]/30 blur-3xl sm:block"')
    )

    "app\admin\login\page.tsx" = @(
        @('className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"',
          'className="absolute -left-32 top-20 hidden h-96 w-96 rounded-full bg-violet-600/20 blur-3xl sm:block"'),
        @('className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"',
          'className="absolute -bottom-32 right-0 hidden h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl sm:block"'),
        @('backdrop-blur sm:p-8', 'sm:backdrop-blur sm:p-8')
    )

    "app\member\login\page.tsx" = @(
        @('className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"',
          'className="absolute -left-32 top-20 hidden h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl sm:block"'),
        @('className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"',
          'className="absolute -bottom-32 right-0 hidden h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl sm:block"')
    )

    "app\member\change-password\page.tsx" = @(
        @('className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"',
          'className="absolute -left-32 top-20 hidden h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl sm:block"'),
        @('className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl"',
          'className="absolute -bottom-32 right-0 hidden h-96 w-96 rounded-full bg-violet-500/15 blur-3xl sm:block"'),
        @('backdrop-blur sm:p-8', 'sm:backdrop-blur sm:p-8')
    )

    "app\admin\approvals\page.tsx" = @(
        @('backdrop-blur-sm', 'sm:backdrop-blur-sm')
    )

    "app\member\dashboard\page.tsx" = @(
        @('className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl"',
          'className="absolute -right-20 -top-24 hidden h-72 w-72 rounded-full bg-violet-500/15 blur-3xl sm:block"')
    )
}

$changedFiles = @()

foreach ($relativePath in $replacements.Keys) {
    $fullPath = Join-Path $projectRoot $relativePath

    if (-not (Test-Path $fullPath)) {
        Write-Host "Skipped (not found): $relativePath" -ForegroundColor Yellow
        continue
    }

    $content = Get-Content -Raw -Path $fullPath
    $original = $content

    foreach ($pair in $replacements[$relativePath]) {
        $content = $content.Replace($pair[0], $pair[1])
    }

    if ($content -ne $original) {
        Set-Content -Path $fullPath -Value $content -Encoding UTF8
        $changedFiles += $relativePath
        Write-Host "Updated: $relativePath" -ForegroundColor Green
    }
    else {
        Write-Host "No matching change needed: $relativePath" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "Mobile rendering patch complete." -ForegroundColor Cyan
Write-Host "Changed files: $($changedFiles.Count)" -ForegroundColor Cyan

Write-Host ""
Write-Host "Next commands:" -ForegroundColor White
Write-Host "rmdir /s /q .next"
Write-Host "npm run dev"
