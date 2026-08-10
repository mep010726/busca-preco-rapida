#!/bin/bash
# Roda a varredura reversa de SKUs antigos em loop, reiniciando sozinha
# sempre que o script Node terminar (por timeout, erro ou queda de rede),
# ate o ponteiro atingir a META. Pensado pra rodar sem supervisao por
# horas/dias.
#
# Uso: SUPABASE_SERVICE_ROLE_KEY=xxx ./scripts/loop-varredura-antigos.sh

cd "$(dirname "$0")/.."

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Uso: SUPABASE_SERVICE_ROLE_KEY=xxx ./scripts/loop-varredura-antigos.sh"
  exit 1
fi

META=12500000
export TAMANHO_JANELA="${TAMANHO_JANELA:-20000}"
export CONCORRENCIA="${CONCORRENCIA:-8}"

while true; do
  ponteiro=$(curl -s "https://izjymicfgxtqafhlceyf.supabase.co/rest/v1/indice_estado?chave=eq.menor_sku_escaneado&select=valor" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    | grep -o '[0-9]\+' | tail -1)

  # Se a consulta falhar (ex: sem internet no momento), "ponteiro" vem
  # vazio. Antes isso era tratado como "meta atingida" e o loop parava
  # de vez. Agora so continua tentando de novo depois de uma pausa.
  if [ -z "$ponteiro" ]; then
    echo "$(date +%Y-%m-%dT%H:%M:%S) nao foi possivel consultar o ponteiro (sem rede?). Tentando de novo em 30s."
    sleep 30
    continue
  fi

  echo "$(date +%Y-%m-%dT%H:%M:%S) ponteiro atual: $ponteiro"
  if [ "$ponteiro" -le "$META" ]; then
    echo "META ATINGIDA (ponteiro=$ponteiro, meta=$META). Encerrando loop."
    break
  fi

  node scripts/varrer-skus-antigos.js
done

echo "LOOP_FINALIZADO"
