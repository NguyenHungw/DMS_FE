import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Space, Input, Badge, message, Divider } from 'antd';
import {
    FileTextOutlined,
    TeamOutlined,
    UserOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    NotificationOutlined,
    BellOutlined,
    SearchOutlined,
    SettingOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { useTranslation } from 'react-i18next';
import '../styles/layouts/MainLayout.scss';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
    const { t } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/documents',
            icon: <FileTextOutlined />,
            label: t('doc_mgmt'),
        },
        // {
        //     key: '/chat',
        //     icon: <MessageOutlined />,
        //     label: t('internal_chat'),
        // },
        {
            key: '/sharing',
            icon: <NotificationOutlined />,
            label: 'Information Sharing',
        },
        {
            key: '/users',
            icon: <TeamOutlined />,
            label: t('user_mgmt'),
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: t('settings_title'),
        },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const userMenu = {
        items: [
            {
                key: '/profile',
                label: t('profile'),
                icon: <UserOutlined />,
                onClick: () => navigate('/profile'),
            },
            {
                key: 'logout',
                label: t('logout'),
                icon: <LogoutOutlined />,
                onClick: handleLogout,
            },
        ],
    };

    const findLabel = (key) => {
        const item = menuItems.find((i) => i.key === key);
        return item ? item.label : 'Home';
    };

    return (
        <Layout className="cms-layout">
            <Header className="cms-header">
                <div className="header-left">
                    <div className="cms-logo-horizontal">
                        {/* <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} /> */}
                        <span className="logo-text">CMS SYSTEM</span>
                    </div>
                </div>
                <div className="header-center">
                    <div className="header-search">
                        <Input
                            placeholder="Global searching..."
                            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
                            allowClear
                        />
                    </div>
                </div>
                <div className="header-right">
                    <Space size={20}>
                        <Badge count={5} size="small">
                            <BellOutlined className="header-icon" onClick={() => message.info('You have 5 notifications')} />
                        </Badge>
                        <SettingOutlined className="header-icon" onClick={() => navigate('/settings')} />
                        <Divider type="vertical" />
                        <Dropdown menu={userMenu} placement="bottomRight">
                            <Space className="user-profile">
                                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                                <span className="user-name">{user?.name || 'Administrator'}</span>
                            </Space>
                        </Dropdown>
                    </Space>
                </div>
            </Header>
            <Layout hasSider className="cms-main-layout">
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    breakpoint="lg"
                    className="cms-sider"
                    theme="light"
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={({ key }) => navigate(key)}
                        className="cms-menu"
                    />
                </Sider>
                <Layout className="cms-content-layout">
                    <Content className="cms-content">
                        <Breadcrumb className="cms-breadcrumb">
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>{findLabel(location.pathname)}</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="cms-page-container">
                            <Outlet />
                        </div>
                    </Content>
                    {/* <Footer className="cms-footer">
                        Internal CMS System ©2026 Developed with React & Ant Design
                    </Footer> */}
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
