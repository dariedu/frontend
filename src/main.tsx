import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import RegistrationForm from './components/registrationForm/RegistrationForm.tsx';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <RegistrationForm />
  </StrictMode>,
);
