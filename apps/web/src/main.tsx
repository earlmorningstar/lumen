import '@/lib/axios';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@/lib/stores';
import router from '@/router';
import './styles/globals.css';

// Initialize auth state before mounting the app
useAuthStore.getState().initializeAuth().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});