import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;
const tasksUrl = `${API_URL}/tasks/`;

type TTaskCategory = {
  id: number;
  name: string;
  icon?: string;
};

interface ITask {
  id: number
  city: {
    id: number,
    city: string
  }
  category: TTaskCategory
  curator: {
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
  name: string;
  volunteer_price: number
  curator_price: number;
  description?: string;
  start_date: string;
  end_date: string;
  volunteers_needed: number;
  volunteers_taken: number;
  is_active: boolean;
  is_completed: boolean;
  volunteers?: number[];
}


// Запросить все задачи
export const getAllAvaliableTasks = async (
  access: string
): Promise<ITask[]> => {
  try {
    const response: AxiosResponse<ITask[]> = await axios({
      url: tasksUrl,
      method: 'GET',
      headers: {
         Authorization: `Bearer ${access}`,
        accept: 'application/json',
      },
    });
    console.log(response.data, "api tasks")
    return response.data;
  } catch (err: any) {
    console.error('Get request getAllAvaliableTasks has failed', err);
    throw new Error('Get request getAllAvaliableTasks has failed');
  }
};

// Принять задание
export const postTaskAccept = async (
  taskId: number,
  access: string,
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
    //console.error('Post request postTaskAccept has failed', err);
     throw new Error(err.response.data.error)
    // if (err.response.data.error == "You\'ve already taken this task!") {
    //    console.log(err.response.data.error)
     
    // } else {
     
    // throw new Error('Post request postTaskAccept has failed');
    // }
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
  access: string,
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

// Получить категории заданий
// export const getTasksCategories = async (
//   access: string,
// ): Promise<TTaskCategory[]> => {
//   try {
//     const response: AxiosResponse<TTaskCategory[]> = await axios({
//         url: `${tasksUrl}get_categories/`,
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${access}`,
//           accept: 'application/json',
//         },
//       },
//     );
//     return response.data;
//   } catch (err: any) {
//     console.error('Get request getTasksCategories has failed', err);
//     throw new Error('Get request getTasksCategories has failed');
//   }
// };

// Получить свои задания c фильтрами
export const getMyTasks = async (
  access: string | null,
  is_active: boolean = false,
  is_completed: boolean = false,
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
// Получить свои задания без фильтров
export const getMyTasksNoFilter = async (
  access: string | null,
): Promise<ITask[]> => {
  try {
    const response: AxiosResponse<ITask[]> = await axios.get(
      `${tasksUrl}my`,
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
