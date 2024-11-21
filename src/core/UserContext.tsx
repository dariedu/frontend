// UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { IUser, getUserById, getUsers } from '../api/userApi';
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

  // const [refresh, setRefresh] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tgId = query.get('tg_id');

  // Функция для получения токена и пользователя

  const fetchTokenAndUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (tgId) {
        const tokenData: TPostTokenResponse = await postToken(Number(tgId));
        if (tokenData) {
          const mainToken = await postTokenRefresh(tokenData.refresh)
          if (mainToken) {
            try {
              const users = await getUsers(mainToken.access);
              const user = users.find(user => user.tg_id.toString() === tgId);
              if (user) {
                const fetchedUser = await getUserById(user.id, mainToken.access);
                setCurrentUser(fetchedUser);
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
        }
      }
    } catch (error) {
      console.error('Ошибка при получении токена:', error);
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
