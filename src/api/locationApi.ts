import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = process.env.VITE_API_BASE_URL as string;

// Эндпоинт для работы с локациями
const locationsEndpoint = `${API_URL}/locations/`;

// Интерфейс для данных локации (Location)
interface ILocation {
  id: number;
  address: string;
  link?: string | null;
  subway?: string | null;
  media_files?: string | null;
  city: number;
  curator?: number | null;
}

// Тип данных для запроса при создании или обновлении локации
type TLocationRequest = {
  address: string;
  link?: string | null;
  subway?: string | null;
  media_files?: string | null;
  city: number;
  curator?: number | null;
};

// Получение списка локаций
export const getLocations = async (): Promise<ILocation[]> => {
  try {
    const response: AxiosResponse<ILocation[]> =
      await axios.get(locationsEndpoint);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching locations:', error);
    throw new Error('Failed to fetch locations');
  }
};

// Создание новой локации
export const createLocation = async (
  data: TLocationRequest,
): Promise<ILocation> => {
  try {
    const response: AxiosResponse<ILocation> = await axios.post(
      locationsEndpoint,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error creating location:', error);
    throw new Error('Failed to create location');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { ILocation, TLocationRequest };
