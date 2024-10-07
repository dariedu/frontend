import { RouteObject } from 'react-router-dom';
import RegistrationForm from './components/registrationForm/RegistrationForm';
import App from './App';
import CuratorPage from './pages/Curator/CuratorPage';

const routerConfig: RouteObject[] = [
  {
    path: '/',
    Component: App,
  },
  {
    path: '/registration',
    Component: RegistrationForm,
  },
  {
    path: '/curator',
    Component: CuratorPage,
  },
  // {
  //   path: '/volunteer',
  //   Component: VolunteerPage,
  // },
];

export default routerConfig;
