import axiosClient from './axiosInstance';

const nhatKyApi = {
    // Get all activity logs
    getAll: () => {
        return axiosClient.get('/NhatKy');
    },
};

export default nhatKyApi;
