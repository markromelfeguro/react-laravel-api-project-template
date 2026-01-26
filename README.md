# React + Laravel API Project Template

A modern, full-stack project template featuring a **React 19** frontend and a **Laravel 12** API backend.  
It comes pre-configured for **real-time capabilities** using **Laravel Reverb** and **secure authentication** via **Laravel Sanctum**.

---

## Tech Stack

### Frontend (Client)

- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios (with custom interceptors for session management)
- **Real-time:** Laravel Echo & Pusher JS

### Backend (Server)

- **Framework:** Laravel 12
- **Real-time Server:** Laravel Reverb
- **Authentication:** Laravel Sanctum
- **PHP Version:** 8.2+

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- PHP 8.2 or higher
- Composer
- Node.js & npm
- A database (MySQL or SQLite)

---

## Backend Installation (Server)

1. Navigate to the `server` directory.
2. Copy the environment file:

   ```bash
   cp .env.example .env


Run the automated setup script:

composer run setup


This script handles:

Dependency installation

Environment setup

Application key generation

Database migrations

Frontend Installation (Client)

Navigate to the client directory.

Install dependencies:

npm install


Configure your .env file with your API and Reverb credentials:

VITE_API_URL=http://localhost:8000
VITE_REVERB_APP_KEY=your-reverb-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http

Available Scripts
Backend (server/composer.json)

composer run setup
Automates the initial project setup.

composer run dev
Starts the Laravel server, Reverb, queue listener, and Vite simultaneously using concurrently.

composer run test
Runs the PHPUnit test suite.

Frontend (client/package.json)

npm run dev
Starts the Vite development server.

npm run build
Builds the project for production.

npm run lint
Runs ESLint for code quality checks.

Features
🔐 Secure Authentication

Uses Laravel Sanctum for cookie-based authentication

Axios instance configured with withCredentials: true

Global interceptors handle:

401 Unauthorized errors

422 Validation errors

⚡ Real-time Events

Powered by Laravel Reverb

Pre-configured echo.ts utility

Supports private channel authorization via a custom API endpoint

🎨 Modern Styling

Built with Tailwind CSS 4

Includes Material Icons

Fully responsive, modern UI foundation

License

This project is open-source and available under the MIT License.


If you want, I can also:
- Add **badges** (Laravel, React, license, etc.)
- Split it into **Server / Client** README files
- Tailor it for **GitHub**, **GitLab**, or **Bitbucket**
- Add **Docker** or **deployment** instructions

Just say the word 🚀