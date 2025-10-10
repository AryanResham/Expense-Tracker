# Expense Tracker

A full-stack expense tracking application built with React, TypeScript, and Express.js.

## Features

- 📊 Track income and expenses with categories
- 🔐 Firebase authentication with session management
- 📱 Responsive design with Tailwind CSS
- 📄 Pagination and filtering
- 📅 Custom date/time selection
- 💾 Supabase database integration

## TODO

### Upcoming Features

- [ ] **File Processing**: Implement CSV/Excel file upload and parsing for bulk transaction imports
- [ ] **Google Location Integration**: Add location-based transaction classification and merchant identification
- [ ] **Smart Categorization**: Auto-categorize transactions based on location and merchant data
- [ ] **Budgeting**: Set and track monthly/yearly budgets per category
- [ ] **Analytics Dashboard**: Advanced charts and spending insights
- [ ] **Recurring Transactions**: Support for recurring income/expenses
- [ ] **Export Features**: Export data to PDF, CSV, Excel formats

## Tech Stack

**Frontend:**

- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Firebase Auth

**Backend:**

- Express.js + TypeScript
- Supabase (PostgreSQL)
- Firebase Admin SDK

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project
- Supabase project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Backend Setup

1. Navigate to server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Configure Firebase:

   - Download your Firebase service account key
   - Save it as `firebase-secret.json` in the server directory

4. Configure Supabase:
   - Create a `.env` file in the server directory
   - Add your Supabase credentials:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Build and start the server:

```bash
npm run build
npm run dev
```

The server will run on `http://localhost:3001`

### 3. Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Configure Firebase:
   - Create a `.env` file in the client directory
   - Add your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:

```bash
npm run dev
```

The client will run on `http://localhost:5173`

## Running the Application

1. Start the backend server:

```bash
cd server && npm run dev
```

2. Start the frontend in a new terminal:

```bash
cd client && npm run dev
```

3. Open your browser to `http://localhost:5173`

## Database Schema

The application uses these main tables:

- `users` - User authentication data
- `transactions` - Income/expense records
- `categories` - Transaction categories
