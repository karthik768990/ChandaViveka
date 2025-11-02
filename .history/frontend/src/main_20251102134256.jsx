import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import './index.css';

const theme = extendTheme({
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  colors: {
    brand: {
      50: '#e3f9f9',
      100: '#c8e7e9',
      200: '#9bd1d5',
      300: '#6dbbc0',
      400: '#4fa5ab',
      500: '#358c92',
      600: '#276d73',
      700: '#1a4e53',
      800: '#0c3034',
      900: '#011a1d',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
