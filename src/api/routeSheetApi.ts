import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинты для работы с маршрутными листами
const routeSheetsEndpoint = `${API_URL}/route_sheets/`;
//const assignRouteSheetEndpoint = `${API_URL}/route_sheets/assign/`;

// Интерфейс для данных адреса (Address)
type TAddress = {
  id: number;
  beneficiary: string[]; 
  address: string; // Полный адрес
  link?: string; // Ссылка (если есть)
  location?: string; // Локация, к которой привязан адрес
  route_sheet: number; // Идентификатор маршрутного листа
}

type TCurator = {
id: number
last_name: string
name: string
phone:string
photo: string
photo_view: string
surname: string
tg_id: number
tg_username:string
}

// Интерфейс для данных локации (Location)
interface ILocation {
  address: string
  city: {
    id: number
    name: string
  } 
  curator: TCurator
  description?: string // Описание локации (если есть)
  id: number
  link?: string // Ссылка (если есть)
  media_files?: string[] // Ссылки на медиафайлы (если есть)
  subway?: string // Ближайшее метро (если есть)
}


// Интерфейс для данных маршрутного листа (RouteSheet)
interface IRouteSheet {
  id: number
  address: TAddress[] // Список адресов
  location: ILocation // Данные о локации
  name: string // Название маршрутного листа
  map?: string // Карта (если есть)
}
///////Проверено!

// Тип данных для запроса при создании или обновлении маршрутного листа
type TRouteSheetRequest = {
  volunteer_id: number
  delivery_id: number
};

//id=volunteer_id for delivery with id=delivery_id Body: { "volunteer_id": {id} "delivery_id": {id} }
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
  routeSheetId:number,
  access:string,
  data: TRouteSheetRequest,
): Promise<IRouteSheet> => {
  try {
    const response: AxiosResponse<IRouteSheet> = await axios.post(
      `${API_URL}/route_sheets/${routeSheetId}/assign/`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
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
