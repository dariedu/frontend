import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import RegistrationForm from './components/registrationForm/RegistrationForm.tsx';
import TabBar from './components/TabBar/TabBar.tsx';
import './index.scss';
import NextTask from './components/NextTask/NextTask.tsx';
import NavigationBar from './components/NavigationBar/NavigationBar.tsx';
import avatar from './assets/avatar.svg';
import Search from './components/Search/Search.tsx';
import InputDate from './components/InputDate/InputDate.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <RegistrationForm />
      <TabBar />
      <NextTask
        taskName="Написать текст"
        taskType="Онлайн"
        taskDate="3 окт"
        taskPoints={8}
      />
      <NavigationBar variant="volunteerForm" title="Анкета волонтера" />
      <NavigationBar variant="mainScreen" avatarUrl={avatar} />
      <Search />
      <InputDate />
    </BrowserRouter>
  </StrictMode>,
);
