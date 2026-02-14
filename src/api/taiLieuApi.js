import axiosClient from './axiosInstance';

const taiLieuApi = {
    // Get all documents
    getAll: () => {
        return axiosClient.get('/TaiLieu');
    },

    // Search documents
    search: (params) => {
        return axiosClient.get('/TaiLieu/tim-kiem', { params });
    },

    // Get document detail
    getDetail: (id) => {
        return axiosClient.get(`/TaiLieu/${id}`);
    },

    // Create new document
    create: (data) => {
        return axiosClient.post('/TaiLieu', data);
    },

    // Delete document
    delete: (id) => {
        return axiosClient.delete(`/TaiLieu/${id}`);
    },

    // Create new version
    createVersion: (data) => {
        return axiosClient.post('/TaiLieu/phien-ban', data);
    },

    // Submit for approval
    submitForApproval: (id) => {
        return axiosClient.patch(`/TaiLieu/${id}/gui-duyet`);
    },

    // Approve document
    approve: (id) => {
        return axiosClient.patch(`/TaiLieu/${id}/phe-duyet`);
    },

    // Circulate document
    circulate: (id) => {
        return axiosClient.patch(`/TaiLieu/${id}/ban-hanh`);
    },
};

export default taiLieuApi;
