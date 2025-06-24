import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <MantineProvider>
    <AuthProvider>
    <BrowserRouter><App /></BrowserRouter></AuthProvider>
    </MantineProvider>
  </StrictMode>
)
