import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from './Context/ChatProvider';
const root = ReactDOM.createRoot(document.getElementById('root')); // Create root using 'createRoot'
root.render(
  
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
);
