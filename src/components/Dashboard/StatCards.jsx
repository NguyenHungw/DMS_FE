import React from 'react';
import { Row, Col, Card, Statistic, Typography, Tag } from 'antd';
import {
    FileTextOutlined,
    NotificationOutlined,
    UserOutlined,
    ArrowUpOutlined,
    BellOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const StatCards = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { stats, loading } = useSelector((state) => state.dashboard);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';

    const adminStats = [
        {
            title: t('total_docs'),
            value: stats.totalDocs,
            icon: <FileTextOutlined />,
            class: 'stat-primary',
            trend: '+12%',
            trendLabel: 'so với tháng trước',
            path: '/documents'
        },
        {
            title: t('info_shares'),
            value: stats.infoShares,
            icon: <NotificationOutlined />,
            class: 'stat-success',
            trend: '+5%',
            trendLabel: 'so với tháng trước',
            path: '/sharing'
        },
        {
            title: t('active_users'),
            value: stats.activeUsers,
            icon: <UserOutlined />,
            class: 'stat-purple',
            trend: '+2%',
            trendLabel: 'so với tháng trước',
            path: '/users'
        },
    ];

    const userStats = [
        {
            title: 'Tài liệu của tôi',
            value: stats.userDocsCount || 0,
            icon: <FileTextOutlined />,
            class: 'stat-primary',
            trend: 'Mới',
            trendLabel: 'vừa cập nhật',
            path: '/documents'
        },
        {
            title: 'Chia sẻ mới',
            value: stats.newSharesCount || 0,
            icon: <NotificationOutlined />,
            class: 'stat-success',
            trend: 'Hot',
            trendLabel: 'trong 24h qua',
            path: '/sharing'
        },
        {
            title: 'Thông báo',
            value: stats.newSharesCount || 0,
            icon: <BellOutlined />,
            class: 'stat-purple',
            trend: stats.newSharesCount > 0 ? `+${stats.newSharesCount}` : '0',
            trendLabel: 'tin chưa đọc',
            path: '/sharing'
        },
    ];

    const statItems = isAdmin ? adminStats : userStats;

    return (
        <Row gutter={[24, 24]}>
            {statItems.map((item, index) => (
                <Col xs={24} sm={8} key={index}>
                    <Card
                        bordered={false}
                        className={`stat-card ${item.class}`}
                        loading={loading}
                        onClick={() => item.path && navigate(item.path)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="stat-icon-wrapper">
                            {item.icon}
                        </div>
                        <Statistic
                            title={item.title}
                            value={item.value}
                            valueStyle={{ color: '#0f172a', fontWeight: '800' }}
                        />
                        <div className="stat-trend">
                            <Tag color={item.trend.startsWith('+') ? 'green' : 'red'}>
                                {item.trend}
                            </Tag>
                            <Text type="secondary" className="trend-text">{item.trendLabel}</Text>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatCards;
