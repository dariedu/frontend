import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import RegistrationForm from './components/registrationForm/RegistrationForm.tsx';
import TabBar from './components/ui/TabBar/TabBar.tsx';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <RegistrationForm />
    <TabBar />
  </StrictMode>,
);
