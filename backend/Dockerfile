FROM php:8.2-cli

WORKDIR /var/www

COPY . .

RUN apt-get update && apt-get install -y \
  git unzip libzip-dev zip

RUN docker-php-ext-install pdo pdo_mysql zip

RUN curl -sS https://getcomposer.org/installer | php \
  && mv composer.phar /usr/local/bin/composer

RUN composer install --no-dev --optimize-autoloader

EXPOSE 10000

CMD php artisan migrate --force && \
  php artisan db:seed --force && \
  php artisan serve --host=0.0.0.0 --port=10000 & \
  php artisan queue:work --sleep=3 --tries=3 --timeout=90 --max-time=3600
