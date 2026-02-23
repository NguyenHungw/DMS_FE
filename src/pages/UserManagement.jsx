import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Avatar, Typography, Button, Alert, App, Modal, Form, Input, Select } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import nguoiDungApi from '../api/nguoiDungApi';
import lookupApi from '../api/lookupApi';
import '../styles/pages/UserManagement.scss';

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Lookups
    const [phongBans, setPhongBans] = useState([]);
    const [vaiTros, setVaiTros] = useState([]);

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

    const fetchLookups = async () => {
        try {
            const [pbRes, vtRes] = await Promise.all([
                lookupApi.getPhongBans(),
                lookupApi.getVaiTros()
            ]);
            setPhongBans(pbRes);
            setVaiTros(vtRes);
        } catch (error) {
            console.error('Failed to fetch lookups:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        if (isAdmin) {
            fetchLookups();
        }
    }, [isAdmin]);

    // Handle Modal show/hide
    const showModal = (u = null) => {
        setEditingUser(u);
        if (u) {
            form.setFieldsValue({
                ...u,
                matKhau: '', // Don't show password
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ trangThai: 'Active' });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            if (editingUser) {
                // Update mode
                const updateData = { ...values, id: editingUser.id };
                if (!values.matKhau) {
                    delete updateData.matKhau;
                }
                await nguoiDungApi.update(editingUser.id, updateData);
                message.success('Cập nhật người dùng thành công');
            } else {
                // Create mode
                await nguoiDungApi.create(values);
                message.success('Thêm người dùng mới thành công');
            }
            setIsModalVisible(false);
            setEditingUser(null);
            form.resetFields();
            fetchUsers();
        } catch (error) {
            const action = editingUser ? 'cập nhật' : 'thêm';
            // error is already the data because of axiosInstance interceptor
            const errorMsg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
            message.error(`Lỗi khi ${action} người dùng: ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'hoTen',
            key: 'hoTen',
            render: (text, record) => (
                <Space>
                    <Avatar
                        src={record.hinhAnh ? `${import.meta.env.VITE_BASE_URL}${record.hinhAnh}` : null}
                        icon={!record.hinhAnh && <UserOutlined />}
                    />
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
            title: 'Phòng ban',
            dataIndex: 'tenPhongBan',
            key: 'tenPhongBan',
            render: (text) => <Tag color="blue">{text || 'N/A'}</Tag>
        },
        {
            title: 'Vai trò',
            dataIndex: 'tenVaiTro',
            key: 'tenVaiTro',
            render: (role) => (
                <Tag color={role === 'Administrator' ? 'volcano' : 'cyan'}>
                    {(role || 'Staff').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (status) => (
                <Tag color={status === 'active' || status === 'Active' ? 'green' : 'red'}>
                    {(status || 'Unknown').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                isAdmin ? (
                    <Space size="middle">
                        <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
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
                            Xóa
                        </Button>
                    </Space>
                ) : (
                    <Tag icon={<LockOutlined />} color="default">Chỉ xem</Tag>
                )
            ),
        },
    ];

    return (
        <div className="users-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>Quản lý người dùng</Title>
                <Space>
                    {!isAdmin && <Alert message="Yêu cầu quyền Administrator để chỉnh sửa" type="warning" showIcon />}
                    {isAdmin && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                        >
                            Thêm người dùng mới
                        </Button>
                    )}
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="users-table"
            />

            <Modal
                title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                confirmLoading={submitting}
                width={600}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ trangThai: 'Active' }}
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="hoTen"
                            label="Họ và tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                        >
                            <Input placeholder="Nguyễn Văn A" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không đúng định dạng' }
                            ]}
                        >
                            <Input placeholder="email@company.com" disabled={!!editingUser} />
                        </Form.Item>
                        <Form.Item
                            name="matKhau"
                            label={editingUser ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                            rules={[{ required: !editingUser, message: 'Vui lòng nhập mật khẩu' }]}
                        >
                            <Input.Password placeholder="••••••" />
                        </Form.Item>
                        <Form.Item
                            name="trangThai"
                            label="Trạng thái"
                            rules={[{ required: true }]}
                        >
                            <Select>
                                <Option value="Active">Hoạt động</Option>
                                <Option value="Inactive">Ngừng hoạt động</Option>
                                <Option value="Blocked">Bị khóa</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="phongBanId"
                            label="Phòng ban"
                            rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                        >
                            <Select placeholder="Chọn phòng ban">
                                {phongBans.map(pb => (
                                    <Option key={pb.id} value={pb.id}>{pb.tenPhongBan}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="vaiTroId"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                        >
                            <Select placeholder="Chọn vai trò">
                                {vaiTros.map(vt => (
                                    <Option key={vt.id} value={vt.id}>{vt.tenVaiTro}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
