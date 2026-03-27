# InventoryApp

A full-stack mobile application for inventory management, featuring a React Native (Expo) frontend and a NestJS backend.

## Architecture Overview

The system is separated into two main components:
- **Mobile Client (Frontend):** Located in the root directory, built with React Native and Expo.
- **REST API (Backend):** Located in the `inventory-backend` directory, built with NestJS and TypeORM.

## Features

- JWT-based authentication with bcrypt password hashing
- Product CRUD operations and comprehensive inventory tracking
- QR and Barcode scanning using Expo Camera
- History logging for all stock modifications (additions and deductions)
- Excel (.xlsx) report generation and export
- Cross-platform support (iOS and Android)

## Tech Stack

### Client
- React Native
- Expo (`expo-camera`, `expo-status-bar`, `expo-linear-gradient`)
- React Navigation (Native Stack)
- AsyncStorage for token management

### Server
- NestJS 
- TypeORM
- PostgreSQL / SQLite
- Passport & JWT for authentication
- `exceljs` for report generation
- `class-validator` & `class-transformer` for DTO validation

## Local Environment Setup

### Requirements
- Node.js v18+
- Expo CLI / Expo Go
- PostgreSQL database (optional, uses SQLite by default depending on TypeORM configuration)

### Backend Initialization

1. Navigate to the backend directory:
   ```bash
   cd inventory-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   PORT=3000
   JWT_SECRET=your_jwt_secret
   # Database configuration variables
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Initialization

1. Open a new terminal session in the project root:
   ```bash
   npm install
   ```
2. Update the API connection string:
   Edit `services/api.ts` and replace the `API_URL` variable with your local machine's IP address.
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Use the Expo Go application on a physical device to scan the generated QR code, or run on a local emulator.

## License

MIT
