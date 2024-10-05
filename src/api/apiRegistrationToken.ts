import axios, { AxiosResponse } from 'axios';

//тут будет ссылка на файл с юрлом!
//const API_URL = process.env.VITE_API_BASE_URL as string;
const API_URL = 'https://skillfactory.dariedu.site/api'
const tasksUrl = `${API_URL}/registration/`;
const tokenUrl = `${API_URL}/token/`;



interface IRegister {
  tg_id: number
  tg_username: string
  email: string
  last_name: string
  name: string
  surname: string
  phone: string
  photo: string
  birthday: string
  is_adult: boolean | null
  interests: string
  // city: string
  consent_to_personal_data: boolean
}

type TToken = {
  tg_id: number;
};

interface ITokenBlacklist {
  refresh: string;
}
interface ITokenRefresh extends ITokenBlacklist {
  access: string;
}

// export const postRegistration = async (user: IRegister) => {
//   try {

//     const response = await fetch(tasksUrl,
//       {
//         method: 'POST',
//         headers: {
//           Accept: "application/json",
//           'Content-Type': "application/json"
//         },
//         body: JSON.stringify(user)
//       }
//     );
//     if (response.ok === true) {
//       const user = await response.json();
//       return user;
//     }
//   } catch (err) {
     
//    console.error('Post request postTaskAccept has failed', err);
//     throw new Error('Post request postTaskAccept has failed');
//     return(err)
//   }
// };

export const postRegistration = async (user: IRegister): Promise<IRegister> => {
  try {
    const response: AxiosResponse<string> = await axios({
      method: 'post',
      url: tasksUrl,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(user)
    });
    return JSON.parse(response.data);
  } catch (err) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};

export const postToken = async (token: TToken): Promise<TToken> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: tokenUrl,
      method: 'POST',
      data: JSON.stringify(token),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return JSON.parse(response.data);
  } catch (err: any) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};

//Takes a token and blacklists it. Must be used with the rest_framework_simplejwt.token_blacklist app installed.
export const postTokenBlacklist = async (
  refresh: ITokenBlacklist,
): Promise<number> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${tokenUrl}blacklist/`,
      method: 'POST',
      data: JSON.stringify(refresh),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return response.status;
  } catch (err: any) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};
//Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
export const postTokenRefresh = async (
  refresh: ITokenBlacklist,
): Promise<ITokenRefresh> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${tokenUrl}refresh/`,
      method: 'POST',
      data: JSON.stringify(refresh),
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return JSON.parse(response.data);
  } catch (err: any) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IRegister, TToken, ITokenBlacklist, ITokenRefresh };
