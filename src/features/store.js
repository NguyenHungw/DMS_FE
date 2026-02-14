import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import documentReducer from './documentSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        documents: documentReducer,
        dashboard: dashboardReducer,
    },
});

export default store;
