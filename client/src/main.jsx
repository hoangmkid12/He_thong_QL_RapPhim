import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1c1c27',
                color: '#e8e8f0',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error: { iconTheme: { primary: '#e50914', secondary: '#fff' } },
            }}
          />
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
