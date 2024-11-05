
import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const feedbackUrl = `${API_URL}/feedbacks/`;

//////основные типы для отзывов, они не должны меняться, поэтому сохранила их вручную.
const FedbackTypesFromServer = {
  'completed_delivery': 'Завершенная доставка',
  'canceled_delivery': 'Отмененная доставка',
  'completed_promotion': 'Завершенное поощрение',
  'canceled_promotion': 'Отмененное поощрение',
  'completed_task': 'Завершенное доброе дело',
  'canceled_task': 'Отмененное доброе дело',
  'suggestion': 'Вопросы и предложения'
}

type TFeedbackTypes = keyof typeof FedbackTypesFromServer;

// Тип данных для отзыва
type TFeedback = {
  type: string
  text: string | null
  user: number
  delivery: string | number
  promotion: string | number
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



////функция работает для куратора и для волонтера для отзыва на завершенную доставку или доброе дело
export const submitFeedbackDeliveryoOrTask = async (
  access: string,
  delivery:boolean,
  type:TFeedbackTypes,
  feedbackText: string,
  deliveryOrTaskId: number,
): Promise<TFeedback> => {

  let object = {}
  if (delivery) {
  object = {
    "type": type,
    "text": feedbackText,
    "user": "",
    "delivery": deliveryOrTaskId,
    "promotion": "",
    "task": ""
  }
  } else {
    object = {
      "type": type,
      "text": feedbackText,
      "user": "",
      "delivery": "",
      "task": deliveryOrTaskId,
      "promotion": ""
    }
}
   
  try {
    const response:AxiosResponse<TFeedback> = await axios({
      url: `${feedbackUrl}submit/`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
      data: object
    })
    return response.data
  } catch (err:any) {
    console.log("submitFeedbackDelivery error", err)
    throw new Error("post request submitFeedbackDelivery has error")
}
}



// Экспортируем интерфейсы и функции
export type { TFeedback, TFeedbackRequest, TFeedbackTypes };
