import React from 'react';
import { Card, Descriptions, Avatar, Typography, Tag, Divider, Row, Col, Button, Space } from 'antd';
import { UserOutlined, MailOutlined, BankOutlined, SecurityScanOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    console.log('check user', user)

    return (
        <div className="profile-container" style={{ padding: '24px' }}>
            <Row gutter={24}>
                <Col xs={24} lg={8}>
                    <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
                        <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '16px' }} />
                        <Title level={3}>{user?.name || 'Administrator'}</Title>
                        <Tag color="volcano" style={{ marginBottom: '16px' }}>SUPER ADMIN</Tag>
                        <Divider />
                        <div style={{ textAlign: 'left' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Text><MailOutlined /> {user?.email || 'admin@company.com'}</Text>
                                <Text><BankOutlined /> IT Infrastructure Dept</Text>
                                <Text><SecurityScanOutlined /> Last logged in: 2026-02-07 20:10</Text>
                            </Space>
                        </div>
                        <Button type="primary" icon={<EditOutlined />} block style={{ marginTop: '24px' }}>Edit Profile</Button>
                    </Card>
                </Col>
                <Col xs={24} lg={16}>
                    <Card title="Account Details" style={{ borderRadius: '12px' }}>
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Full Name">{user?.name || 'Administrator'}</Descriptions.Item>
                            <Descriptions.Item label="Employee ID">EMP-2026-001</Descriptions.Item>
                            <Descriptions.Item label="Position">Senior System Administrator</Descriptions.Item>
                            <Descriptions.Item label="Join Date">2024-01-15</Descriptions.Item>
                            <Descriptions.Item label="Work Email">{user?.email || 'admin@company.com'}</Descriptions.Item>
                            <Descriptions.Item label="Direct Manager">Nguyen Hoang Son (CTO)</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
