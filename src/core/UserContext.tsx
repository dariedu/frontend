import React, { createContext, useState, useEffect } from 'react';
import { IUser, getUserById, getUsers } from '../api/userApi';
import { postToken } from '../api';
import { getTelegramParams } from '../core/getQueryParams';

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

  // Используем getTelegramParams для получения данных из Telegram
  const { tgId, tgUsername } = getTelegramParams();

  // Функция для получения токена и пользователя
  const fetchUserAndToken = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (tgId) {
        console.log(`Получаем токен для tg_id: ${tgId}`);
        const tokenData = await postToken({
          tg_id: tgId,
        });

        if (tokenData && tokenData.access) {
          console.log(
            `Получен токен для tg_id: ${tgId}, access: ${tokenData.access}`,
          );
          setToken(tokenData.access);

          // Получаем данные пользователя по tg_id
          const users = await getUsers(tokenData.access);
          const user = users.find(user => user.tg_id === tgId);
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
        console.error('tg_id отсутствует в initDataUnsafe');
        setError('tg_id отсутствует в initDataUnsafe');
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
    if (tgUsername) {
      console.log(`Telegram username: ${tgUsername}`);
    }
  }, [tgId, tgUsername]);

  useEffect(() => {
    fetchUserAndToken();
  }, [tgId]);

  return (
    <UserContext.Provider value={{ currentUser, token, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};
