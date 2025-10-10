import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { TransactionsProvider } from './context/TransactionsContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <TransactionsProvider>
        <App />
      </TransactionsProvider>
    </AuthProvider>
)
