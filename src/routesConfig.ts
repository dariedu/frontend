import { RouteObject } from 'react-router-dom';
import RegistrationForm from './components/registrationForm/RegistrationForm';
import App from './App';

const routerConfig: RouteObject[] = [
  {
    path: '/',
    Component: App,
  },
  {
    path: '/registration',
    Component: RegistrationForm,
  },
];

export default routerConfig;
