#!/bin/bash

docker-compose up -d
docker-compose exec web composer install
cp .env.dev .env
docker-compose exec web php artisan key:generate
docker-compose exec web php artisan migrate
docker-compose exec web php artisan db:seed
docker-compose exec web php artisan storage:link
npm i
npm run dev