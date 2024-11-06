import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинты для работы с маршрутными листами
const routeSheetsEndpoint = `${API_URL}/route_sheets/`;
const assignRouteSheetEndpoint = `${API_URL}/route_sheets/assign/`;

// Интерфейс для данных локации (Location)
interface ILocation {
  id: number;
  city: string; // Название города
  curator: string; // Имя куратора
  address: string; // Полный адрес
  link?: string; // Ссылка (если есть)
  subway?: string; // Ближайшее метро (если есть)
  media_files?: string[]; // Ссылки на медиафайлы (если есть)
  description?: string; // Описание локации (если есть)
}

// Интерфейс для данных адреса (Address)
interface TAddress {
  id: number;
  beneficiary: string; // Имя или название получателя
  address: string; // Полный адрес
  link?: string; // Ссылка (если есть)
  location?: string; // Локация, к которой привязан адрес
  route_sheet: number; // Идентификатор маршрутного листа
}

// Интерфейс для данных маршрутного листа (RouteSheet)
interface IRouteSheet {
  id: number;
  location: ILocation; // Данные о локации
  address: TAddress[]; // Список адресов
  name: string; // Название маршрутного листа
  map?: string | null; // Карта (если есть)
  user?: number | null; // Идентификатор волонтера, назначенного на маршрутный лист
  deliveryId: number;
}

// Тип данных для запроса при создании или обновлении маршрутного листа
type TRouteSheetRequest = {
  name: string;
  map?: string | null;
  user?: number | null;
  addresses?: TAddressRequest[];
};

// Интерфейс для создания или обновления адреса в маршрутном листе
interface TAddressRequest {
  beneficiary: string;
  address: string;
  link?: string;
  location?: string;
  route_sheet: number;
}

// Получение списка маршрутных листов
export const getRouteSheets = async (token: string): Promise<IRouteSheet[]> => {
  try {
    const response: AxiosResponse<IRouteSheet[]> = await axios.get(
      routeSheetsEndpoint,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching route sheets:', error);
    throw new Error('Failed to fetch route sheets');
  }
};

// Назначение маршрутного листа волонтеру
export const assignRouteSheet = async (
  data: TRouteSheetRequest,
): Promise<IRouteSheet> => {
  try {
    const response: AxiosResponse<IRouteSheet> = await axios.post(
      assignRouteSheetEndpoint,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error assigning route sheet:', error);
    throw new Error('Failed to assign route sheet');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type {
  IRouteSheet,
  ILocation,
  TAddress,
  TRouteSheetRequest,
  TAddressRequest,
};
