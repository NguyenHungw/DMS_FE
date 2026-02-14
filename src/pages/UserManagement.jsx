import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Avatar, Typography, Button, Alert, message } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import nguoiDungApi from '../api/nguoiDungApi';
import '../styles/pages/UserManagement.scss';

const { Title } = Typography;

const UserManagement = () => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Admin';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await nguoiDungApi.getAll();
            setUsers(response);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'User',
            dataIndex: 'hoTen',
            key: 'hoTen',
            render: (text) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <span className="user-name">{text}</span>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Department',
            dataIndex: 'phongBan',
            key: 'phongBan',
        },
        {
            title: 'Role',
            dataIndex: 'vaiTro',
            key: 'vaiTro',
            render: (role) => (
                <Tag color={role === 'Administrator' || role === 'Admin' ? 'volcano' : 'blue'}>
                    {(role || 'User').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (status) => (
                <Tag color={status === 'active' || status === 'Active' ? 'green' : 'red'}>
                    {(status || 'Unknown').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                isAdmin ? (
                    <Space size="middle">
                        <Button type="link" icon={<EditOutlined />}>Edit</Button>
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={async () => {
                                try {
                                    await nguoiDungApi.delete(record.id);
                                    message.success('Xóa người dùng thành công');
                                    fetchUsers();
                                } catch (error) {
                                    message.error('Lỗi khi xóa người dùng');
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </Space>
                ) : (
                    <Tag icon={<LockOutlined />} color="default">Read Only</Tag>
                )
            ),
        },
    ];

    return (
        <div className="users-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>User Management</Title>
                {!isAdmin && <Alert message="Administrator Access Required for Modifications" type="warning" showIcon />}
            </div>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="users-table"
            />
        </div>
    );
};

export default UserManagement;
