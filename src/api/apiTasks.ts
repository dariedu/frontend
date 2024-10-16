// Тут почти готово, возможно еще будут правки с городами, и с телом запроса, надо перепроверить!!!!

import axios, { AxiosResponse } from 'axios';

//тут будет ссылка на файл с юрлом!
const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const tasksUrl = `${API_URL}/tasks/`;

interface ITask {
  id: number;
  category: string;
  name: string;
  price: number;
  description?: string;
  start_date: Date;
  end_date: Date;
  volunteers_needed: number;
  volunteers_taken: number;
  is_active: boolean;
  is_completed: boolean;
  city: string;
  curator: number;
  volunteers: number[];
}
// dataExample = "2024-09-17T10:17:47.226Z"

function parseObject(obj: string): ITask {
  const result = JSON.parse(obj, function (key, value) {
    if (key == 'start_date' || key == 'end_date') {
      return new Date(value);
    }
  });
  return result;
}

// Available task is: active, uncompleted, not timed out, has free spots
export const getAllAvaliableTasks = async (): Promise<ITask[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios({
      url: tasksUrl,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    const result: ITask[] = [];
    response.data.forEach(i => {
      result.push(parseObject(i));
    });
    return result;
  } catch (err: any) {
    console.error('Get request getAllAvaliableTasks has failed', err);
    throw new Error('Get request getAllAvaliableTasks has failed');
  }
};

// Accept an available task.
// Authenticated only
// Post request body should be empty. Will be ignored anyway.
export const postTaskAccept = async (taskId: number): Promise<ITask> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${tasksUrl}${taskId}/accept/`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return parseObject(response.data);
  } catch (err: any) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};

//Complete the task. Can only complete an active uncompleted task.
//Post request body should be empty. Will be ignored anyway.
//Curators only.
export const postTaskComplete = async (taskId: number): Promise<ITask> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${tasksUrl}${taskId}/complete/`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return parseObject(response.data);
  } catch (err: any) {
    console.error('Post request postTaskComplete has failed', err);
    throw new Error('Post request postTaskComplete has failed');
  }
};

//Abandon the task. Can only abandon an active uncompleted task.
//Post request body should be empty. Will be ignored anyway.
//Authenticated only.
export const postTaskRefuse = async (taskId: number): Promise<ITask> => {
  try {
    const response: AxiosResponse<string> = await axios({
      url: `${tasksUrl}${taskId}/refuse/`,
      method: 'POST',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });
    return parseObject(response.data);
  } catch (err: any) {
    console.error('Post request postTaskRefuse has failed', err);
    throw new Error('Post request postTaskRefuse has failed');
  }
};

//Get current user's tasks. Returns all user's tasks by default.
//Filtering by is_active and/or is_completed is supported.
//Authenticated only.

export const getMyTasks = async (
  is_active: boolean = false,
  is_completed: boolean = false,
): Promise<ITask[]> => {
  try {
    const response: AxiosResponse<string[]> = await axios({
      url: `${tasksUrl}/api/tasks/my/?is_active=${is_active === true ? 1 : 0}&is_completed=${is_completed === true ? 1 : 0}`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'cross-origin-opener-policy': 'same-origin',
      },
    });

    const result: ITask[] = [];
    response.data.forEach(i => {
      result.push(parseObject(i));
    });
    return result;
  } catch (err: any) {
    console.error('Get request getMyTasks has failed', err);
    throw new Error('Get request getMyTasks has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { ITask };
