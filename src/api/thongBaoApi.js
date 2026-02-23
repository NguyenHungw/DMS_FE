import axiosClient from './axiosInstance';

const thongBaoApi = {
    // Lấy danh sách thông báo
    getAll: () => {
        return axiosClient.get('/ThongBao');
    },

    // Lấy chi tiết thông báo
    getById: (id) => {
        return axiosClient.get(`/ThongBao/${id}`);
    },

    // Tạo thông báo mới
    create: (data) => {
        return axiosClient.post('/ThongBao', data);
    },

    // Xóa thông báo
    delete: (id) => {
        return axiosClient.delete(`/ThongBao/${id}`);
    },

    // Đăng bình luận
    postComment: (id, content) => {
        return axiosClient.post(`/ThongBao/${id}/binh-luan`, { noiDung: content });
    },

    // Xóa bình luận
    deleteComment: (id) => {
        return axiosClient.delete(`/ThongBao/binh-luan/${id}`);
    },

    // Ghim/Hủy ghim thông báo
    togglePin: (id, status) => {
        return axiosClient.put(`/ThongBao/${id}/pin`, status);
    }
};

export default thongBaoApi;
