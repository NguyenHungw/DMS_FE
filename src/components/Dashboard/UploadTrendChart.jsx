import React from 'react';
import { Card } from 'antd';
import { AreaChartOutlined } from '@ant-design/icons';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const chartData = [
    { month: 'Jan', uploads: 45 },
    { month: 'Feb', uploads: 52 },
    { month: 'Mar', uploads: 48 },
    { month: 'Apr', uploads: 70 },
    { month: 'May', uploads: 61 },
    { month: 'Jun', uploads: 85 },
];

const UploadTrendChart = () => {
    return (
        <Card
            title={<span><AreaChartOutlined style={{ marginRight: 8 }} />Document Upload Trends</span>}
            bordered={false}
            className="chart-card"
        >
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1890ff" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="uploads"
                            stroke="#1890ff"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorUploads)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default UploadTrendChart;
