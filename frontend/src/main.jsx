import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'


// 1. Get BOTH from the main '@chakra-ui/react' package
import { ChakraProvider, extendTheme } from '@chakra-ui/react' 

// 2. Create a default theme
const theme = extendTheme({})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

      <AuthProvider>
        {/* 3. Pass the theme to the provider */}
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)