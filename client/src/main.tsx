import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AxiosInstance from './api/AxiosInstance.ts';
import 'material-icons/iconfont/material-icons.css';
import './styles/App.css'
import App from './App.tsx'

// providers
import { AuthProvider } from './features/auth';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/ToastProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const { data } = await AxiosInstance.get(queryKey[0] as string);
        return data;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);