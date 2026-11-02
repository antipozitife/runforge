#!/bin/zsh
set -eu
cd -- "$(dirname -- "$0")"

if command -v node >/dev/null 2>&1; then
  RUNFORGE_NODE="$(command -v node)"
else
  RUNFORGE_NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi

if [[ ! -x "$RUNFORGE_NODE" ]]; then
  print 'Для запуска нужен Node.js 22.12 или новее. Инструкция — в README.md.'
  read -r '?Нажмите Enter, чтобы закрыть окно.'
  exit 1
fi

if [[ ! -f node_modules/vite/bin/vite.js ]]; then
  print 'Сначала установите зависимости командой pnpm install или npm install в этой папке.'
  read -r '?Нажмите Enter, чтобы закрыть окно.'
  exit 1
fi

RUNFORGE_URL='http://127.0.0.1:5173/'

if command -v curl >/dev/null 2>&1 && curl --silent --fail --max-time 1 "$RUNFORGE_URL" >/dev/null; then
  print 'Runforge уже запущен. Открываю сайт…'
  open "$RUNFORGE_URL"
  exit 0
fi

print 'Runforge запускается. Чтобы остановить сайт, нажмите Ctrl+C.'
"$RUNFORGE_NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort &
RUNFORGE_SERVER_PID=$!

cleanup() {
  kill "$RUNFORGE_SERVER_PID" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

for attempt in {1..30}; do
  if ! kill -0 "$RUNFORGE_SERVER_PID" 2>/dev/null; then
    print 'Не удалось запустить Runforge. Проверьте сообщение Vite выше.'
    exit 1
  fi
  if curl --silent --fail --max-time 1 "$RUNFORGE_URL" >/dev/null 2>&1; then
    open "$RUNFORGE_URL"
    wait "$RUNFORGE_SERVER_PID"
    exit $?
  fi
  sleep 0.2
done

print 'Сервер запущен, но не ответил вовремя. Адрес: '"$RUNFORGE_URL"
wait "$RUNFORGE_SERVER_PID"
