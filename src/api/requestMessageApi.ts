import axios, { AxiosResponse } from 'axios';

// Базовый URL для API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинты для работы с запросами сообщений
const requestMessagesEndpoint = `${API_URL}/request_messages/`;

// Тип данных для RequestMessage
interface IRequestMessage {
  id: number;
  type: string;
  text?: string | null;
  form?: string | null;
  user: number;
}

// Тип данных для запроса при создании или обновлении RequestMessage
type TRequestMessageRequest = {
  type: string;
  text?: string | null;
  form?: string | null;
  user: number;
};

// Получение списка сообщений с возможностью фильтрации по типу
export const getRequestMessages = async (
  type?: string,
): Promise<IRequestMessage[]> => {
  try {
    const response: AxiosResponse<IRequestMessage[]> = await axios.get(
      requestMessagesEndpoint,
      {
        params: { type },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching request messages:', error);
    throw new Error('Failed to fetch request messages');
  }
};

// Создание нового сообщения запроса
export const createRequestMessage = async (
  data: TRequestMessageRequest,
): Promise<IRequestMessage> => {
  try {
    const response: AxiosResponse<IRequestMessage> = await axios.post(
      requestMessagesEndpoint,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error creating request message:', error);
    throw new Error('Failed to create request message');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IRequestMessage, TRequestMessageRequest };
