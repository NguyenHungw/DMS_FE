import React, { useState, useEffect } from 'react';
import {
    Typography,
    Space,
    Card,
    App,
    Switch,
    Alert,
    Tag,
    Input,
    Button,
    Tooltip,
    Empty,
    Divider,
    Spin,
    Segmented,
    Table,
    Select,
    Avatar
} from 'antd';
import {
    SaveOutlined,
    ReloadOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    UserSwitchOutlined,
    CopyOutlined,
    AppstoreOutlined,
    UserOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import vaiTroApi from '../api/vaiTroApi';
import nguoiDungApi from '../api/nguoiDungApi';
import '../styles/pages/PermissionsManagement.scss';

const { Title, Text } = Typography;

const PermissionsManagement = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('roles'); // 'roles' or 'users'

    // Roles state
    const [roles, setRoles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [permissionsData, setPermissionsData] = useState({});
    const [activeRole, setActiveRole] = useState(null);

    // Users state
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch roles and all permissions
            const [availablePerms, rolesWithPerms, allUsers] = await Promise.all([
                vaiTroApi.getAvailablePermissions(),
                vaiTroApi.getAllRoles(),
                nguoiDungApi.getAll()
            ]);

            setAllPermissions(availablePerms);
            setUsers(allUsers);

            const formattedRoles = rolesWithPerms.map(r => ({
                id: r.roleId,
                name: r.roleName,
                code: r.roleName.toUpperCase(),
                color: r.roleId === 1 ? 'volcano' : r.roleId === 2 ? 'blue' : 'green',
                desc: `Vai trò ${r.roleName} trong hệ thống`
            }));
            setRoles(formattedRoles);

            const permMap = {};
            rolesWithPerms.forEach(r => {
                permMap[r.roleId] = r.permissions.map(p => p.id);
            });
            setPermissionsData(permMap);

            if (!activeRole && formattedRoles.length > 0) {
                setActiveRole(formattedRoles[0]);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu phân quyền:', error);
            message.error('Không thể tải dữ liệu phân quyền');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePermissionToggle = (permissionId, checked) => {
        if (!activeRole) return;
        setPermissionsData(prev => ({
            ...prev,
            [activeRole.id]: checked
                ? [...(prev[activeRole.id] || []), permissionId]
                : (prev[activeRole.id] || []).filter(id => id !== permissionId)
        }));
    };

    const handleSaveRolePermissions = async () => {
        if (!activeRole) return;
        setLoading(true);
        try {
            await vaiTroApi.updateRolePermissions(activeRole.id, permissionsData[activeRole.id] || []);
            message.success(`Đã cập nhật quyền hạn cho vai trò ${activeRole.name}`);
        } catch (error) {
            message.error('Lỗi khi cập nhật quyền hạn');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserRole = async (userId, newRoleId) => {
        try {
            setLoading(true);
            // Sử dụng endpoint updateRole chuyên biệt thay vì cập nhật toàn bộ user
            await nguoiDungApi.updateRole(userId, newRoleId);
            message.success('Cập nhật vai trò người dùng thành công');
            fetchData(); // Tải lại dữ liệu để cập nhật bảng
        } catch (error) {
            console.error('Lỗi khi cập nhật vai trò người dùng:', error);
            message.error('Lỗi khi cập nhật vai trò người dùng');
        } finally {
            setLoading(false);
        }
    };

    const getPermissionColor = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('view')) return 'default';
        if (lower.includes('create')) return 'processing';
        if (lower.includes('edit')) return 'warning';
        if (lower.includes('delete')) return 'error';
        return 'default';
    };

    // Users Table Columns
    const userColumns = [
        {
            title: 'Người dùng',
            dataIndex: 'hoTen',
            key: 'hoTen',
            render: (text, record) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <Space direction="vertical" size={0}>
                        <Text strong>{text}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Phòng ban',
            dataIndex: 'tenPhongBan',
            key: 'tenPhongBan',
            render: (pb) => <Tag color="cyan">{pb || 'N/A'}</Tag>
        },
        {
            title: 'Vai trò hiện tại',
            dataIndex: 'vaiTroId',
            key: 'vaiTroId',
            render: (roleId, record) => {
                const role = roles.find(r => r.id === roleId);
                return <Tag color={role?.color || 'default'}>{role?.name || 'Chưa gán'}</Tag>;
            }
        },
        {
            title: 'Quyền hạn thực tế',
            dataIndex: 'quyenHans',
            key: 'quyenHans',
            width: 250,
            render: (perms) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {perms && perms.length > 0 ? (
                        perms.map(p => (
                            <Tag key={p} color={getPermissionColor(p)} style={{ fontSize: 10 }}>
                                {p.toUpperCase()}
                            </Tag>
                        ))
                    ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>Không có quyền</Text>
                    )}
                </div>
            )
        },
        {
            title: 'Thay đổi vai trò',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn vai trò"
                    value={record.vaiTroId}
                    onChange={(val) => handleUpdateUserRole(record.id, val)}
                    disabled={loading}
                >
                    {roles.map(r => (
                        <Select.Option key={r.id} value={r.id}>
                            {r.name}
                        </Select.Option>
                    ))}
                </Select>
            ),
        },
    ];

    const filteredUsers = users.filter(u =>
        u.hoTen?.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredPermissions = allPermissions.filter(p =>
        p.tenQuyenHan.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="permissions-container-v2">
            <div className="mode-selector-wrapper">
                <Segmented
                    size="large"
                    options={[
                        { label: 'Quyền hạn', value: 'roles', icon: <AppstoreOutlined /> },
                        { label: 'Phân quyền người dùng', value: 'users', icon: <UserSwitchOutlined /> },
                    ]}
                    value={mode}
                    onChange={setMode}
                    block
                />
            </div>

            {mode === 'roles' ? (
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* Sidebar Roles */}
                    <div className="roles-sidebar">
                        <div className="sidebar-header">
                            <Title level={4} className="sidebar-title">Vai trò hệ thống</Title>
                        </div>
                        <div className="roles-list">
                            {roles.map(role => (
                                <div
                                    key={role.id}
                                    className={`role-item ${activeRole?.id === role.id ? 'active' : ''}`}
                                    onClick={() => setActiveRole(role)}
                                >
                                    <span className="role-name">{role.name}</span>
                                    <div className="role-meta">
                                        <Tag color={role.color}>{role.code}</Tag>
                                        <span>{(permissionsData[role.id] || []).length} quyền</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detail Permissions */}
                    <div className="permissions-detail-panel">
                        <div className="detail-header">
                            <div className="header-info">
                                <Title level={4} style={{ margin: 0 }}>Chỉnh sửa quyền: {activeRole?.name}</Title>
                            </div>
                            <Space>
                                <Button icon={<ReloadOutlined />} onClick={fetchData} />
                                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveRolePermissions} loading={loading}>
                                    Lưu quyền hạn
                                </Button>
                            </Space>
                        </div>
                        <div className="sidebar-search" style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <Input
                                placeholder="Tìm kiếm quyền hạn..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                allowClear
                            />
                        </div>
                        <div className="detail-content">
                            <div className="module-grid">
                                <Card className="module-card">
                                    <div className="permission-items-list">
                                        {filteredPermissions.map(permission => (
                                            <div key={permission.id} className="permission-row">
                                                <div className="perm-label">
                                                    <Tag color={getPermissionColor(permission.tenQuyenHan)}>{permission.tenQuyenHan.toUpperCase()}</Tag>
                                                    <span className="perm-name">{permission.tenQuyenHan}</span>
                                                </div>
                                                <Switch
                                                    checked={(permissionsData[activeRole?.id] || []).includes(permission.id)}
                                                    onChange={(checked) => handlePermissionToggle(permission.id, checked)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="users-assignment-panel">
                    <Card title={<Space><SolutionOutlined /> Quản lý Vai trò Người dùng</Space>} className="users-card">
                        <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
                            <Input
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                size="large"
                                style={{ maxWidth: 400 }}
                            />
                            <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
                        </div>

                        <Table
                            columns={userColumns}
                            dataSource={filteredUsers}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 12 }}
                            bordered
                        />
                    </Card>
                </div>
            )}
        </div>
    );
};

export default PermissionsManagement;
