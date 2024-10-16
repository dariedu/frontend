// Еще совсем не готово, тут только шаблон!!!!! апи на бэкэ еще сырой!!!!
// добавила только get all promotions, cancel and redeem promotion все остальные относятся к бэку, но лучше уточнить!!!!
import axios, { AxiosResponse } from 'axios';

//тут будет ссылка на файл с юрлом!
const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const promotionsUrl = `${API_URL}/promotions/`;

interface IPromotion {
  picture: any;
  address: string;
  id: number;
  volunteers_count: number;
  category: string;
  name: string;
  price: number;
  description?: string;
  start_date: Date;
  quantity: number;
  available_quantity: number;
  for_curators_only: boolean;
  is_active: boolean;
  file?: string;
  is_permanent: boolean;
  end_date?: Date;
  city: string;
  users: number[];
  ticket?: string;
}

function parseObject(obj: string): IPromotion {
  const result = JSON.parse(obj, function (key, value) {
    if (key == 'start_date' || key == 'end_date') {
      return new Date(value);
    }
  });
  return result;
}

export const getAllPromotions = async (
  category?: string,
  city?: number,
  is_active: boolean = false,
  start_date?: Date,
): Promise<IPromotion[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios({
      url: `${promotionsUrl}?category=${category}&city=${city}&is_active=${is_active}&start_date=${JSON.stringify(start_date)}`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });

    const result: IPromotion[] = [];
    response.data.forEach(i => {
      result.push(parseObject(i));
    });
    return result;
  } catch (err: any) {
    console.error('Get request getMyTasks has failed', err);
    throw new Error('Get request getMyTasks has failed');
  }
};

export const postPromotionRedeem = async (
  promotionId: number,
): Promise<IPromotion> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${promotionsUrl}${promotionId}/redeem/`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return parseObject(response.data);
  } catch (err: any) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};

export const postPromotionCancel = async (
  promotionId: number,
): Promise<IPromotion> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${promotionsUrl}${promotionId}/cancel/`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return parseObject(response.data);
  } catch (err: any) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IPromotion };
