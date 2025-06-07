FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

EXPOSE 8000

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]