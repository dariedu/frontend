// Еще совсем не готово, тут только шаблон!!!!! апи на бэкэ еще сырой!!!!
// добавила только get all promotions, cancel and redeem promotion все остальные относятся к бэку, но лучше уточнить!!!!
import axios, { AxiosResponse } from 'axios';

//тут будет ссылка на файл с юрлом!
const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const promotionsUrl = `${API_URL}/promotions/`;

type TPromotionCategory = {
  id: number
  name: string
}

interface IPromotion {
  id: number
  volunteers_count: number
  category: TPromotionCategory;
  city: {
    id: number
    city: string
  };
  address: string | null
  name: string
  price: number
  description?: string
  start_date: string
  quantity: number
  available_quantity: number
  for_curators_only: boolean
  is_active: boolean
  ticket_file: string|null
  about_tickets: string | null
  is_permanent: boolean
  end_date?: string | null
  picture: null|string
}

// function parseObject(obj: string): IPromotion {
//   const result = JSON.parse(obj, function (key, value) {
//     if (key == 'start_date' || key == 'end_date') {
//       return new Date(value);
//     }
//   });
//   return result;
// }
// ?category=${category}&city=${city}&is_active=${is_active}&start_date=${JSON.stringify(start_date)}\
//////запросить все поощрения
export const getAllPromotions = async (
  // category?: string,
  // city?: number,
  // is_active: boolean = false,
  // start_date?: Date,
): Promise<IPromotion[]> => {
  try {
    const response: AxiosResponse<IPromotion[]> = await axios({
      url: promotionsUrl,
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });
    const result:IPromotion[] = [];
    response.data.forEach(i => result.push(i))
    return result;
  } catch (err: any) {
    console.error('Get request getAllPromotions has failed', err);
    throw new Error('Get request getAllPromotions has failed');
  }
};

export const getMyPromotions = async (
  access:string|null
): Promise<IPromotion[]> => {
  try {
    const response: AxiosResponse<IPromotion[]> = await axios({
      url: `${promotionsUrl}my_promo/`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
      },
    });
    const result:IPromotion[] = [];
    response.data.forEach(i => result.push(i))
    return result;
  } catch (err: any) {
    console.error('Get request getAllPromotions has failed', err);
    throw new Error('Get request getAllPromotions has failed');
  }
}

////// заброинровать поощрение
export const postPromotionRedeem = async (
  promotionId: number,
  promotion: IPromotion,
  access:string|null
): Promise<IPromotion> => {
  try {
    const response: AxiosResponse<IPromotion> = await axios({
      url: `${promotionsUrl}${promotionId}/redeem/`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
      data: promotion
    });
    return response.data;
  } catch (err: any) {
    if (err.response.data.error == "Недостаточно баллов для приобретения") {
      throw new Error(err.response.data.error);
   } else {
    console.error('Post request postPromotionRedeem has failed', err);
    throw new Error('Post request postPromotionRedeem has failed');
 }
  }
};


////// отмеинть поощрение
export const postPromotionCancel = async (
  promotionId: number,
  promotion: IPromotion,
  access:string|null
): Promise<IPromotion> => {
  try {
    const response: AxiosResponse<IPromotion> = await axios({
      url: `${promotionsUrl}${promotionId}/cancel/`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
      data: promotion
    });
    return response.data
  } catch (err: any) {
    console.error('Post request postPromotionCancel has failed', err);
    throw new Error('Post request postPromotionCancel has failed');
  }
};

/////запросить категорий поощрений
export const getPromotionsCategories = async(): Promise<TPromotionCategory[]> => {
  try {
    const response: AxiosResponse<TPromotionCategory[]> = await axios({
      url: `${promotionsUrl}promo_categories/`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    const result:TPromotionCategory[] = [];
    response.data.forEach((i) => result.push(i))
    return result
  } catch (err: any) {
    console.error('Get request getPromotionsCategories has failed', err);
    throw new Error('Get request getPromotionsCategories has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IPromotion, TPromotionCategory};
