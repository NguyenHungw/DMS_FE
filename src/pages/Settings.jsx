import React from 'react';
import { Card, Typography, Switch, List, Divider, Button, message, Select } from 'antd';
import { BellOutlined, LockOutlined, GlobalOutlined, BgColorsOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../features/uiSlice';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.ui);
    const { t, i18n } = useTranslation();

    const changeLanguage = (value) => {
        i18n.changeLanguage(value);
        message.success(`Language changed to ${value === 'en' ? 'English' : 'Tiếng Việt'}`);
    };

    const settingsData = [
        {
            title: 'Email Notifications',
            description: 'Receive announcements and document updates via email.',
            icon: <BellOutlined />,
            action: <Switch defaultChecked />
        },
        {
            title: 'Two-Factor Authentication',
            description: 'Enhance your account security with 2FA.',
            icon: <LockOutlined />,
            action: <Button size="small">Configure</Button>
        },
        {
            title: t('dark_mode'),
            description: 'Synchronize theme with system preferences.',
            icon: <BgColorsOutlined />,
            action: <Switch checked={darkMode} onChange={() => dispatch(toggleDarkMode())} />
        },
        {
            title: t('language'),
            description: 'Set your preferred interface language.',
            icon: <GlobalOutlined />,
            action: (
                <Select defaultValue={i18n.language} style={{ width: 120 }} onChange={changeLanguage}>
                    <Option value="en">English</Option>
                    <Option value="vi">Tiếng Việt</Option>
                </Select>
            )
        }
    ];

    return (
        <div className="settings-container" style={{ padding: '24px' }}>
            <Title level={3}>{t('settings_title')}</Title>
            <Card style={{ borderRadius: '12px' }}>
                <List
                    itemLayout="horizontal"
                    dataSource={settingsData}
                    renderItem={(item) => (
                        <List.Item actions={[item.action]}>
                            <List.Item.Meta
                                avatar={<div style={{ fontSize: '20px', padding: '8px', background: darkMode ? '#303030' : '#f0f2f5', borderRadius: '50%' }}>{item.icon}</div>}
                                title={item.title}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
                <Divider />
                <Button type="primary" onClick={() => message.success('Settings saved successfully!')}>
                    {t('save_changes')}
                </Button>
            </Card>
        </div>
    );
};

export default Settings;
