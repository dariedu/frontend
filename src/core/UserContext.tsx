// UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { IUser, getUserById, getUsers } from '../api/userApi';
import { postToken } from '../api';
import { useLocation } from 'react-router-dom';

// Создаем типы для контекста
interface IUserContext {
  currentUser: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const defaultUserContext: IUserContext = {
  currentUser: null,
  token: null,
  isLoading: true,
  error: null,
};

// Создаем сам контекст
export const UserContext = createContext<IUserContext>(defaultUserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tgId = query.get('tg_id');
 // const tgId = '1567882993'
  //const tgId = '205758925'
  //const tgId = '1695164858' // Евгений
  // Функция для получения токена и пользователя
  const fetchUserAndToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (tgId) {
        console.log(`Получаем токен для tg_id: ${tgId}`);
        const tokenData = await postToken({
          tg_id: Number(tgId),
        });

        if (tokenData && tokenData.access) {
          console.log(
            `Получен токен для tg_id: ${tgId}, access: ${tokenData.access}`,
          );
          setToken(tokenData.access);

          // Передаем токен в getUsers
          const users = await getUsers(tokenData.access);
          const user = users.find(user => user.tg_id.toString() === tgId);
          if (user) {
            const fetchedUser = await getUserById(user.id, tokenData.access);
            setCurrentUser(fetchedUser);
          } else {
            console.error('Пользователь не найден');
            setError('Пользователь не найден');
          }
        } else {
          console.error('Токен доступа отсутствует');
          setError('Токен доступа отсутствует');
        }
      } else {
        console.error('tg_id отсутствует в параметрах URL');
        setError('tg_id отсутствует в параметрах URL');
      }
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      setError('Ошибка при получении данных пользователя');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndToken();
  }, [tgId]);

  return (
    <UserContext.Provider value={{ currentUser, token, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};
