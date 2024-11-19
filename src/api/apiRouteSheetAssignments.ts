import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинты для работы с маршрутными листами
const routeSheetsAssignmentEndpoint = `${API_URL}/route_assignments/`;



interface IRouteSheetAssignments {
id: number
route_sheet: number
volunteer: number
delivery: number
}

export const getRouteSheetAssignments = async (token: string): Promise<IRouteSheetAssignments[]> => {
  try {
    const response: AxiosResponse<IRouteSheetAssignments[]> = await axios.get(
      routeSheetsAssignmentEndpoint,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (err) {
    console.error('Error fetching getRouteSheetAssignments:', err);
    throw new Error('Failed to fetch getRouteSheetAssignments');
  }
}

export const getRouteSheetAssignmentsById = async (token: string, routeSheetId: number): Promise<IRouteSheetAssignments> => {
  try {
    const response: AxiosResponse<IRouteSheetAssignments> = await axios.get(
      `${routeSheetsAssignmentEndpoint}${routeSheetId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (err) {
    console.error('Error fetching getRouteSheetAssignments:', err);
    throw new Error('Failed to fetch getRouteSheetAssignments');
  }
}

export type {IRouteSheetAssignments}