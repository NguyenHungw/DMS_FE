import React from 'react';
import { Row, Col, Card, Statistic, Typography, Tag } from 'antd';
import {
    FileTextOutlined,
    NotificationOutlined,
    UserOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const StatCards = () => {
    const { t } = useTranslation();
    const { stats, loading } = useSelector((state) => state.dashboard);

    const statItems = [
        {
            title: t('total_docs'),
            value: stats.totalDocs,
            icon: <FileTextOutlined />,
            color: '#1890ff',
            trend: '+0%'
        },
        {
            title: t('info_shares'),
            value: stats.infoShares,
            icon: <NotificationOutlined />,
            color: '#52c41a',
            trend: '+0%'
        },
        {
            title: t('active_users'),
            value: stats.activeUsers,
            icon: <UserOutlined />,
            color: '#722ed1',
            trend: '+0%'
        },
    ];

    return (
        <Row gutter={[24, 24]}>
            {statItems.map((item, index) => (
                <Col xs={24} sm={8} key={index}>
                    <Card bordered={false} hoverable className="stat-card" loading={loading}>
                        <Statistic
                            title={<Text type="secondary" strong>{item.title}</Text>}
                            value={item.value}
                            prefix={React.cloneElement(item.icon, { style: { color: item.color, marginRight: 8, fontSize: '24px' } })}
                            valueStyle={{ color: '#262626', fontWeight: '800', fontSize: '28px' }}
                        />
                        <div className="stat-trend">
                            <Tag color="green" icon={<ArrowUpOutlined />} style={{ borderRadius: '4px', border: 'none' }}>{item.trend}</Tag>
                            <Text type="secondary" className="trend-text"> vs. last month</Text>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatCards;
