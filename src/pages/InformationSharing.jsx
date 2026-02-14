import React, { useState } from 'react';
import {
    List,
    Card,
    Tag,
    Button,
    Typography,
    Avatar,
    Space,
    Divider,
    Modal,
    Form,
    Input,
    Select,
    message,
    Tabs
} from 'antd';
import {
    NotificationOutlined,
    PlusOutlined,
    UserOutlined,
    CalendarOutlined,
    TagOutlined,
    CommentOutlined,
    SendOutlined
} from '@ant-design/icons';
import '../styles/pages/InformationSharing.scss';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const InformationSharing = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [commentText, setCommentText] = useState('');

    const announcements = [
        {
            id: 1,
            title: 'Company Picnic 2026 - Registration Open',
            content: 'We are excited to announce our annual company picnic! Please register by the end of this week to join us for a day of fun and team building at Central Park. There will be food, games, and music for everyone. Families are welcome!',
            author: 'HR Department',
            date: '2026-02-07',
            category: 'Event',
            color: 'blue',
            comments: [
                { author: 'Nguyen Van A', content: 'Can we bring pets too?', time: '2 hours ago' },
                { author: 'Admin', content: 'Yes, Central Park is pet-friendly!', time: '1 hour ago' }
            ]
        },
        {
            id: 2,
            title: 'New Security Protocols for Document Sharing',
            content: 'Starting next Monday, all sensitive documents must be encrypted and shared only through the internal CMS system using the new "Secure" tag. Please attend the training session on Friday at 2 PM.',
            author: 'IT Security',
            date: '2026-02-05',
            category: 'Policy',
            color: 'red',
            comments: []
        },
        {
            id: 3,
            title: 'Q4 Performance Review Schedule',
            content: 'The review cycle for Q4 will begin on February 15th. Please ensure all self-assessments are submitted by the 12th. Managers will schedule individual meetings through the portal.',
            author: 'Management',
            date: '2026-02-01',
            category: 'Administrative',
            color: 'green',
            comments: [
                { author: 'Le Van C', content: 'Where can I find the self-assessment template?', time: '3 days ago' }
            ]
        },
        {
            id: 4,
            title: 'Welcome New Team Members!',
            content: 'Please join us in welcoming our three new engineers joining the IT department this week. We will have a welcome coffee in the breakroom tomorrow at 10 AM.',
            author: 'HR Department',
            date: '2026-02-08',
            category: 'News',
            color: 'purple',
            comments: []
        }
    ];

    const showDetail = (item) => {
        setSelectedNews(item);
        setDetailVisible(true);
    };

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        message.success('Comment posted successfully!');
        setCommentText('');
    };

    const renderAnnouncementList = (category) => {
        const filtered = category === 'All'
            ? announcements
            : announcements.filter(a => a.category === category || (category === 'News' && a.category === 'Administrative'));

        return (
            <List
                grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
                dataSource={filtered}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            hoverable
                            className="announcement-card"
                            onClick={() => showDetail(item)}
                            title={
                                <Space>
                                    <Tag color={item.color}>{item.category}</Tag>
                                    <Text strong>{item.title}</Text>
                                </Space>
                            }
                        >
                            <Paragraph ellipsis={{ rows: 3 }}>
                                {item.content}
                            </Paragraph>
                            <Divider />
                            <div className="card-footer">
                                <Space>
                                    <Avatar size="small" icon={<UserOutlined />} />
                                    <Text type="secondary" className="author-info">{item.author}</Text>
                                </Space>
                                <Space>
                                    <CommentOutlined />
                                    <Text type="secondary" className="date-info">{item.comments.length} Comments</Text>
                                </Space>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        );
    };

    const tabItems = [
        { key: 'All', label: 'All Updates', children: renderAnnouncementList('All') },
        { key: 'Policy', label: 'Policies', children: renderAnnouncementList('Policy') },
        { key: 'Event', label: 'Events', children: renderAnnouncementList('Event') },
        { key: 'News', label: 'Company News', children: renderAnnouncementList('News') },
    ];

    const pinnedNews = announcements.find(a => a.id === 2); // Example pinned news

    return (
        <div className="sharing-container">
            <div className="sharing-header">
                <Title level={3}>Information Sharing</Title>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalVisible(true)}>
                    New Announcement
                </Button>
            </div>

            {pinnedNews && (
                <div className="pinned-section">
                    <Title level={4}>📌 Pinned Announcement</Title>
                    <Card
                        className="pinned-card"
                        hoverable
                        onClick={() => showDetail(pinnedNews)}
                    >
                        <Space align="start">
                            <Avatar size="large" icon={<NotificationOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            <div>
                                <span className="pinned-label">IMPORTANT</span>
                                <Title level={5} style={{ display: 'inline', margin: 0 }}>{pinnedNews.title}</Title>
                                <Paragraph style={{ marginTop: 8 }} ellipsis={{ rows: 2 }}>
                                    {pinnedNews.content}
                                </Paragraph>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Posted by {pinnedNews.author} • {pinnedNews.date}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </div>
            )}

            <Tabs defaultActiveKey="All" items={tabItems} className="sharing-tabs" />

            <Modal
                title={selectedNews?.title}
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={800}
                className="announcement-detail-modal"
            >
                {selectedNews && (
                    <div className="announcement-detail-content">
                        <Space style={{ marginBottom: 16 }}>
                            <Tag color={selectedNews.color}>{selectedNews.category}</Tag>
                            <Text type="secondary"><CalendarOutlined /> {selectedNews.date}</Text>
                            <Text type="secondary"><UserOutlined /> {selectedNews.author}</Text>
                        </Space>
                        <Title level={4}>{selectedNews.title}</Title>
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                            {selectedNews.content}
                        </Paragraph>

                        <Divider />

                        <div className="comment-section">
                            <Title level={5}><CommentOutlined /> Comments ({selectedNews.comments.length})</Title>
                            <div className="comment-list">
                                {selectedNews.comments.length > 0 ? (
                                    selectedNews.comments.map((c, i) => (
                                        <div key={i} style={{ marginBottom: 16, padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                                            <Space align="start">
                                                <Avatar icon={<UserOutlined />} />
                                                <div>
                                                    <Text strong>{c.author}</Text> <Text type="secondary" style={{ fontSize: '12px' }}>{c.time}</Text>
                                                    <div style={{ marginTop: 4 }}>{c.content}</div>
                                                </div>
                                            </Space>
                                        </div>
                                    ))
                                ) : (
                                    <Text type="secondary">No comments yet. Be the first to comment!</Text>
                                )}
                            </div>

                            <div className="comment-input-area">
                                <Avatar icon={<UserOutlined />} />
                                <Input.TextArea
                                    rows={2}
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={handleAddComment}
                                    style={{ height: '54px' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title="Post New Announcement"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form className="announcement-modal-form" layout="vertical" onFinish={() => { message.success('Announcement posted!'); setIsModalVisible(false); }}>
                    <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                        <Input placeholder="Enter title" />
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                        <Select placeholder="Select category">
                            <Option value="event">Event</Option>
                            <Option value="policy">Policy</Option>
                            <Option value="news">Internal News</Option>
                            <Option value="tech">Tech Update</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Content" name="content" rules={[{ required: true }]}>
                        <Input.TextArea rows={6} placeholder="Write your announcement here..." />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="submit-button" size="large">
                            Post Announcement
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InformationSharing;
