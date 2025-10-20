import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// import routes
import { authRoutes } from './routes/authRoute.js';
import { categoriesRoute } from './routes/categoriesRoute.js';
import { expensesRoute } from './routes/transactionRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/healthz', (_req, res) => {

  res.status(200).json({
    success: true,
    message: 'Expense Tracker API is running!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      categories: '/api/categories', 
      expenses: '/api/expenses'
    }
  });
});


// Api routes

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoute);
app.use("/api/transactions", expensesRoute);

// error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({ error: err.code || "INTERNAL_ERROR", message: err.message || "Something went wrong" })
})  


// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation available at http://localhost:${PORT}`);
});