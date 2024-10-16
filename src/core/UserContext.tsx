// UserContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { IUser, getUserById, getUsers } from '../api/userApi';
import { postToken } from '../api';
import { useLocation } from 'react-router-dom';

// Создаем типы для контекста
interface IUserContext {
  currentUser: IUser | null;
  token: string | null;
  loading: boolean;
}

const defaultUserContext: IUserContext = {
  currentUser: null,
  token: null,
  loading: true,
};

// Создаем сам контекст
export const UserContext = createContext<IUserContext>(defaultUserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const tgId = query.get('tg_id');

  // Функция для получения токена и пользователя
  const fetchUserAndToken = async () => {
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
          }
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndToken();
  }, [tgId]);

  return (
    <UserContext.Provider value={{ currentUser, token, loading }}>
      {children}
    </UserContext.Provider>
  );
};
