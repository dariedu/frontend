import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинт для работы с историями
const storiesEndpoint = `${API_URL}/stories/`;

// Интерфейс для данных истории
export interface IStory {
  id: number
  cover: string
  title: string 
  subtitle: string
  text: string 
  date:string
  background: string 
  hidden: boolean
}


// Получение списка историй с возможным фильтром
export const getStories = async (token: string, hidden:boolean=false ): Promise<IStory[]> => {
  try {
    const response: AxiosResponse<IStory[]> = await axios.get(
      `${storiesEndpoint}?${hidden ? 1 : 0}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching stories:', error);
    throw new Error('Failed to fetch stories');
  }
};

