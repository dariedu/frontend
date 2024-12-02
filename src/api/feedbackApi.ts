
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
  'suggestion': 'Вопросы и предложения',
  'support': 'Техническая поддержка'
}

type TFeedbackTypes = keyof typeof FedbackTypesFromServer;

// Тип данных для отзыва
type TFeedback = {
  type: string
  text: string
  delivery: string | number
  task:string | number
  promotion: string | number
};



// Тип данных ответа по отзывам пользователя
type TMyFeedback = {
    id: number,
    type: keyof typeof FedbackTypesFromServer,
    text: string,
    user: number,
    delivery: number | string,
    task: number | string,
    promotion: number | string,
    created_at: string
}

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


// Получение списка отзывов
export const getMyFeedbacks = async (
  access: string
): Promise<TMyFeedback[]> => {

  try {
    const response:AxiosResponse<TMyFeedback[]> = await axios({
      url: feedbackUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`,
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    })
    return response.data
  } catch (err:any) {
    console.log("getMyFeedbacks error", err)
    throw new Error("get request getMyFeedbacks has error")
}
}



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
    "delivery": deliveryOrTaskId,
     "task": "",
    "promotion": "",
  }
  } else {
    object = {
      "type": type,
      "text": feedbackText,
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

////функция работает для куратора и для волонтера для отзыва на поощрение
export const submitFeedbackPromotioin = async (
  access: string,
  type:TFeedbackTypes,
  feedbackText: string,
  promotionId: number,
): Promise<TFeedback> => {


 const object = {
    "type": type,
    "text": feedbackText,
    "delivery": "",
    "task": "",
    "promotion": promotionId,
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
    console.log("submitFeedbackPromotioin error", err)
    throw new Error("post request submitFeedbackPromotioin has error")
}
}


export const submitFeedbackSuggestion = async (
  access: string,
  type:TFeedbackTypes,
  feedbackText: string,
): Promise<TFeedback> => {


 const object = {
    "type": type,
    "text": feedbackText,
    "delivery": "",
    "task": "",
    "promotion": "",
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
    console.log("submitFeedbackSuggestion error", err)
    throw new Error("post request submitFeedbackSuggestion has error")
}
}



// Экспортируем интерфейсы
export type { TFeedback, TFeedbackTypes, TMyFeedback};
