import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import newsReducer from './slices/newsSlice';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    doctors: doctorReducer,
    appointments: appointmentReducer,
    news: newsReducer,
    users: userReducer,
    auth: authReducer,
  },
});