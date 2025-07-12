// main.tsx
import React from 'react'
import './App.css'
import { createRoot } from 'react-dom/client'
import AppRoutes from './functions/Router'
import 'react-toastify/dist/ReactToastify.css'
import { StompProvider } from './functions/StompProvider'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StompProvider>
      <AppRoutes />
    </StompProvider>
  </React.StrictMode>
)
