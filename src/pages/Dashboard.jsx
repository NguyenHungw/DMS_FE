import React, { useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchDashboardData } from '../features/dashboardSlice';
import StatCards from '../components/Dashboard/StatCards';
import UploadTrendChart from '../components/Dashboard/UploadTrendChart';
import StorageAllocationChart from '../components/Dashboard/StorageAllocationChart';
import RecentActivityList from '../components/Dashboard/RecentActivityList';
import '../styles/pages/Dashboard.scss';

const { Title } = Typography;

const Dashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    return (
        <div className="dashboard-container">
            <Title level={3} className="dashboard-title">{t('dashboard_title')}</Title>

            <StatCards />

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={16}>
                    <UploadTrendChart />
                </Col>

                <Col xs={24} lg={8}>
                    <StorageAllocationChart />
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} lg={24}>
                    <RecentActivityList />
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
