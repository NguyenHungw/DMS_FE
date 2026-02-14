import React from 'react';
import { Card, Typography } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const { Text } = Typography;

const storageData = [
    { name: 'Documents', value: 45.2 },
    { name: 'Media', value: 20.1 },
    { name: 'Other', value: 10.2 },
    { name: 'System', value: 24.5 },
];

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d'];

const StorageAllocationChart = () => {
    return (
        <Card
            title={<span><PieChartOutlined style={{ marginRight: 8 }} />Storage Allocation</span>}
            bordered={false}
            className="storage-card"
        >
            <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={storageData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {storageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Text strong>Total Used: 75.5 GB</Text> / <Text type="secondary">100 GB</Text>
            </div>
        </Card>
    );
};

export default StorageAllocationChart;
