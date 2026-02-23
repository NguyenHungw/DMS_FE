import axiosClient from './axiosInstance';

const vaiTroApi = {
    // Lấy danh sách tất cả các vai trò và quyền hạn tương ứng
    // Endpoint: GET /api/Permission/roles
    getAllRoles: () => {
        return axiosClient.get('/Permission/roles');
    },

    // Lấy danh sách tất cả các quyền hạn có sẵn trong hệ thống
    // Endpoint: GET /api/Permission/all
    getAvailablePermissions: () => {
        return axiosClient.get('/Permission/all');
    },

    // Cập nhật quyền hạn cho một vai trò cụ thể
    // Endpoint: POST /api/Permission/assign
    // DTO: { roleId: number, permissionIds: number[] }
    updateRolePermissions: (roleId, permissionIds) => {
        return axiosClient.post('/Permission/assign', {
            roleId: parseInt(roleId),
            permissionIds: permissionIds.map(id => parseInt(id))
        });
    }
};

export default vaiTroApi;
