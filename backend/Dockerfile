FROM php:8.2-fpm

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git unzip libzip-dev zip \
  && docker-php-ext-install pdo pdo_mysql zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php \
  && mv composer.phar /usr/local/bin/composer

# Copy application
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose Railway dynamic port (Railway injects PORT automatically)
ENV PORT 8080
EXPOSE 8080

# Start queue worker and php-fpm (no artisan serve)
CMD php artisan migrate --force && \
  php artisan db:seed --force && \
  php artisan serve --host=0.0.0.0 --port=8080 & \
  php artisan queue:work --sleep=3 --tries=3 --timeout=90 --max-time=3600
