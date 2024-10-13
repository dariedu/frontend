import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинт для работы с историями
const storiesEndpoint = `${API_URL}stories/`;

// Интерфейс для данных истории
export interface IStory {
  id: number;
  link: string;
  link_name?: string;
  cover?: string | null;
  title?: string | null;
  text?: string | null;
  media_files?: string | null;
  background?: string | null;
  hidden?: boolean;
}

// Типизация для параметров фильтрации
interface IGetStoriesParams {
  hidden?: boolean;
}

// Получение списка историй с возможным фильтром
export const getStories = async (
  params?: IGetStoriesParams,
): Promise<IStory[]> => {
  try {
    const response: AxiosResponse<IStory[]> = await axios.get(storiesEndpoint, {
      params: params,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    throw new Error('Failed to fetch stories');
  }
};
