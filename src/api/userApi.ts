import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинты для работы с пользователями
const usersEndpoint = `${API_URL}users/`;

// Типизация данных пользователя
interface IUser {
  avatar: string;
  id: number;
  tg_id: number;
  email?: string | null;
  last_name?: string | null;
  name?: string | null;
  surname?: string | null;
  phone?: string | null;
  photo?: string | null;
  volunteer_hour: number;
  point?: number | null;
  rating: number;
  city?: number | null;
  is_superuser: boolean;
  is_staff: boolean;
}

// Типизация данных для запроса (схема UserRequest)
type TUserRequest = {
  email?: string | null;
  last_name?: string | null;
  name?: string | null;
  surname?: string | null;
  phone?: string | null;
  photo?: string | null;
  point?: number | null;
  city?: number | null;
};

// Типизация для параметров фильтрации
interface IGetUsersParams {
  city?: number;
  is_staff?: boolean;
  is_superuser?: boolean;
  rating?: number;
}

// Получение списка пользователей с возможными фильтрами
export const getUsers = async (params?: IGetUsersParams): Promise<IUser[]> => {
  try {
    const response: AxiosResponse<IUser[]> = await axios.get(usersEndpoint, {
      params: params,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Получение информации о пользователе по ID
export const getUserById = async (id: number): Promise<IUser> => {
  if (!id) throw new Error('Invalid userId');

  try {
    const response: AxiosResponse<IUser> = await axios.get(
      `${usersEndpoint}${id}/`,
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
};

// Обновление всей информации о пользователе
export const updateUser = async (
  id: number,
  userData: TUserRequest,
): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await axios.put(
      `${usersEndpoint}${id}/`,
      userData,
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

// Частичное обновление информации о пользователе
export const patchUser = async (
  id: number,
  userData: Partial<TUserRequest>,
): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser> = await axios.patch(
      `${usersEndpoint}${id}/`,
      userData,
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error patching user:', error);
    throw new Error('Failed to patch user');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IUser, TUserRequest };
