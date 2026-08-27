#!/bin/bash
# Roda a checagem de avisos de estoque em loop, a cada poucos minutos.
# Pensado pra rodar sem supervisao por horas/dias, igual a varredura de
# SKUs antigos.
#
# Uso: SUPABASE_SERVICE_ROLE_KEY=xxx ./scripts/loop-checar-alertas.sh

cd "$(dirname "$0")/.."

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Uso: SUPABASE_SERVICE_ROLE_KEY=xxx ./scripts/loop-checar-alertas.sh"
  exit 1
fi

INTERVALO_SEGUNDOS="${INTERVALO_SEGUNDOS:-600}"

while true; do
  echo "$(date +%Y-%m-%dT%H:%M:%S) checando avisos de estoque..."
  node scripts/checar-alertas-estoque.js
  sleep "$INTERVALO_SEGUNDOS"
done
