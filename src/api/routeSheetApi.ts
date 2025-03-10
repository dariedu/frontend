import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинты для работы с маршрутными листами
const routeSheetsEndpoint = `${API_URL}/route_sheets/`;
//const assignRouteSheetEndpoint = `${API_URL}/route_sheets/assign/`;


type TCurator = {
  id: number
  tg_id: number
  tg_username: string
  last_name: string
  name: string
  surname: string
  phone: string
  photo: string
  photo_view: string
}
// Интерфейс для данных локации (Location)
interface ILocation {
  id: number
  city: {
    id: number
    city: string
  } 
  curator: TCurator
  address: string
  link?: string // Ссылка (если есть)
  subway?: string // Ближайшее метро (если есть)
  media_files?: string[] // Ссылки на медиафайлы (если есть)
  description?: string // Описание локации (если есть)
}



type TBeneficiar = {
  id: number
  phone: string
  second_phone: string
  full_name: string
  comment: string
  category: string
  presence: string
  photo_link: string
  address: number
}
 
// Интерфейс для данных адреса (Address)
type TAddress = {
  id: number
  beneficiar: TBeneficiar[]; 
  address: string // Полный адрес
  link?: string // Ссылка (если есть)
  location?: number // Локация, к которой привязан адрес
  route_sheet: number // Идентификатор маршрутного листа
  dinners: number
}

// Интерфейс для данных маршрутного листа (RouteSheet)
interface IRouteSheet {
  id: number
  location: ILocation // Данные о локации
  address: TAddress[] // Список адресов
  name: string // Название маршрутного листа
  map?: string // Карта (если есть)
  diners: number
}


///////Проверено!
// Тип данных для запроса при создании или обновлении маршрутного листа
type TRouteSheetRequest = {
  volunteer_id: number
  delivery_id: number
  routesheet_id:number
};

//// кастомный тип для некоторых компонетов куратора
type TRouteSheetIndividual = {
  // deliveryId: number
  routeSheets: IRouteSheet[]
  }

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

// Получение маршрутного листа по айди
export const getRouteSheetById = async (token: string, routeSheetId:number): Promise<IRouteSheet> => {
  try {
    const response: AxiosResponse<IRouteSheet> = await axios.get(
      `${routeSheetsEndpoint}${routeSheetId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching route sheet by id', error);
    throw new Error('Failed to fetch route sheets by id');
  }
};


// Назначение маршрутного листа волонтеру
export const assignRouteSheet = async (
  access:string,
  data: TRouteSheetRequest,
): Promise<boolean|any> => {
  try {
    const response: AxiosResponse<boolean> = await axios({
      url: `${API_URL}/route_sheets/assign/`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
      data: data,
    })
    if (response) {
      return true;
    }
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
  TRouteSheetIndividual
};
