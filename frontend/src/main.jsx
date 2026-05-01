import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid #2a2a2a',
              borderRadius: '0px',
              fontSize: '0.65rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.1em',
              padding: '0.75rem 1rem',
            },
            success: {
              iconTheme: { primary: '#33ff88', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#ff3333', secondary: '#000' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)