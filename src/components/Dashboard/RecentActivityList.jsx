import React from 'react';
import { Card, List, Avatar, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const RecentActivityList = () => {
    const { recentActivities, loading } = useSelector((state) => state.dashboard);

    return (
        <Card
            title={<span><ClockCircleOutlined style={{ marginRight: 8 }} />Recent System Activities</span>}
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
                            avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.user?.[0] || 'S'}</Avatar>}
                            title={<Text className="activity-user" strong>{item.user}</Text>}
                            description={
                                <span>
                                    {item.hanhDong} <Text type="primary" strong>{item.target}</Text>
                                </span>
                            }
                        />
                        <div><Text type="secondary" className="activity-time">{item.time}</Text></div>
                    </List.Item>
                )}
            />
            {recentActivities.length === 0 && !loading && <Text type="secondary">No activities records accessible or found.</Text>}
        </Card>
    );
};

export default RecentActivityList;
