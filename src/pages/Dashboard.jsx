import React, { useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
const { Title, Text } = Typography;
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../features/dashboardSlice';
import StatCards from '../components/Dashboard/StatCards';
import QuickActionCenter from '../components/Dashboard/QuickActionCenter';
import PendingApprovals from '../components/Dashboard/PendingApprovals';
import RecentActivityList from '../components/Dashboard/RecentActivityList';
import MyRecentDocuments from '../components/Dashboard/MyRecentDocuments';
import '../styles/pages/Dashboard.scss';

const Dashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Chào buổi sáng';
        if (hour < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-modern">
                <div className="welcome-section">
                    <Title level={2} className="greeting-text">
                        {getGreeting()}, <span className="user-name-highlight">{user?.name || 'Thành viên'}</span>
                    </Title>
                    <Text className="dashboard-subtitle-modern">
                        {isAdmin ? t('dashboard_subtitle') : 'Hôm nay bạn có tài liệu nào cần xử lý không?'}
                    </Text>
                </div>
                <div className="header-decoration">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </div>

            <div className="stats-wrapper">
                <StatCards />
            </div>

            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24} lg={16}>
                    <QuickActionCenter />
                    <div style={{ marginTop: 32 }}>
                        {isAdmin ? <RecentActivityList /> : <MyRecentDocuments />}
                    </div>
                </Col>

                <Col xs={24} lg={8}>
                    {isAdmin ? <PendingApprovals /> : <RecentActivityList />}
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
