import { useEffect, useContext} from 'react';
import { useState } from 'react';
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
    const tg = window.Telegram.WebApp;
    tg.ready();
  }, []);

  const [deviceType, setDeviceType] = useState<"mobile" | "desktop">('mobile')
 

   function getDeviceType() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /mobile|iphone|ipad|ipod|webos|android|iemobile|opera mini|windows phone|blackberry|bb|playbook|mini|windows\sce|palm/i.test(userAgent);

     if (isMobile) {
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
  }
  
useEffect(() => {
getDeviceType()
}, [])
  
  if (deviceType == "desktop") {
    return <div className='flex justify-center items-center h-screen'>Пожалуйста, откройте приложение на мобильном устройстве</div>
  } else {
    if (isLoading) {
      return <div className='h-screen items-center flex flex-col justify-center '>
        <img className='h-10' src="./../../src/assets/icons/mainLogo.gif"/>
      </div>;
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
     }
  
};

export default App;
