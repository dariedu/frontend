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

import Calendar from './components/Calendar/Calendar.tsx';
import Notification from './components/ui/Notification/Notification.tsx';
import DeliveryType from './components/ui/Hr/DeliveryType.tsx';
import DeliveryInfo from './components/ui/Hr/DeliveryInfo.tsx';
import ActionsVolunteer from './components/ActionsVolunteer/ActionsVolunteer.tsx';
import Points from './components/ui/Points/Points.tsx';
import { ThemeProvider } from './components/ui/ThemeToggle/ThemeContext.tsx';
import Functions from './components/ui/Functions/Functions.tsx';
// import InputDate from './components/InputDate/InputDate.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
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
        <Calendar />
        <Notification message="Подтвердите  участие в доставке сегодня" />
        <DeliveryType />
        <DeliveryInfo />
        <ActionsVolunteer
          visibleActions={['Пригласить друга', 'Помочь деньгами']}
          showThemeToggle={false}
        />
        <Points points={2} />
        <Functions />
        <div className="bg-light-gray-1 dark:bg-dark-gray-1">Example</div>
        {/* <InputDate /> */}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
