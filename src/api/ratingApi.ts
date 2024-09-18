import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = process.env.VITE_API_BASE_URL as string;

// Эндпоинт для работы с рейтингами
const ratingsEndpoint = `${API_URL}/ratings/`;

// Интерфейс для данных рейтинга (Rating)
interface IRating {
  id: number;
  level: string;
  hours_needed: number;
}

// Получение списка рейтингов
export const getRatings = async (): Promise<IRating[]> => {
  try {
    const response: AxiosResponse<IRating[]> = await axios.get(ratingsEndpoint);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching ratings:', error);
    throw new Error('Failed to fetch ratings');
  }
};

// Экспортируем интерфейс для использования в других API-файлах
export type { IRating };
