import axiosClient from './axiosInstance';

const nguoiDungApi = {
    // Get all users
    getAll: () => {
        return axiosClient.get('/NguoiDung');
    },

    // Get user detail
    getDetail: (id) => {
        return axiosClient.get(`/NguoiDung/${id}`);
    },

    // Create new user
    create: (data) => {
        return axiosClient.post('/NguoiDung', data);
    },

    // Update user
    update: (id, data) => {
        return axiosClient.put(`/NguoiDung/${id}`, data);
    },

    // Delete user
    delete: (id) => {
        return axiosClient.delete(`/NguoiDung/${id}`);
    },
};

export default nguoiDungApi;
