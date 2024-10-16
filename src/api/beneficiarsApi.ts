import axios, { AxiosResponse } from 'axios';

// Устанавливаем URL API
const API_URL = import.meta.env.VITE_API_BASE_URL as string;

// Эндпоинт для работы с бенефициарами
const beneficiarsEndpoint = `${API_URL}/beneficiars/`;

// Интерфейс для данных бенефициара (Beneficiar)
interface IBeneficiar {
  id: number;
  phone?: string | null;
  full_name: string;
  comment?: string | null;
  address: number;
}

// Тип данных для запроса при создании или обновлении бенефициара
type TBeneficiarRequest = {
  phone?: string | null;
  full_name: string;
  comment?: string | null;
  address: number;
};

// Получение списка бенефициаров
export const getBeneficiars = async (): Promise<IBeneficiar[]> => {
  try {
    const response: AxiosResponse<IBeneficiar[]> =
      await axios.get(beneficiarsEndpoint);
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при получении списка бенефициаров:', error);
    throw new Error('Не удалось получить список бенефициаров');
  }
};

// Создание нового бенефициара
export const createBeneficiar = async (
  data: TBeneficiarRequest,
): Promise<IBeneficiar> => {
  try {
    const response: AxiosResponse<IBeneficiar> = await axios.post(
      beneficiarsEndpoint,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при создании бенефициара:', error);
    throw new Error('Не удалось создать бенефициара');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { IBeneficiar, TBeneficiarRequest };
