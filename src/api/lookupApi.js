import axiosClient from './axiosInstance';

const lookupApi = {
    getPhongBans: () => axiosClient.get('/Lookup/phong-ban'),
    getVaiTros: () => axiosClient.get('/Lookup/vai-tro'),
    getLoaiTaiLieus: () => axiosClient.get('/Lookup/loai-tai-lieu'),
    getChuyenMucs: () => axiosClient.get('/Lookup/chuyen-muc'),
    getDanhMucs: () => axiosClient.get('/Lookup/danh-muc'),
    getQuyenHans: () => axiosClient.get('/Lookup/quyen-han'),
};

export default lookupApi;
