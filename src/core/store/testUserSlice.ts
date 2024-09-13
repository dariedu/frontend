// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import {
//   registerUser,
//   loginUser,
//   fetchUserData,
//   logoutUser,
// } from 'src/api/api';
// import { toast } from 'react-hot-toast';
// import { RootState } from './store';

// // Типы для thunk-функций
// interface RegisterUserArgs {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// interface LoginUserArgs {
//   email: string;
//   password: string;
// }

// interface UserState {
//   user: User | null;
//   token: string | null;
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// // Определите интерфейс User (он должен соответствовать вашей модели пользователя)
// interface User {
//   id: number;
//   email: string;
//   username: string;
// }

// // AsyncThunk для регистрации пользователя
// export const register = createAsyncThunk<
//   { token: string; user: User },
//   RegisterUserArgs,
//   { rejectValue: string }
// >('user/register', async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
//   try {
//     const data = await registerUser(name, email, password, confirmPassword);
//     const [token, userData] = data;
//     localStorage.setItem('userToken', JSON.stringify(token));
//     localStorage.setItem('userData', JSON.stringify(userData));
//     return { token, user: userData };
//   } catch (error: any) {
//     return rejectWithValue(error.message || 'Registration failed');
//   }
// });

// // AsyncThunk для входа пользователя
// export const login = createAsyncThunk<
//   { token: string; user: User },
//   LoginUserArgs,
//   { rejectValue: string }
// >('user/login', async ({ email, password }, { rejectWithValue }) => {
//   try {
//     const data = await loginUser(email, password);
//     const token = data.key;
//     const user = await fetchUserData(token);
//     localStorage.setItem('userToken', JSON.stringify(token));
//     localStorage.setItem('userData', JSON.stringify(user));
//     return { token, user };
//   } catch (error: any) {
//     return rejectWithValue(error.message || 'Login failed');
//   }
// });

// // AsyncThunk для выхода пользователя
// export const performLogout = createAsyncThunk<
//   null,
//   void,
//   { state: RootState; rejectValue: string }
// >('user/logout', async (_, { getState, rejectWithValue }) => {
//   const token = getState().user.token;
//   if (!token) {
//     return rejectWithValue('No token found for logout');
//   }
//   try {
//     await logoutUser(token);
//     localStorage.removeItem('userData');
//     localStorage.removeItem('userToken');
//     localStorage.removeItem('connections');
//     return null;
//   } catch (error: any) {
//     toast.error('Logout failed');
//     return rejectWithValue(error.message || 'Logout failed');
//   }
// });

// // Загрузка пользователя из LocalStorage
// const loadUserFromLocalStorage = (): { token: string | null; user: User | null } => {
//   const token = JSON.parse(localStorage.getItem('userToken') || 'null');
//   const user = JSON.parse(localStorage.getItem('userData') || 'null');
//   return { token, user };
// };

// // Slice для пользователя
// const userSlice = createSlice({
//   name: 'user',
//   initialState: loadUserFromLocalStorage() as UserState,
//   reducers: {
//     setUser(state, action: PayloadAction<User | null>) {
//       state.user = action.payload;
//     },
//     setToken(state, action: PayloadAction<string | null>) {
//       state.token = action.payload;
//     },
//     logout(state) {
//       state.user = null;
//       state.token = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(register.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload || 'Registration failed';
//       })
//       .addCase(login.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload || 'Login failed';
//       })
//       .addCase(performLogout.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(performLogout.fulfilled, (state) => {
//         state.status = 'succeeded';
//         state.user = null;
//         state.token = null;
//       })
//       .addCase(performLogout.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload || 'Logout failed';
//       });
//   },
// });

// export const { setUser, setToken, logout } = userSlice.actions;

// export default userSlice.reducer;
