import { useEffect } from 'react';
import CuratorPage from './pages/Curator/CuratorPage.tsx';
import './App.css';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
  }, []);

  return (
    <>
      <CuratorPage />
    </>
  );
};

export default App;
