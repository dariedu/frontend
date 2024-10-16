import axios, { AxiosResponse } from 'axios';
import { ILocation } from './locationApi';
import { TAddress, TAddressRequest } from './addressApi';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинты для работы с маршрутными листами
const routeSheetsEndpoint = `${API_URL}/route_sheets/`;
const assignRouteSheetEndpoint = `${API_URL}/route_sheets/assign/`;

// Интерфейс для данных маршрутного листа (RouteSheet)
interface IRouteSheet {
  id: number;
  location: ILocation;
  address: TAddress[]; // Using TAddress type here
}

// Тип данных для запроса при создании или обновлении маршрутного листа
type TRouteSheetRequest = {
  name: string;
  map?: string | null;
  user?: number | null;
  addresses?: TAddressRequest[]; // Adding addresses using TAddressRequest type
};

// Получение списка маршрутных листов
export const getRouteSheets = async (): Promise<IRouteSheet[]> => {
  try {
    const response: AxiosResponse<IRouteSheet[]> =
      await axios.get(routeSheetsEndpoint);
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
export type { IRouteSheet, TRouteSheetRequest };
