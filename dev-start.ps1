# ============================================================
#  BookIt - Dev Startup Script
#  Starts: PostgreSQL (Docker) + Backend (Maven) + Frontend (Vite)
# ============================================================

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== BookIt Dev Startup ===" -ForegroundColor Cyan

# ---- 1. Start PostgreSQL via Docker ----
Write-Host "`n[1/3] Starting PostgreSQL..." -ForegroundColor Yellow

$existing = docker ps -a --filter "name=bookit-postgres" --format "{{.Names}}"
if ($existing -eq "bookit-postgres") {
    $running = docker ps --filter "name=bookit-postgres" --format "{{.Names}}"
    if ($running -ne "bookit-postgres") {
        Write-Host "  -> Restarting existing container..." -ForegroundColor Gray
        docker start bookit-postgres | Out-Null
    } else {
        Write-Host "  -> Already running." -ForegroundColor Green
    }
} else {
    Write-Host "  -> Creating new container..." -ForegroundColor Gray
    docker run -d `
        --name bookit-postgres `
        -e POSTGRES_DB=citas `
        -e POSTGRES_USER=postgres `
        -e POSTGRES_PASSWORD=1234 `
        -p 5432:5432 `
        postgres:16 | Out-Null
}

Write-Host "  -> Waiting for PostgreSQL to be ready..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# ---- 2. Start Backend ----
Write-Host "`n[2/3] Starting Spring Boot backend on port 3000..." -ForegroundColor Yellow
$backendPath = Join-Path $ROOT "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'BACKEND - Spring Boot' -ForegroundColor Cyan; mvn spring-boot:run"
Write-Host "  -> Backend starting in a new window. Wait ~15 seconds for it to be ready." -ForegroundColor Green

# ---- 3. Start Frontend ----
Write-Host "`n[3/3] Starting Vite frontend on port 5173..." -ForegroundColor Yellow
$frontendPath = Join-Path $ROOT "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'FRONTEND - Vite' -ForegroundColor Cyan; npm run dev"
Write-Host "  -> Frontend starting in a new window." -ForegroundColor Green

Write-Host "`n=== All services launched! ===" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:   http://localhost:3000" -ForegroundColor White
Write-Host "  Health:    http://localhost:3000/health" -ForegroundColor White
Write-Host "`nWait ~20 seconds for Spring Boot to fully start, then open http://localhost:5173`n" -ForegroundColor Yellow
