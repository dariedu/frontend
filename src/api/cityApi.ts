// Тип данных для города
type TCity = {
  id: number;
  city: string;
};

// Получение списка городов
export const fetchCities = async (): Promise<TCity[]> => {
  try {
    const response = await fetch('/api/cities/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке списка городов');
    }

    return response.json();
  } catch (error) {
    console.error('Ошибка при выполнении запроса списка городов:', error);
    throw error;
  }
};

// Экспорт типов и функций
export type { TCity };
