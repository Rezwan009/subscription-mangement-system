# Subscription Management System

A robust and modern Subscription Management System built with **Laravel** and **React (Vite)**. The application features a premium user experience, dark mode support, plan-aware modals, and automated background email notifications.

## 🚀 Features

- **Dual Mode**: Seamless Dark/Light mode support.
- **Subscription Plans**: Comprehensive plan management for multiple vendors.
- **Premium Access**: Access-controlled products based on subscription status.
- **Background Emails**: Queued email notifications for subscription confirmations.
- **Atomic Transactions**: Robust database handling to ensure data integrity.
- **Plan Awareness**: Dynamic modal that recognizes and highlights current subscriptions.

---

## 🛠️ Installation & Setup

### Prerequisites
- PHP 8.2+ & Composer
- Node.js & NPM
- MySQL
- Mailpit (for local email testing)

### 1. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# DB_DATABASE=subscription_db
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seed the database
php artisan migrate --seed

# Start the Laravel server
php artisan serve

# (Optional) Start the queue worker for emails
php artisan queue:work
```

### 2. Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 🔑 User Credentials (Seed Data)

The database seeder (`php artisan db:seed`) provides the following test accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` |
| **User** | `user@example.com` | `password` |

---

## 📸 Technical Highlights

- **Frontend**: React, Tailwind CSS, Axios, React-Toastify, React Context API.
- **Backend**: Laravel, MySQL, Queue/Background Jobs, DB Transactions, Form Requests.
- **Styling**: Class-based dark mode following modern UI/UX principles.
- **Email**: Beautifully designed HTML templates using Blade.

---

## 📧 Email Testing

The system is configured to use **Gmail SMTP** for email delivery. You can see the configuration in the `.env` file under `MAIL_*` keys.

### Queue Worker
Since `QUEUE_CONNECTION` is set to `database`, you **must** run the following command to process the background subscription emails:

```bash
php artisan queue:work
```

---

*Rezwan Ahmed | Senior Software Engineer*
