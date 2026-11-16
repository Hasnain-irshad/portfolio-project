import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LightboxProvider } from './contexts/LightboxContext'
import './index.css'
import App from './App.jsx'

// AuthProvider now lives inside the lazily-loaded admin chunk (AdminRoutes),
// so public visitors don't trigger a token check against the API.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LightboxProvider>
          <App />
        </LightboxProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
