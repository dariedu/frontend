import { RouteObject } from 'react-router-dom';
import RegistrationPage from './pages/Registration/RegistrationPage';
import App from './App';
import CuratorPage from './pages/Curator/CuratorPage';
import VolunteerPage from './pages/Volunteer/VolunteerPage'
const routerConfig: RouteObject[] = [
  {
    path: '/',
    Component: App,
  },
  {
    path: '/registration',
    Component: RegistrationPage,
  },
  {
    path: '/curator',
    Component: CuratorPage,
  },
  {
    path: '/volunteer',
    Component: VolunteerPage,
  },
];

export default routerConfig;
