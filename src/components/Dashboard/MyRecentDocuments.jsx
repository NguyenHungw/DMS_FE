import React from 'react';
import { Card, List, Typography, Tag, Button, Space } from 'antd';
import { FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const MyRecentDocuments = () => {
    const { userDocs, loading } = useSelector((state) => state.dashboard);
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'green';
            case 'pendingapproval': return 'orange';
            case 'draft': return 'default';
            case 'circulating': return 'blue';
            default: return 'default';
        }
    };

    return (
        <Card
            title={
                <span><FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />Tài liệu của tôi</span>
            }
            bordered={false}
            className="recent-docs-card"
            extra={<Button type="link" onClick={() => navigate('/documents')}>Xem tất cả</Button>}
        >
            <List
                itemLayout="horizontal"
                dataSource={userDocs}
                loading={loading}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button
                                type="text"
                                icon={<EyeOutlined />}
                                onClick={() => navigate(`/documents/${item.id}`)}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            title={<Text strong>{item.tenTaiLieu}</Text>}
                            description={
                                <Space>
                                    <Tag color={getStatusColor(item.trangThai)}>
                                        {(item.trangThai || 'Draft').toUpperCase()}
                                    </Tag>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        {new Date(item.ngayTao).toLocaleDateString()}
                                    </Text>
                                </Space>
                            }
                        />
                    </List.Item>
                )}
            />
            {userDocs.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">Bạn chưa có tài liệu nào.</Text>
                </div>
            )}
        </Card>
    );
};

export default MyRecentDocuments;
