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

    // Create new document (Multi-part for file upload)
    create: (formData) => {
        return axiosClient.post('/TaiLieu', formData, {
            headers: {
                'Content-Type': undefined,
            },
        });
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

    // Get pending documents
    getPending: () => {
        return axiosClient.get('/TaiLieu/pending');
    },

    // Update document metadata
    update: (id, data) => {
        return axiosClient.put(`/TaiLieu/${id}`, data);
    },

    // Download document
    download: (id) => {
        return axiosClient.get(`/TaiLieu/${id}/download`, {
            responseType: 'blob'
        });
    },

    // Categories (directories)
    getCategories: () => {
        return axiosClient.get('/Lookup/danh-muc'); // Or /DanhMuc if you want to use the CRUD controller
    },
    createCategory: (data) => {
        return axiosClient.post('/DanhMuc', data);
    },
    deleteCategory: (id) => {
        return axiosClient.delete(`/DanhMuc/${id}`);
    }
};

export default taiLieuApi;
