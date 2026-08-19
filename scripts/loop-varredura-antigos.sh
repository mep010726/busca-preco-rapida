#!/bin/bash
# Roda a varredura reversa de SKUs antigos em loop, reiniciando sozinha
# sempre que o script Node terminar (por timeout, erro ou queda de rede),
# ate o ponteiro chegar no SKU 1 OU ate varias janelas seguidas nao
# encontrarem mais nenhum produto (sinal de que passou dos SKUs antigos
# que ainda existem). Pensado pra rodar sem supervisao por horas/dias.
#
# Uso: SUPABASE_SERVICE_ROLE_KEY=xxx ./scripts/loop-varredura-antigos.sh

cd "$(dirname "$0")/.."

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Uso: SUPABASE_SERVICE_ROLE_KEY=xxx ./scripts/loop-varredura-antigos.sh"
  exit 1
fi

META=1
# Quantas janelas seguidas com zero produtos encontrados ate desistir.
JANELAS_VAZIAS_PARA_PARAR="${JANELAS_VAZIAS_PARA_PARAR:-5}"
export TAMANHO_JANELA="${TAMANHO_JANELA:-20000}"
export CONCORRENCIA="${CONCORRENCIA:-8}"

janelas_vazias_seguidas=0

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

  # Deixa o output visivel em tempo real (tee) e ainda captura pra checar
  # quantos produtos essa janela encontrou.
  saida=$(node scripts/varrer-skus-antigos.js | tee /dev/stderr)
  encontrados_janela=$(echo "$saida" | grep -o 'ENCONTRADOS_NESTA_JANELA=[0-9]\+' | tail -1 | cut -d= -f2)

  if [ -n "$encontrados_janela" ] && [ "$encontrados_janela" -eq 0 ]; then
    janelas_vazias_seguidas=$((janelas_vazias_seguidas + 1))
    echo "$(date +%Y-%m-%dT%H:%M:%S) janela sem nenhum produto encontrado ($janelas_vazias_seguidas/$JANELAS_VAZIAS_PARA_PARAR seguidas)."
    if [ "$janelas_vazias_seguidas" -ge "$JANELAS_VAZIAS_PARA_PARAR" ]; then
      echo "NADA MAIS ENCONTRADO em $JANELAS_VAZIAS_PARA_PARAR janelas seguidas. Encerrando loop."
      break
    fi
  else
    janelas_vazias_seguidas=0
  fi
done

echo "LOOP_FINALIZADO"
