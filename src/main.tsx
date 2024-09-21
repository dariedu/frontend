import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import RegistrationForm from './components/registrationForm/RegistrationForm.tsx';
import TabBar from './components/TabBar/TabBar.tsx';
import './index.scss';
import NextTask from './components/NextTask/NextTask.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <RegistrationForm />
    <TabBar />
    <NextTask
      taskName="Написать текст"
      taskType="Онлайн"
      taskDate="3 окт"
      taskPoints={8}
    />
  </StrictMode>,
);
