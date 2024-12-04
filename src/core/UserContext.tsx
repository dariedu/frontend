// UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { IUser, getCurrentUser } from '../api/userApi';
import { postToken, postTokenRefresh, type TPostTokenResponse } from '../api/apiRegistrationToken';
import { useLocation } from 'react-router-dom';


// Создаем типы для контекста
interface IUserContext {
  currentUser: IUser | null
  isLoading: boolean
  error: string | null
}

const defaultUserContext: IUserContext = {
  currentUser: null,
  isLoading: true,
  error: null
};

// Создаем сам контекст
export const UserContext = createContext<IUserContext>(defaultUserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tgId = query.get('tg_id');

  let tgIdFromTgParams: number;
  useEffect(() => {
   if (window.Telegram?.WebApp?.initDataUnsafe) {
    const initData = window.Telegram.WebApp.initDataUnsafe;
    tgIdFromTgParams = initData.user?.id;
    console.log("init data unsafe tgId", initData.user?.id)
  }
}, [])

  // Функция для получения токена и пользователя
  ///// делаем две проверки, либо берем тг айди из объекта location или из тг объекта initDataUnsafe
  const fetchTokenAndUser = async () => {
    setIsLoading(true);
    setError(null);
    if (tgId) {
      try {
        const tokenData: TPostTokenResponse = await postToken(Number(tgId));
        if (tokenData) {
          const mainToken = await postTokenRefresh(tokenData.refresh)
          if (mainToken) {
            try {
              const users = await getCurrentUser(mainToken.access);
              let user = users[0]
              if (user) {
                if ( user.photo && ! user.photo.includes('https')) {
                  user.photo = user.photo.replace('http', 'https')
                  user.photo += '?_=' + Date.now()///добавляем временную метку, чтобы не брать фото из кэша
                 }
                setCurrentUser(user);
              } else {
                console.error('Пользователь не найден');
                setError('Пользователь не найден');
              }
            } catch (err) {
              console.error('Ошибка при получении данных пользователя:', error);
              setError('Ошибка при получении данных пользователя');
            } finally {
              setIsLoading(false)
            }
          }      
        } else {
          setIsLoading(false);
          console.error('Ошибка при получении токена:', error);
        }
      } catch (error) {
      setIsLoading(false)
      console.error('Ошибка при получении токена:', error);
       }
    } else {
      if (tgIdFromTgParams) {
        try {
          const tokenData: TPostTokenResponse = await postToken(Number(tgIdFromTgParams));
          if (tokenData) {
            const mainToken = await postTokenRefresh(tokenData.refresh)
            if (mainToken) {
              try {
                const users = await getCurrentUser(mainToken.access);
                let user = users[0]
                if (user) {
                  if ( user.photo && ! user.photo.includes('https')) {
                    user.photo = user.photo.replace('http', 'https')
                    user.photo += '?_=' + Date.now()///добавляем временную метку, чтобы не брать фото из кэша
                  }
                  setCurrentUser(user);
                } else {
                  console.error('Пользователь не найден');
                  setError('Пользователь не найден');
                }
              } catch (err) {
                console.error('Ошибка при получении данных пользователя:', error);
                setError('Ошибка при получении данных пользователя');
              } finally {
                setIsLoading(false)
              }
            }      
          } else {
            setIsLoading(false);
            console.error('Ошибка при получении токена:', error);
          }
        } catch (err) {
        } 
      } else {
         console.error("tgId was not provided")
      }
    }
  
  };

  useEffect(() => {
    fetchTokenAndUser()
  }, [tgId]);

  
  return (
    <UserContext.Provider value={{ currentUser, isLoading, error}}>
      {children}
    </UserContext.Provider>
  );
};
