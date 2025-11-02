import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// --- 1. Import ONLY ChakraProvider from react ---
import { ChakraProvider } from '@chakra-ui/react' 
// --- 2. Import extendTheme from its source package ---
import { extendTheme } from '@chakra-ui/system'

// --- 2. Create a default theme ---
const theme = extendTheme({})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* --- 3. Pass the theme to the provider --- */}
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)