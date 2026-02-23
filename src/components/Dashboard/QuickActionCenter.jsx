import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
    CloudUploadOutlined,
    UserAddOutlined,
    ShareAltOutlined,
    FileProtectOutlined,
    FolderAddOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined // Added ThunderboltOutlined
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const QuickActionCenter = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';

    const allActions = [
        { title: t('documents'), icon: <FileProtectOutlined />, color: '#1d4ed8', bg: '#eff6ff', path: '/documents' },
        { title: t('information_sharing'), icon: <ShareAltOutlined />, color: '#15803d', bg: '#f0fdf4', path: '/sharing' },
        { title: t('user_management'), icon: <UserAddOutlined />, color: '#b45309', bg: '#fffbeb', path: '/users', adminOnly: true },
        { title: t('perms_mgmt'), icon: <SafetyCertificateOutlined />, color: '#7e22ce', bg: '#faf5ff', path: '/permissions', adminOnly: true },
        { title: t('internal_chat'), icon: <ThunderboltOutlined />, color: '#be185d', bg: '#fff1f2', path: '/chat' },
        { title: t('settings'), icon: <CloudUploadOutlined />, color: '#0369a1', bg: '#f0f9ff', path: '/settings', adminOnly: true },
    ];

    const actions = allActions.filter(action => !action.adminOnly || isAdmin);

    return (
        <Card
            title={<span><Text strong>{t('quick_actions') || 'Quick Actions'}</Text></span>}
            bordered={false}
            className="action-card"
        >
            <Row gutter={[16, 16]}>
                {actions.map((action, index) => (
                    <Col xs={12} sm={8} key={index}>
                        <div
                            className="action-button-item"
                            onClick={() => action.path && navigate(action.path)}
                        >
                            <div
                                className="action-icon-circle"
                                style={{ backgroundColor: action.bg, color: action.color }}
                            >
                                {action.icon}
                            </div>
                            <Text strong className="action-label">{action.title}</Text>
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default QuickActionCenter;
