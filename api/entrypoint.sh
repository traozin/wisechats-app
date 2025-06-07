#!/bin/bash

composer install
php artisan key:generate
php artisan migrate
php artisan db:seed

php artisan serve --host=0.0.0.0 --port=8000