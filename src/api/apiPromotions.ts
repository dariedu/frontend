
import axios, { AxiosResponse } from 'axios';

//тут будет ссылка на файл с юрлом!
const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const promotionsUrl = `${API_URL}/promotions/`;

type TPromotionCategory = {
  id: number;
  name: string;
};

interface IPromotion {
  id: number;
  volunteers_count: number;
  category: TPromotionCategory;
  city: {
    id: number;
    city: string;
  };
  address: string | null;
  name: string;
  price: number;
  description?: string;
  start_date: string;
  quantity: number;
  available_quantity: number;
  for_curators_only: boolean;
  is_active: boolean;
  ticket_file: string | null;
  about_tickets: string | null;
  is_permanent: boolean;
  end_date?: string | null;
  picture: null | string;
}

//////запросить все доступные поощрения
export const getAllPromotions = async (access:string):Promise<IPromotion[]> => {
  try {
    const response: AxiosResponse<IPromotion[]> = await axios({
      url: promotionsUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
      },
    });
    const result: IPromotion[] = [];
    response.data.forEach(i => result.push(i));
    return result;
  } catch (err: any) {
    console.error('Get request getAllPromotions has failed', err);
    throw new Error('Get request getAllPromotions has failed');
  }
};

///// запросить все мои поощрения
export const getMyPromotions = async (access:string): Promise<IPromotion[]> => {
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
///// запросить все мои поощрения с фильтром
export const getMyPastOrActivePromotions = async (
  access: string,
  is_active: boolean = false
): Promise<IPromotion[]> => {
  try {
    const response: AxiosResponse<IPromotion[]> = await axios({
      url: `${promotionsUrl}my_promo/?is_active=${is_active ? 1 : 0}`,
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
  access:string
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
      data: promotion,
    });
    return response.data;
  } catch (err: any) {
    if (err.response.data.error == 'Недостаточно баллов для приобретения') {
      throw new Error(err.response.data.error);
    } else if (err.response.data.error = "Вы уже приобрели этот поощрение") {
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
  access:string
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
      data: promotion,
    });
    return response.data;
  } catch (err: any) {
    console.error('Post request postPromotionCancel has failed', err);
    throw new Error('Post request postPromotionCancel has failed');
  }
};

/////запросить категорий поощрений
export const getPromotionsCategories = async (access:string): Promise<TPromotionCategory[]> => {
  try {
    const response: AxiosResponse<TPromotionCategory[]> = await axios({
      url: `${promotionsUrl}promo_categories/`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    const result: TPromotionCategory[] = [];
    response.data.forEach(i => result.push(i));
    return result;
  } catch (err: any) {
    console.error('Get request getPromotionsCategories has failed', err);
    throw new Error('Get request getPromotionsCategories has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IPromotion, TPromotionCategory };
