// Тип данных для отзыва
type TFeedback = {
  id: number;
  type: string;
  text: string | null;
  form: string | null;
  user: number;
};

// Тип данных для запроса на создание отзыва
type TFeedbackRequest = {
  type: string;
  text?: string | null;
  form?: string | null;
  user: number;
};

// Получение списка отзывов
export const getFeedbacks = async (type?: string): Promise<TFeedback[]> => {
  try {
    const response = await fetch(
      `/api/feedbacks/${type ? `?type=${type}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching feedbacks: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};





// Экспортируем интерфейсы и функции
export type { TFeedback, TFeedbackRequest };
