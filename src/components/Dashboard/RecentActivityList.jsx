import React from 'react';
import { Card, List, Avatar, Typography } from 'antd';
import { ClockCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tag } from 'antd';

const { Text } = Typography;

const RecentActivityList = () => {
    const { recentActivities, loading } = useSelector((state) => state.dashboard);
    const { t } = useTranslation();

    const getStatusTag = (action) => {
        if (action.includes('Upload') || action.includes('Created')) return <Tag color="blue">Mới</Tag>;
        if (action.includes('Delete')) return <Tag color="error">Đã xóa</Tag>;
        if (action.includes('Update')) return <Tag color="warning">Cập nhật</Tag>;
        return <Tag color="default">Thông tin</Tag>;
    };

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span><ThunderboltOutlined style={{ marginRight: 8, color: '#faad14' }} />{t('recent_activities')}</span>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal' }}>{t('live_stream')}</Text>
                </div>
            }
            bordered={false}
            className="activity-card"
        >
            <List
                itemLayout="horizontal"
                dataSource={recentActivities}
                loading={loading}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    style={{
                                        backgroundColor: '#e6f7ff',
                                        color: '#1890ff',
                                        boxShadow: '0 4px 6px rgba(15, 23, 42, 0.05)'
                                    }}
                                >
                                    {item.user?.[0] || 'S'}
                                </Avatar>
                            }
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Text className="activity-user">{item.user}</Text>
                                    {getStatusTag(item.hanhDong)}
                                </div>
                            }
                            description={
                                <span>
                                    {item.hanhDong} <Text type="link" strong style={{ color: '#1d4ed8' }}>{item.target}</Text>
                                </span>
                            }
                        />
                        <div className="activity-time">
                            <ClockCircleOutlined style={{ fontSize: '12px' }} />
                            {item.time}
                        </div>
                    </List.Item>
                )}
            />
            {recentActivities.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">{t('no_activities')}</Text>
                </div>
            )}
        </Card>
    );
};

export default RecentActivityList;
