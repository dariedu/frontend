import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const deliveriesUrl = `${API_URL}/deliveries/`;

interface IDelivery {
  id: number;
  date: string;
  curator: {
    id: number
    tg_id: number
    tg_username: string
    last_name: string
    name: string
    surname: string
    phone:string
    photo: string
    photo_view: string | null
  }
  price: number
  is_free: boolean
  is_active: boolean
  location: {
    id: number
    address: string
    link: string
    subway: string
    description: string
   city: {
      id: number
      city: string
    }
  }
  is_completed: boolean
  in_execution: boolean
  volunteers_needed: number
  volunteers_taken: number
  delivery_assignments?: number[]
}

interface IVolunteerDeliveries{
  "свободные доставки": IDelivery[]
  "мои активные доставки": IDelivery[]
  "мои завершенные доставки": IDelivery[]
}

type TCuratorDelivery = {
  id_delivery: number,
  id_route_sheet: number[],
  delivery_assignments: number[]
}

interface ICuratorDeliveries {
  "выполняются доставки": TCuratorDelivery[],
  "активные доставки": TCuratorDelivery[],
  "завершенные доставки":TCuratorDelivery[]
}


// Получение всех доставок
export const getAllDeliveries = async (
accessToken: string
): Promise<IDelivery[]> => {
  try {
    const response = await axios({
      url: deliveriesUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    console.error( 'Get request getAllDeliveries has failed', err.response || err)
    throw err; // Пробрасываем ошибку выше
  }
};
// Получение всех доставок
export const getDeliveryById = async (
  accessToken: string,
  id:number
  ): Promise<IDelivery> => {
    try {
      const response = await axios({
        url: `${deliveriesUrl}${id}/`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      });
      return response.data;
    } catch (err: any) {
      console.error( 'Get request getDeliveryById has failed', err.response || err)
      throw err; // Пробрасываем ошибку выше
    }
  };

// Отмена доставки
export const postDeliveryCancel = async (
  access: string|null,
  deliveryId: number,
  delivery:IDelivery
): Promise<IDelivery> => {
  try {
    const response: AxiosResponse<IDelivery> = await axios({
      url: `${deliveriesUrl}${deliveryId}/cancel/`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
      data: delivery,
    });
    return response.data;
  } catch (err: any) {
    console.error('Post request postDeliveryCancel has failed', err);
    throw new Error('Post request postDeliveryCancel has failed');
  }
};

// берем доставку себе
export const postDeliveryTake = async (
  access: string|null,
  deliveryId: number,
  delivery:IDelivery
): Promise<IDelivery> => {
  try {
    const response: AxiosResponse<IDelivery> = await axios({
      url: `${deliveriesUrl}${deliveryId}/take/`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
      data: delivery,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response.data.error)
  }
};

// Получение доставок куратора
export const getCuratorDeliveries = async (
  access: string,
): Promise<ICuratorDeliveries> => {
  try {
    const response: AxiosResponse<ICuratorDeliveries> = await axios({
      url: `${deliveriesUrl}curator/`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    console.error('Get request getCuratorDeliveries has failed', err);
    throw new Error('Get request getCuratorDeliveries has failed');
  }
};

// Получение доставок волонтера
export const getVolunteerDeliveries = async (
  access: string,
): Promise<IVolunteerDeliveries> => {
  try {
    const response: AxiosResponse<IVolunteerDeliveries> = await axios({
      url: `${deliveriesUrl}volunteer/`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    console.error('Get request getVolunteerDeliveries has failed', err);
    throw new Error('Get request getVolunteerDeliveries has failed');
  }
};

// Экспорт интерфейсов для использования в других API-файлах
export type { IDelivery, IVolunteerDeliveries, TCuratorDelivery, ICuratorDeliveries };
