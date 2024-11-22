import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const tasksUrl = `${API_URL}/registration/`;
const tokenUrl = `${API_URL}/token/`;

interface IUserRegistered {
  tg_id: number;
  tg_username: string;
  email: string;
  last_name: string;
  name: string;
  surname: string;
  phone: string;
  photo: Blob;
  birthday: string;
  is_adult: boolean | null;
  interests?: string;
  city: number;
  consent_to_personal_data: boolean;
}

type TRegisterationFormData = FormData;


type TPostTokenResponse = {
  refresh: string
  access: string
}

////// работает корректно //////////
export const postRegistration = async (
  user: TRegisterationFormData,
): Promise<boolean|undefined> => {
  try {
    const response: AxiosResponse<boolean> = await axios({
      url: tasksUrl,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': ' multipart/form-data',
      },
      data: user,
    });
    if (response.data) {
      return true
    }
  } catch (err:any) {
    console.error('Post request postRegistration has failed', err);
    throw new Error(err.response.data.error);
  }
};

////// работает корректно //////////
export const postToken = async (tgId:number): Promise<TPostTokenResponse> => {
  try {
    const response: AxiosResponse<TPostTokenResponse> = await axios({
      url: tokenUrl,
      method: 'POST',
      data: {
        tg_id: tgId,
      },
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err: any) {
    console.error('Ошибка в запросе токена:', err);
    throw new Error('Запрос токена завершился неудачей');
  }
};

export const postTokenBlacklist = async (
  refresh: string,
): Promise<number> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${tokenUrl}blacklist/`,
      method: 'POST',
      data: {
        refresh: refresh
      },
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return response.status;
  } catch (err: any) {
    console.error('Post request postTokenBlacklist has failed', err);
    throw new Error('Post request postTokenBlacklist has failed');
  }
};

//Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
export const postTokenRefresh = async (
  refresh: string
): Promise<TPostTokenResponse> => {
  try {
    const response: AxiosResponse<TPostTokenResponse> = await axios({
      url: `${tokenUrl}refresh/`,
      method: 'POST',
      data: {
        refresh:refresh
      },
      headers: {
        'cross-origin-opener-policy': 'same-origin',
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    return response.data;
  } catch (err: any) {
    console.error('Post request postTokenRefresh has failed', err);
    throw new Error('Post request postTokenRefresh has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type {
  IUserRegistered,
  TRegisterationFormData,
  TPostTokenResponse,
};
