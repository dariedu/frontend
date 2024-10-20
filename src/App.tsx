import { useEffect, useContext } from 'react';
import RegistrationPage from './pages/Registration/RegistrationPage.tsx';
import VolunteerPage from './pages/Volunteer/VolunteerPage.tsx';
import CuratorPage from './pages/Curator/CuratorPage.tsx';
import { UserContext } from './core/UserContext.tsx';
import './App.css';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  const { currentUser, isLoading } = useContext(UserContext);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    // Пользователь не зарегистрирован
    return <RegistrationPage />;
  } else if (currentUser.is_staff) {
    // Пользователь зарегистрирован и является сотрудником
    return <CuratorPage />;
  } else {
    // Пользователь зарегистрирован, но не является сотрудником
    return <VolunteerPage />;
  }
};

export default App;
