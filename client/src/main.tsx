import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'material-icons/iconfont/material-icons.css';
import './styles/App.css'
import App from './App.tsx'

// providers
import { AuthProvider } from './features/auth';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/ToastProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)