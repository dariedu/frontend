import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const tasksUrl = `${API_URL}/tasks/`;

type TTaskCategory = {
  id: number;
  name: string;
  icon?: string;
};

interface ITask {
  id: number;
  category: TTaskCategory;
  name: string;
  price: number;
  description?: string;
  start_date: string;
  end_date: string;
  volunteers_needed: number;
  volunteers_taken: number;
  is_active: boolean;
  is_completed: boolean;
  city: string;
  curator: number;
  volunteers: number[];
}

// Запросить все задачи
export const getAllAvaliableTasks = async (): Promise<ITask[]> => {
  try {
    const response: AxiosResponse<ITask[]> = await axios.get(tasksUrl, {
      headers: {
        accept: 'application/json',
      },
    });
    return response.data;
  } catch (err: any) {
    console.error('Get request getAllAvaliableTasks has failed', err);
    throw new Error('Get request getAllAvaliableTasks has failed');
  }
};

// Принять задание
export const postTaskAccept = async (
  taskId: number,
  access: string | null,
): Promise<ITask> => {
  try {
    const response: AxiosResponse<ITask> = await axios.post(
      `${tasksUrl}${taskId}/accept/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access}`,
          accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    console.error('Post request postTaskAccept has failed', err);
    throw new Error('Post request postTaskAccept has failed');
  }
};

// Завершить задание
export const postTaskComplete = async (
  taskId: number,
  access: string | null,
): Promise<ITask> => {
  try {
    const response: AxiosResponse<ITask> = await axios.post(
      `${tasksUrl}${taskId}/complete/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access}`,
          accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    console.error('Post request postTaskComplete has failed', err);
    throw new Error('Post request postTaskComplete has failed');
  }
};

// Отказаться от задания
export const postTaskRefuse = async (
  taskId: number,
  access: string | null,
): Promise<ITask> => {
  try {
    const response: AxiosResponse<ITask> = await axios.post(
      `${tasksUrl}${taskId}/refuse/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access}`,
          accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    console.error('Post request postTaskRefuse has failed', err);
    throw new Error('Post request postTaskRefuse has failed');
  }
};

// Получить список заданий куратора
export const getTasksCurator = async (
  access: string | null,
): Promise<ITask[]> => {
  try {
    const response: AxiosResponse<ITask[]> = await axios.get(
      `${tasksUrl}curator_of/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    console.error('Get request getTasksCurator has failed', err);
    throw new Error('Get request getTasksCurator has failed');
  }
};

// Получить категории заданий
export const getTasksCategories = async (
  access: string | null,
): Promise<TTaskCategory[]> => {
  try {
    const response: AxiosResponse<TTaskCategory[]> = await axios.get(
      `${tasksUrl}get_categories/`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    console.error('Get request getTasksCategories has failed', err);
    throw new Error('Get request getTasksCategories has failed');
  }
};

// Получить свои задания
export const getMyTasks = async (
  is_active: boolean = false,
  is_completed: boolean = false,
  access: string | null,
): Promise<ITask[]> => {
  try {
    const response: AxiosResponse<ITask[]> = await axios.get(
      `${tasksUrl}my/?is_active=${is_active ? 1 : 0}&is_completed=${
        is_completed ? 1 : 0
      }`,
      {
        headers: {
          Authorization: `Bearer ${access}`,
          accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (err: any) {
    console.error('Get request getMyTasks has failed', err);
    throw new Error('Get request getMyTasks has failed');
  }
};

// Экспортируем интерфейсы и типы для использования в других API-файлах
export type { ITask, TTaskCategory };
