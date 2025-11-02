import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// --- THIS IS THE CLEAN IMPORT BLOCK ---
import { ChakraProvider } from '@chakra-ui/react' 
import { extendTheme } from '@chakra-ui/theme-utils' 
// --- END CLEAN IMPORT BLOCK ---

const theme = extendTheme({})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)