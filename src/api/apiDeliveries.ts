// Еще совсем не готово, тут только шаблон!!!!! апи на бэкэ еще сырой!!!!
import axios, { AxiosResponse } from 'axios';
//тут будет ссылка на файл с юрлом!

//const API_URL = import.meta.env.VITE_API_BASE_URL as string;
//const deliveriesUrl = `${API_URL}/deliveries/`;
const deliveriesUrl = 'https://skillfactory.dariedu.site/api/deliveries/';


interface IDelivery {
  id: number;
  date: string;
  curator: {
    id: number;
    tg_id: number;
    tg_username: string;
    last_name: string;
    name: string;
    avatar: string;
  };
  price: number;
  is_free: boolean;
  is_active: boolean;
  is_completed: boolean;
  in_execution: boolean;
  volunteers_needed: number;
  volunteers_taken: number;
  delivery_assignments: string[];
  route_sheet: number;
  location: {
    id: number;
    city: {
      id: number;
      city: string;
    };
    address: string;
    link: string;
    subway: string;
    media_files: null | string;
    description: string;
  };
}

function parseObject(obj: string): IDelivery {
  const result = JSON.parse(obj, function (key, value) {
    if (key == 'date') {
      return new Date(value);
    }
  });
  return result;
}

export const getAllDeliveries = async (
  is_active: boolean = false,
  is_completed: boolean = false,
  volunteer?: number,
): Promise<IDelivery[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios({
     url: `${deliveriesUrl}?is_active=${is_active}&is_completed=${is_completed}&volunteer=${volunteer}`,
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    const result: IDelivery[] = [];
    response.data.forEach(i => {
    result.push(parseObject(i));
    });
    return result;
  } catch (err: any) {
    console.error('Get request getAllDeliveries has failed', err);
    throw new Error('Get request getAllDeliveries has failed');
  }
};



export const postDeliveryCancel = async (
  deliveryId: number,
): Promise<IDelivery> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${deliveriesUrl}${deliveryId}/cancel/`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return parseObject(response.data);
  } catch (err: any) {
    console.error('Post request postDeliveryCancel has failed', err);
    throw new Error('Post request postDeliveryCancel has failed');
  }
};

export const postDeliveryTake = async (
  deliveryId: number,
): Promise<IDelivery> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${deliveriesUrl}${deliveryId}/take/`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return parseObject(response.data);
  } catch (err: any) {
    console.error('Post request postDeliveryTake has failed', err);
    throw new Error('Post request postDeliveryTake has failed');
  }
};
// 'http://127.0.0.1:8000/api/deliveries/curator/'
export const getCuratorDeliveries = async (): Promise<IDelivery[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios({
      url: `${deliveriesUrl}curator/`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });

    const result: IDelivery[] = [];
    response.data.forEach(i => {
      result.push(parseObject(i));
    });
    return result;
  } catch (err: any) {
    console.error('Get request getCuratorDeliveries  has failed', err);
    throw new Error('Get request getCuratorDeliveries  has failed');
  }
};

//  'http://127.0.0.1:8000/api/deliveries/volunteer/'
export const getVolunteerDeliveries = async (): Promise<IDelivery[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios({
      url: `${deliveriesUrl}volunteer/`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });

    const result: IDelivery[] = [];
    response.data.forEach(i => {
      result.push(parseObject(i));
    });
    return result;
  } catch (err: any) {
    console.error('Get request getVolunteerDeliveries has failed', err);
    throw new Error('Get request getVolunteerDeliveries has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IDelivery };
