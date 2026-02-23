import React from 'react';
import { Card, List, Tag, Typography, Button, Space, Progress } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const PendingApprovals = () => {
    const { pendingApprovals, loading } = useSelector((state) => state.dashboard);
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Space direction="vertical" style={{ width: '100%' }} size={24}>
            <Card
                title={
                    <Space>
                        <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                        <Text strong>{t('requiring_attention')}</Text>
                        <Tag color="orange" style={{ borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>{pendingApprovals.length}</Tag>
                    </Space>
                }
                extra={<Button type="link" size="small" style={{ fontWeight: '600' }} onClick={() => navigate('/documents')}>{t('view_all')}</Button>}
                bordered={false}
                className="pending-card"
                loading={loading}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={pendingApprovals}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<Button type="primary" ghost size="small" style={{ borderRadius: '8px' }} onClick={() => navigate('/documents')}>{t('handle')}</Button>]}
                        >
                            <List.Item.Meta
                                title={<Text strong>{item.tenTaiLieu}</Text>}
                                description={
                                    <Space split={<span style={{ color: '#e2e8f0' }}>|</span>} wrap>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.tenChuSoHuu || 'Chủ sở hữu'}</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.ngayTao ? new Date(item.ngayTao).toLocaleDateString() : 'N/A'}</Text>
                                        <Tag size="small" color="blue" style={{ border: 'none', borderRadius: '4px' }}>Chờ duyệt</Tag>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
                {pendingApprovals.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Text type="secondary">{t('all_clear')}</Text>
                    </div>
                )}
            </Card>

            <Card bordered={false} className="usage-card glass-card">
                <Text strong>{t('storage_usage')}</Text>
                <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{t('total_used')}: 75.5 GB / 100 GB</Text>
                        <Text strong style={{ color: '#1d4ed8' }}>75%</Text>
                    </div>
                    <Progress
                        percent={75.5}
                        showInfo={false}
                        strokeColor={{
                            '0%': '#3b82f6',
                            '100%': '#8b5cf6',
                        }}
                        trailStyle={{ backgroundColor: '#f1f5f9' }}
                        strokeWidth={10}
                    />
                </div>
            </Card>
        </Space>
    );
};

export default PendingApprovals;
