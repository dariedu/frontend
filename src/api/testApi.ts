import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Устанавливаем URL API
const API_URL = process.env.REACT_APP_API_URL as string;

// Определяем эндпоинты для авторизации
const authRegister = `${API_URL}/register/`;
const authLogin = `${API_URL}/login/`;
const getUserInfo = `${API_URL}/user/`;
const authLogout = `${API_URL}/logout/`;

// Типизация ответа API
interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

interface User {
  id: number;
  email: string;
  username: string;
}

interface UserTestStats {
  correct: number;
  incorrect: number;
  skipped: number;
}

interface TestResults {
  id: number;
  result: string;
  score: number;
}

interface FilteredTextAnswers {
  question_id: number;
  answer: string;
  category: string;
  ids: number[];
}

// Регистрация пользователя
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
): Promise<AuthResponse> => {
  try {
    const response = await toast.promise(
      axios.post<AuthResponse>(authRegister, {
        username: name,
        email: email,
        password1: password,
        password2: confirmPassword,
      }),
      {
        loading: 'Registering...',
        success: 'Registration successful',
        error: 'Registration failed',
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    // Добавляем return после throw для удовлетворения TypeScript
    throw new Error('An unexpected error occurred.');
  }
};

// Вход пользователя
export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await toast.promise(
      axios.post<AuthResponse>(authLogin, { email, password }),
      {
        loading: 'Logging in...',
        success: 'Loading successful',
        error: 'Login failed: invalid username or password',
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error('An unexpected error occurred.');
  }
};

// Получение данных пользователя
export const fetchUserData = async (token: string): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await axios.get(getUserInfo, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
};

// Выход пользователя
export const logoutUser = async (token: string): Promise<void> => {
  try {
    console.log('Logging out with token:', token);
    const response = await toast.promise(
      axios.post(authLogout, null, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-type': 'application/json',
        },
      }),
      {
        loading: 'Logging out...',
        success: 'Logout successful!',
        error: 'Logout failed: an error occurred',
      },
    );
    console.log('Logout response:', response.data);
  } catch (error: any) {
    console.error('Logout failed:', error);
    throw new Error('Failed to logout');
  }
};

// Подключение к базе данных клиента
export const connectClientDB = async (formData: object): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/clientdb/`, formData, {
      headers: {
        'Content-type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Connection to client DB failed:', error);
    throw new Error('Failed to connect to client DB');
  }
};

// Получение статистики по тестам пользователя
export const getUserTestStats = async (
  testID: number,
  // ids: number[],
  access: string,
): Promise<UserTestStats> => {
  try {
    const res: AxiosResponse<UserTestStats> = await axios({
      url: `${API_URL}/tests/${testID}/stats`,
      method: 'GET',
      headers: {
        'Access-Control-Allow-Headers': '*',
        Authorization: `Bearer ${access}`,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Failed to get user test stats:', error);
    throw new Error('Failed to get user test stats');
  }
};

// Получение результатов тестов
export const getTestResults = async (
  id: number,
  offset: number,
  limit: number,
  access: string,
): Promise<TestResults[]> => {
  try {
    const res: AxiosResponse<TestResults[]> = await axios({
      url: `${API_URL}/tests-complete/?test=${id}&offset=${offset}&limit=${limit}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: `Bearer ${access}`,
      },
      data: {
        id: id,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Failed to get test results:', error);
    throw new Error('Failed to get test results');
  }
};

// Получение отфильтрованных текстовых ответов
export const getFilteredTextAnswers = async (
  question_id: number,
  offset: number,
  limit: number,
  category: string,
  ids: number[],
  access: string,
): Promise<FilteredTextAnswers[]> => {
  try {
    const res: AxiosResponse<FilteredTextAnswers[]> = await axios({
      url: `${API_URL}/filtered-text-answers/`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': '*',
        Authorization: `Bearer ${access}`,
      },
      data: {
        question_id: question_id,
        offset: offset,
        limit: limit,
        category: category,
        ids: ids,
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Failed to get filtered text answers:', error);
    throw new Error('Failed to get filtered text answers');
  }
};
