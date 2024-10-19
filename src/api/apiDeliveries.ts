import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const deliveriesUrl = `${API_URL}/deliveries/`;

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

// Общая функция для обработки запросов с авторизацией
const getHeaders = (access: string) => ({
  headers: {
    Authorization: `Bearer ${access}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

// Получение всех доставок
export const getAllDeliveries = async (
  is_active: string,
  is_completed: string,
  accessToken: string,
): Promise<IDelivery[]> => {
  try {
    const response = await axios({
      url: `${deliveriesUrl}?is_active=${is_active}&is_completed=${is_completed}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`, // Правильное добавление токена
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    console.error('Get request getAllDeliveries has failed', err);
    throw new Error('Get request getAllDeliveries has failed');
  }
};

// Отмена доставки
export const postDeliveryCancel = async (
  access: string,
  deliveryId: number,
): Promise<IDelivery> => {
  try {
    const response: AxiosResponse<IDelivery> = await axios.post(
      `${deliveriesUrl}${deliveryId}/cancel/`,
      {},
      getHeaders(access),
    );
    return response.data;
  } catch (err: any) {
    console.error('Post request postDeliveryCancel has failed', err);
    throw new Error('Post request postDeliveryCancel has failed');
  }
};

// Принятие доставки
export const postDeliveryTake = async (
  access: string,
  deliveryId: number,
): Promise<IDelivery> => {
  try {
    const response: AxiosResponse<IDelivery> = await axios.post(
      `${deliveriesUrl}${deliveryId}/take/`,
      {},
      getHeaders(access),
    );
    return response.data;
  } catch (err: any) {
    console.error('Post request postDeliveryTake has failed', err);
    throw new Error('Post request postDeliveryTake has failed');
  }
};

// Получение доставок куратора
export const getCuratorDeliveries = async (
  access: string,
): Promise<IDelivery[]> => {
  try {
    const response: AxiosResponse<IDelivery[]> = await axios.get(
      `${deliveriesUrl}curator/`,
      getHeaders(access),
    );
    return response.data;
  } catch (err: any) {
    console.error('Get request getCuratorDeliveries has failed', err);
    throw new Error('Get request getCuratorDeliveries has failed');
  }
};

// Получение доставок волонтера
export const getVolunteerDeliveries = async (
  access: string,
): Promise<IDelivery[]> => {
  try {
    const response: AxiosResponse<IDelivery[]> = await axios.get(
      `${deliveriesUrl}volunteer/`,
      getHeaders(access),
    );
    return response.data;
  } catch (err: any) {
    console.error('Get request getVolunteerDeliveries has failed', err);
    throw new Error('Get request getVolunteerDeliveries has failed');
  }
};

// Экспорт интерфейсов для использования в других API-файлах
export type { IDelivery };
