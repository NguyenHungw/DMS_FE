import axiosClient from './axiosInstance';

const authApi = {
    // Register new user
    register: (data) => {
        return axiosClient.post('/auth/register', data);
    },

    // Login with email/password
    login: (data) => {
        return axiosClient.post('/Auth/dang-nhap', data);
    },

    // Login with Google
    googleLogin: (idToken) => {
        return axiosClient.post('/auth/google', { idToken });
    },

    // Refresh token
    refreshToken: (refreshToken) => {
        return axiosClient.post('/auth/refresh', { refreshToken });
    },

    // Revoke token
    revokeToken: (refreshToken) => {
        return axiosClient.post('/auth/revoke', { refreshToken });
    },

    // Logout
    logout: () => {
        return axiosClient.post('/auth/logout');
    },

    // Get current user
    getMe: () => {
        return axiosClient.get('/auth/me');
    },

    // Get active sessions
    getSessions: () => {
        return axiosClient.get('/auth/sessions');
    },
};

export default authApi;
