// TokenContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import {  postTokenRefresh, postToken } from '../api/apiRegistrationToken';
import { useLocation } from 'react-router-dom';
// Создаем типы для контекста
interface ITokenContext {
  token: string | null
}

const defaultTokenContext: ITokenContext = {
  token: null,
};

// Создаем сам контекст
export const TokenContext = createContext<ITokenContext>(defaultTokenContext);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refresh, setRefresh] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // const [count, setCount] = useState<number>(0)
  

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tgId = query.get('tg_id');
  let tgIdFromTgParams: number;
  useEffect(() => {
   if (window.Telegram?.WebApp?.initDataUnsafe) {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    tgIdFromTgParams = initData.user?.id;
    // console.log("init data unsafe tgId", initData.user?.id)
  }
}, [])

const fetchRefreshToken = async () => {
      try {
        if (refresh) {
        const mainToken = await postTokenRefresh(refresh)
           if (mainToken) {
             setToken(mainToken.access);
             setRefresh(mainToken.refresh)
            //  console.log('new token received', new Date())
          }
         } else {
          if (tgId) {
            const mainToken = await postToken(Number(tgId))
               if (mainToken) {
                setToken(mainToken.access);
                 setRefresh(mainToken.refresh)
                //  console.log('new token received', new Date())
            }
          } else {
            if (tgIdFromTgParams) {
              const mainToken = await postToken(tgIdFromTgParams)
                 if (mainToken) {
                  setToken(mainToken.access);
                   setRefresh(mainToken.refresh)
                  //  console.log('new token received', new Date())
                 }
               }
             } 
         }
      } catch (err) {
        console.log(err, "fetchRefreshToken has failed tokenContext")
        setRefresh(null)
}
  }
  
  useEffect(() => { fetchRefreshToken() }, []);

  
   // Обновляем токен каждые 5 минут
   useEffect(() => {
    const intervalId = setInterval(fetchRefreshToken, 5 * 60 * 999); // ~5 минут
    // Очистка интервала при размонтировании
    return () => clearInterval(intervalId);
  }, []);

  
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // Вкладка снова видна, обновляем токен
      setRefresh(null)
      fetchRefreshToken();
      // console.log('document is visible again')
    }
  };

  // Подписываемся на событие изменения видимости
  document.addEventListener('visibilitychange', handleVisibilityChange);
  // Очистка подписки при размонтировании компонента
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);
  
  return (
    <TokenContext.Provider value={{token}}>
      {children}
    </TokenContext.Provider>
  );
};
