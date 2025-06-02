#!/bin/bash
set -e

# until nc -z -v -w30 $DB_HOST $DB_PORT; do
  echo "Aguardando conexão com o banco de dados..."
  sleep 5
# done

if [ ! -f .env ]; then
  echo "Copiando .env.example para .env..."
  cp .env.example .env
fi

echo "Instalando dependências com composer..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "Gerando APP_KEY..."
php artisan key:generate

echo "Rodando migrations e seed..."
php artisan migrate --force --seed

find_free_port() {
  local port=8000
  while ss -ltn | grep -q ":$port "; do
    port=$((port+1))
  done
  echo $port
}

PORT=$(find_free_port)

echo "Iniciando Laravel na porta $PORT"
php artisan serve --host=0.0.0.0 --port=$PORT
