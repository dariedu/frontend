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
import ListOfVolunteers from './components/ListOfVolunteers/ListOfVolunteers.tsx';
import CardTask from './components/ui/Cards/CardTask/CardTask.tsx';
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
        <ListOfVolunteers />

        <CardTask
          title="Ст. Молодежная"
          subtitle="Мск, ул. Бобруйская д.6 к.2"
          timeOrPeriod="15:00"
          points="+2 балла"
          type="time-based"
        />

        <CardTask
          title="Написать текст"
          subtitle="Онлайн"
          timeOrPeriod="За две недели"
          points="+14 баллов"
          type="period-based"
        />

        <CardTask
          title="Уборка территории"
          subtitle="Мск, ул. Бобруйская д.6 к.2"
          timeOrPeriod="15:00"
          additionalTime="25.08" // Это поле не обязательно
          points="+2 балла"
          type="time-based"
        />
        {/* <InputDate /> */}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
