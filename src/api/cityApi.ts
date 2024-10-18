import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинт для работы с городами
const citiesEndpoint = `${API_URL}/cities/`;

// Тип данных для города
type TCity = {
  id: number;
  city: string;
};

// Получение списка городов
export const fetchCities = async (): Promise<TCity[]> => {
  try {
    const response: AxiosResponse<TCity[]> = await axios.get(citiesEndpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Ошибка при загрузке списка городов:', error);
    throw new Error('Failed to fetch cities');
  }
};

// Экспорт типов и функций
export type { TCity };
