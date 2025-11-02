import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";

// 🖤 Theme customization — Dark gradient base with soft gray text
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bgGradient: "linear(to-br, gray.900, gray.800)",
        color: "gray.100",
        minHeight: "100vh",
        overflowX: "hidden",
      },
      a: {
        color: "teal.300",
        _hover: { textDecoration: "underline" },
      },
      button: {
        _focus: { boxShadow: "none" },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

// 🚫 Optional: clean the console on dev startup
if (import.meta.env.MODE === "development") {
  console.clear();
}

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
