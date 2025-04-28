# Task Management Application

## Overview
A full-stack, modern task management application with user authentication, task CRUD, and filtering. Built with Next.js (React, TypeScript, Tailwind CSS) for the frontend and Node.js/Express with MongoDB for the backend.

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Radix UI, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, JWT, Mongoose

## Features
- User registration and login with JWT authentication
- Create, view, update, and delete tasks
- Filter tasks by status (complete/incomplete)
- Task priority, status, and creation date
- Responsive, modern UI with reusable components
- Secure password hashing and protected API routes

## Project Structure
```
├── client/   # Next.js frontend (TypeScript, Tailwind CSS)
├── server/   # Express backend (Node.js, MongoDB)
└── README.md # Project documentation
```

## Setup Instructions

### 1. Backend (server)
1. Navigate to the `server` directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in `server/` with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

### 2. Frontend (client)
1. Navigate to the `client` directory:
   ```bash
   cd client
   npm install
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage
- Register a new account or log in.
- Add, edit, complete, or delete tasks.
- Filter tasks by status and set priorities.

## Scripts
- **Frontend:**
  - `npm run dev` – Start Next.js dev server
  - `npm run build` – Build for production
  - `npm run start` – Start production server
- **Backend:**
  - `npm run dev` – Start server with nodemon
  - `npm start` – Start server

## Environment Variables
- **Backend:** Requires `MONGO_URI` and `JWT_SECRET` in `.env`.
- **Frontend:** No special environment variables required by default.

## License
MIT

---

This project is organized for a clean separation of backend and frontend. All UI is built with Tailwind CSS and Radix UI components for a modern, accessible experience.
