import { useContext} from 'react';
// import { useState, useEffect } from 'react';
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


  // const [deviceType, setDeviceType] = useState<"mobile" | "desktop">('mobile')

  const app = window.Telegram.WebApp;
  app.ready();
  app.disableVerticalSwipes();
  app.isClosingConfirmationEnabled = true;

//    function getDeviceType() {
//       const userAgent = navigator.userAgent.toLowerCase();
//       const isMobile = /mobile|iphone|ipad|ipod|webos|android|iemobile|opera mini|windows phone|blackberry|bb|playbook|mini|windows\sce|palm/i.test(userAgent);

//      if (isMobile) {
//         setDeviceType("mobile");
//       } else {
//         setDeviceType("desktop");
//       }
//   }
  
// useEffect(() => {
// getDeviceType()
// }, [])
  
//   if (deviceType == "desktop") {
//     return <div className='flex justify-center items-center h-screen dark:text-light-gray-white'>Пожалуйста, откройте приложение на мобильном устройстве</div>
//   } else {
    if (isLoading) {
      return <div className='h-screen items-center flex flex-col justify-center '>
        <div className='loader'></div>
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
    //  }
};

export default App;
