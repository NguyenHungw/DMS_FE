import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../api/authApi';

export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            // Assuming response contains { token, user } or similar
            // Based on backend conventions, it might be { data: { token, user } }
            // axiosInstance already returns response.data
            return response;
        } catch (error) {
            return rejectWithValue(error || 'Đăng nhập thất bại');
        }
    }
);

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const { token, hoTen, vaiTro } = action.payload;
                state.token = token;
                state.user = { name: hoTen, role: vaiTro };

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
