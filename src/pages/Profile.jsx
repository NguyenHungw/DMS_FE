import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Typography, Tag, Divider, Row, Col, Button, Space, Upload, message, App } from 'antd';
import { UserOutlined, MailOutlined, BankOutlined, SecurityScanOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';

const { Title, Text } = Typography;

const Profile = () => {
    const { message: antMessage } = App.useApp();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/Profile');
            setProfileData(response);
        } catch (error) {
            antMessage.error('Không thể tải thông tin hồ sơ');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpload = async (info) => {
        const { status } = info.file;
        if (status === 'uploading') {
            setLoading(true);
            return;
        }
        if (status === 'done') {
            antMessage.success(`${info.file.name} đã được tải lên thành công.`);
            setLoading(false);
            fetchProfile(); // Refresh profile to get NEW avatar URL

            // Cập nhật Redux store để Header nhận diện avatar mới
            const updatedUser = { ...user, hinhAnh: info.file.response.url };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload(); // Refresh to update all components
        } else if (status === 'error') {
            antMessage.error(`${info.file.name} tải lên thất bại.`);
            setLoading(false);
        }
    };

    const displayUser = profileData || user;

    return (
        <div className="profile-container" style={{ padding: '24px' }}>
            <Row gutter={24}>
                <Col xs={24} lg={8}>
                    <Card style={{ textAlign: 'center', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                            <Avatar
                                size={120}
                                icon={<UserOutlined />}
                                src={displayUser?.hinhAnh ? `${baseUrl}${displayUser.hinhAnh}` : null}
                                style={{ backgroundColor: '#1890ff', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Upload
                                name="file"
                                action={`${baseUrl}/api/Profile/avatar`}
                                headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                                showUploadList={false}
                                onChange={handleUpload}
                                style={{ position: 'absolute', bottom: 0, right: 0 }}
                            >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<UploadOutlined />}
                                    size="small"
                                    loading={loading}
                                />
                            </Upload>
                        </div>
                        <Title level={3}>{displayUser?.hoTen || displayUser?.name || 'Người dùng'}</Title>
                        <Tag color="volcano" style={{ marginBottom: '16px', borderRadius: '4px', padding: '0 12px' }}>
                            {displayUser?.tenVaiTro || 'NHÂN VIÊN'}
                        </Tag>
                        <Divider />
                        <div style={{ textAlign: 'left' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text><MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} /> {displayUser?.email}</Text>
                                <Text><BankOutlined style={{ marginRight: '8px', color: '#1890ff' }} /> {displayUser?.tenPhongBan || 'Phòng Hạ tầng IT'}</Text>
                                <Text><SecurityScanOutlined style={{ marginRight: '8px', color: '#1890ff' }} /> Trạng thái: <Tag color="green">{displayUser?.trangThai || 'Active'}</Tag></Text>
                            </Space>
                        </div>
                        <Button type="primary" icon={<EditOutlined />} block style={{ marginTop: '24px', borderRadius: '8px', height: '40px' }}>
                            Chỉnh sửa hồ sơ
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} lg={16}>
                    <Card title={<Text strong>Chi tiết tài khoản</Text>} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Họ và tên">{displayUser?.hoTen || displayUser?.name}</Descriptions.Item>
                            <Descriptions.Item label="Mã nhân viên">EMP-{displayUser?.id?.toString().padStart(3, '0')}</Descriptions.Item>
                            <Descriptions.Item label="Vai trò">{displayUser?.tenVaiTro || 'Nhân viên'}</Descriptions.Item>
                            <Descriptions.Item label="Phòng ban">{displayUser?.tenPhongBan || 'Phòng Hạ tầng IT'}</Descriptions.Item>
                            <Descriptions.Item label="Email công việc">{displayUser?.email}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái tài khoản">{displayUser?.trangThai || 'Active'}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
