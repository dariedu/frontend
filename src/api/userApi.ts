import axios, { AxiosResponse } from 'axios';
import { IUser } from '../core/types';


// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;
// Эндпоинты для работы с пользователями
const usersEndpoint = `${API_URL}/users/`;


export const getCurrentUser = async (access: string): Promise<IUser[]> => {
  try {
    const response: AxiosResponse<IUser[]> = await axios.get(`${API_URL}/current_user/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
  return response.data
  } catch (err:any){
    console.error('Error fetching current user:', err);
    throw new Error('Failed to fetch current user');
}
}



// Получение списка пользователей с возможными фильтрами
export const getUsers = async (access: string): Promise<IUser[]> => {
  try {
    const response: AxiosResponse<IUser[]> = await axios.get(usersEndpoint, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Получение списка пользователей с возможными фильтрами
export const getVolunteers = async (access: string): Promise<IUser[]> => {
  try {
    const response: AxiosResponse<IUser[]> = await axios.get(
      `${usersEndpoint}?is_staff=false&is_superuser=false/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

// Получение информации о пользователе по ID
export const getUserById = async (
  id: number,
  token: string,
): Promise<IUser> => {
  if (!id) throw new Error('Invalid userId');

  try {
    const response: AxiosResponse<IUser> = await axios.get(
      `${usersEndpoint}${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw new Error(error.response.data.error);
  }
};



export const metier = [["schoolchild", "Школьник"],
["student", "Студент"],
["work_on_himself", "Работаю на себя"],
["work_for_hire", "Работаю по найму"],
["pensioner", "Пенсионер"],
["other", "Другое"]]


// Обновление информации о пользователе (метод PUT)
export const updateUser = async (
  id: number,
  userData: Partial<IUser>,
  token:string
): Promise<IUser> => {
  if (!id) throw new Error('Invalid userId');
  try {
    const response: AxiosResponse<IUser> = await axios.put(
      `${usersEndpoint}${id}/`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

// Частичное обновление информации о пользователе (метод PATCH)
export const patchUser = async (
  id: number,
  userData: Partial<IUser>,
  access:string
): Promise<IUser> => {
  if (!id) throw new Error('Invalid userId');

  try {
    const response: AxiosResponse<IUser> = await axios({
      url: `${usersEndpoint}${id}/`,
      method: 'PATCH',
      data: userData,
      headers: {
        accept: 'application/json',
        'Content-Type': ' multipart/form-data',
        'cross-origin-opener-policy': 'same-origin',
        Authorization: `Bearer ${access}`,
      },
    }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error patching user:', error);
    if (error.response.data.email) {
      throw new Error(error.response.data.email)
    } else {
      throw new Error(error) 
    }
  }
};

// Частичное обновление информации о пользователе (метод PATCH)
export const patchUserPicture = async (
  id: number,
  photo:FormData,
  access:string
): Promise<IUser> => {
  if (!id) throw new Error('Invalid userId');

  try {
    const response: AxiosResponse<IUser> = await axios({
      url: `${usersEndpoint}${id}/`,
      method: 'PATCH',
      data: photo,
      headers: {
        accept: 'application/json',
        'Content-Type': ' multipart/form-data',
        'cross-origin-opener-policy': 'same-origin',
        Authorization: `Bearer ${access}`,
      },
    }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error patching user:', error);
    throw new Error('Failed to patch user');
  }
};


export const getUserByTelegramId = async (
  tgId: number,
  accessToken: string,
): Promise<IUser> => {
  try {
    const response: AxiosResponse<IUser[]> = await axios.get(
      `${API_URL}/users/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          tg_id: tgId,
        },
      },
    );
    const users = response.data;
    if (users.length > 0) {
      return users[0];
    } else {
      throw new Error('Пользователь не найден');
    }
  } catch (error) {
    console.error('Ошибка при получении пользователя по Telegram ID:', error);
    throw error;
  }
};

// Экспорт интерфейсов для использования в других частях проекта
export type { IUser};
