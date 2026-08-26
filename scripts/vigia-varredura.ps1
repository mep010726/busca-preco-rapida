# Vigia da varredura de SKUs antigos: se o log parar de crescer por muito
# tempo (sinal de processo travado - ja aconteceu antes por instabilidade
# de rede), mata SO o processo node dessa varredura especifica. O
# loop.sh que ja fica rodando em paralelo (num "while true") reinicia o
# node sozinho no ciclo seguinte - o vigia so precisa cutucar, nao
# precisa reiniciar o loop.sh do zero (o que exigiria a service role key
# de novo).
#
# Uso: powershell -File scripts\vigia-varredura.ps1

$repoRoot = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $repoRoot "scripts\varredura-antigos-6.log"
$limiteMinutos = 5

Write-Host "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss') [vigia] iniciado. Observando $logPath (limite de $limiteMinutos min sem atividade)."

while ($true) {
    if (Test-Path $logPath) {
        $ultimaEscrita = (Get-Item $logPath).LastWriteTime
        $minutosParado = (New-TimeSpan -Start $ultimaEscrita -End (Get-Date)).TotalMinutes

        if ($minutosParado -ge $limiteMinutos) {
            $processos = Get-CimInstance Win32_Process -Filter "name='node.exe'" |
                Where-Object { $_.CommandLine -match 'varrer-skus-antigos\.js' }

            if ($processos) {
                foreach ($p in $processos) {
                    Write-Host "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss') [vigia] log parado ha $([math]::Round($minutosParado,1)) min - reiniciando processo (PID $($p.ProcessId))."
                    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
                }
            } else {
                Write-Host "$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss') [vigia] log parado, mas nenhum processo da varredura encontrado (loop.sh pode ja ter terminado)."
            }
        }
    }
    Start-Sleep -Seconds 60
}
