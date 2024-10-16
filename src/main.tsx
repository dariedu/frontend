import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.scss';
import { ThemeProvider } from './components/ui/ThemeToggle/ThemeContext.tsx';
import { UserProvider } from './core/UserContext.tsx';
import routerConfig from './routesConfig.ts';
import RegistrationPage from './pages/Registration/RegistrationPage';
import CuratorPage from './pages/Curator/CuratorPage';
import VolunteerPage from './pages/Volunteer/VolunteerPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Router>
        <UserProvider>
          <Routes>
            <Route path={routerConfig[0].path} element={<App />} />
            <Route path={routerConfig[1].path} element={<RegistrationPage />} />
            <Route path={routerConfig[2].path} element={<CuratorPage />} />
            <Route path={routerConfig[3].path} element={<VolunteerPage />} />
          </Routes>
        </UserProvider>
      </Router>
    </ThemeProvider>
  </StrictMode>,
);
