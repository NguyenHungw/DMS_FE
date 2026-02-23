import React, { useState, useEffect, useCallback } from 'react';
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
    App,
    Tabs,
    Spin,
    Empty,
    Popconfirm
} from 'antd';
import {
    NotificationOutlined,
    PlusOutlined,
    UserOutlined,
    CalendarOutlined,
    TagOutlined,
    CommentOutlined,
    SendOutlined,
    ReloadOutlined,
    DeleteOutlined,
    PushpinOutlined,
    PushpinFilled
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import thongBaoApi from '../api/thongBaoApi';
import axiosClient from '../api/axiosInstance';
import '../styles/pages/InformationSharing.scss';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const InformationSharing = () => {
    const { message } = App.useApp();
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const data = await thongBaoApi.getAll();
            setAnnouncements(data || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            message.error('Không thể tải danh sách thông báo');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await axiosClient.get('/Lookup/chuyen-muc');
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    useEffect(() => {
        fetchAnnouncements();
        fetchCategories();
    }, [fetchAnnouncements, fetchCategories]);

    const getCategoryColor = (categoryName) => {
        const colors = {
            'Event': 'blue',
            'Policy': 'red',
            'News': 'purple',
            'Administrative': 'green',
            'Internal News': 'purple',
            'Tech Update': 'cyan'
        };
        return colors[categoryName] || 'blue';
    };

    const showDetail = async (item) => {
        setLoading(true);
        try {
            const detail = await thongBaoApi.getById(item.id);
            setSelectedNews(detail);
            setDetailVisible(true);
        } catch (error) {
            console.error('Error fetching announcement detail:', error);
            message.error('Không thể tải chi tiết thông báo');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim() || !selectedNews) return;

        setLoading(true);
        try {
            await thongBaoApi.postComment(selectedNews.id, commentText);
            message.success('Đã đăng bình luận thành công!');
            setCommentText('');
            // Refresh detail to show new comment
            const updatedDetail = await thongBaoApi.getById(selectedNews.id);
            setSelectedNews(updatedDetail);
        } catch (error) {
            console.error('Error posting comment:', error);
            message.error('Không thể đăng bình luận');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        setLoading(true);
        try {
            await thongBaoApi.deleteComment(commentId);
            message.success('Đã xóa bình luận thành công!');
            // Refresh detail
            const updatedDetail = await thongBaoApi.getById(selectedNews.id);
            setSelectedNews(updatedDetail);
        } catch (error) {
            console.error('Error deleting comment:', error);
            message.error('Không thể xóa bình luận');
        } finally {
            setLoading(false);
        }
    };

    const handlePostAnnouncement = async (values) => {
        try {
            setLoading(true);
            const payload = {
                tieuDe: values.title,
                noiDung: values.content,
                chuyenMucId: values.chuyenMucId,
                ngayDang: new Date().toISOString()
            };
            await thongBaoApi.create(payload);
            message.success('Đã đăng thông báo thành công!');
            setIsModalVisible(false);
            form.resetFields();
            fetchAnnouncements();
        } catch (error) {
            console.error('Error posting announcement:', error);
            message.error('Không thể đăng thông báo: ' + (error.message || 'Lỗi hệ thống'));
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePin = async (item, e) => {
        if (e) e.stopPropagation();
        try {
            setLoading(true);
            await thongBaoApi.togglePin(item.id, !item.isPinned);
            message.success(item.isPinned ? 'Đã bỏ ghim thông báo' : 'Đã ghim thông báo');
            fetchAnnouncements();
        } catch (error) {
            console.error('Error toggling pin:', error);
            message.error('Không thể cập nhật trạng thái ghim');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (!isAdmin) return;
        if (e) e.stopPropagation();
        try {
            setLoading(true);
            await thongBaoApi.delete(id);
            message.success('Đã xóa thông báo thành công!');
            fetchAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
            message.error('Không thể xóa thông báo: ' + (error.message || 'Lỗi hệ thống'));
        } finally {
            setLoading(false);
        }
    };

    const renderAnnouncementList = (category) => {
        const filtered = category === 'All'
            ? announcements
            : announcements.filter(a => a.tenChuyenMuc === category);

        if (loading && announcements.length === 0) {
            return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
        }

        return (
            <List
                grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
                dataSource={filtered}
                locale={{ emptyText: <Empty description="Không có thông báo nào" /> }}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            hoverable
                            className="announcement-card"
                            onClick={() => showDetail(item)}
                            title={
                                <Space>
                                    <Tag color={getCategoryColor(item.tenChuyenMuc)}>{item.tenChuyenMuc}</Tag>
                                    <Text strong>{item.tieuDe}</Text>
                                </Space>
                            }
                            extra={
                                isAdmin && (
                                    <Space>
                                        <Button
                                            type="text"
                                            icon={item.isPinned ? <PushpinFilled style={{ color: '#1890ff' }} /> : <PushpinOutlined />}
                                            onClick={(e) => handleTogglePin(item, e)}
                                        />
                                        <Popconfirm
                                            title="Xác nhận xóa thông báo?"
                                            description="Hành động này không thể hoàn tác."
                                            onConfirm={(e) => handleDelete(item.id, e)}
                                            onCancel={(e) => e.stopPropagation()}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Popconfirm>
                                    </Space>
                                )
                            }
                        >
                            <Paragraph ellipsis={{ rows: 3 }}>
                                {item.noiDung}
                            </Paragraph>
                            <Divider />
                            <div className="card-footer">
                                <Space>
                                    <Avatar size="small" icon={<UserOutlined />} />
                                    <Text type="secondary" className="author-info">{item.tenTacGia || 'Ẩn danh'}</Text>
                                </Space>
                                <Space>
                                    <CalendarOutlined />
                                    <Text type="secondary" className="date-info">{new Date(item.ngayDang).toLocaleDateString()}</Text>
                                </Space>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        );
    };

    const pinnedNews = announcements.find(a => a.isPinned);

    return (
        <div className="sharing-container">
            <div className="sharing-header">
                <Title level={3}>Information Sharing</Title>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchAnnouncements} loading={loading}>
                        Refresh
                    </Button>
                    {isAdmin && (
                        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalVisible(true)}>
                            New Announcement
                        </Button>
                    )}
                </Space>
            </div>

            {pinnedNews && (
                <div className="pinned-section">
                    <Title level={4}>📌 Pinned Announcement</Title>
                    <Card
                        className="pinned-card"
                        hoverable
                        onClick={() => showDetail(pinnedNews)}
                        extra={
                            isAdmin && (
                                <Space>
                                    <Button
                                        type="text"
                                        icon={<PushpinFilled style={{ color: '#1890ff' }} />}
                                        onClick={(e) => handleTogglePin(pinnedNews, e)}
                                    />
                                    <Popconfirm
                                        title="Xác nhận xóa thông báo?"
                                        description="Hành động này không thể hoàn tác."
                                        onConfirm={(e) => handleDelete(pinnedNews.id, e)}
                                        onCancel={(e) => e.stopPropagation()}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                    >
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </Popconfirm>
                                </Space>
                            )
                        }
                    >
                        <Space align="start">
                            <Avatar size="large" icon={<NotificationOutlined />} style={{ backgroundColor: '#1890ff' }} />
                            <div>
                                <span className="pinned-label">IMPORTANT</span>
                                <Title level={5} style={{ display: 'inline', margin: 0 }}>{pinnedNews.tieuDe}</Title>
                                <Paragraph style={{ marginTop: 8 }} ellipsis={{ rows: 2 }}>
                                    {pinnedNews.noiDung}
                                </Paragraph>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Posted by {pinnedNews.tenTacGia || 'Ẩn danh'} • {new Date(pinnedNews.ngayDang).toLocaleDateString()}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </div>
            )}

            <Tabs
                defaultActiveKey="All"
                items={[
                    { key: 'All', label: 'All Updates', children: renderAnnouncementList('All') },
                    ...categories.map(cat => ({
                        key: cat.tenChuyenMuc,
                        label: cat.tenChuyenMuc,
                        children: renderAnnouncementList(cat.tenChuyenMuc)
                    }))
                ]}
                className="sharing-tabs"
            />

            <Modal
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '24px' }}>
                        <span>{selectedNews?.tieuDe}</span>
                        {(isAdmin && selectedNews) && (
                            <Popconfirm
                                title="Xác nhận xóa thông báo này?"
                                onConfirm={() => {
                                    handleDelete(selectedNews.id);
                                    setDetailVisible(false);
                                }}
                                okText="Xóa"
                                cancelText="Hủy"
                            >
                                <Button type="primary" danger icon={<DeleteOutlined />}>
                                    Delete Announcement
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                }
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={800}
                className="announcement-detail-modal"
            >
                {selectedNews && (
                    <div className="announcement-detail-content">
                        <Space style={{ marginBottom: 16 }}>
                            <Tag color={getCategoryColor(selectedNews.tenChuyenMuc)}>{selectedNews.tenChuyenMuc}</Tag>
                            <Text type="secondary"><CalendarOutlined /> {new Date(selectedNews.ngayDang).toLocaleString()}</Text>
                            <Text type="secondary"><UserOutlined /> {selectedNews.tenTacGia || 'Ẩn danh'}</Text>
                        </Space>
                        <Title level={4}>{selectedNews.tieuDe}</Title>
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                            {selectedNews.noiDung}
                        </Paragraph>

                        <Divider />

                        <div className="comment-section">
                            <Title level={5}><CommentOutlined /> Comments ({selectedNews.danhSachBinhLuan?.length || 0})</Title>
                            <div className="comment-list">
                                {selectedNews.danhSachBinhLuan && selectedNews.danhSachBinhLuan.length > 0 ? (
                                    selectedNews.danhSachBinhLuan.map((c, i) => (
                                        <div key={i} style={{ marginBottom: 16, padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                                            <Space align="start">
                                                <Avatar icon={<UserOutlined />} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Space direction="vertical" size={2}>
                                                            <Text strong>{c.tenNguoiDung}</Text>
                                                            <Text type="secondary" style={{ fontSize: '11px' }}>{c.thoiGian}</Text>
                                                        </Space>
                                                        <Popconfirm
                                                            title="Xóa bình luận này?"
                                                            onConfirm={() => handleDeleteComment(c.id)}
                                                            okText="Xóa"
                                                            cancelText="Hủy"
                                                        >
                                                            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                                        </Popconfirm>
                                                    </div>
                                                    <div style={{ marginTop: 6, fontSize: '14px', color: '#434343', lineHeight: '1.5' }}>
                                                        {c.noiDung}
                                                    </div>
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
                <Form
                    form={form}
                    className="announcement-modal-form"
                    layout="vertical"
                    onFinish={handlePostAnnouncement}
                >
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                        <Input placeholder="Enter title" />
                    </Form.Item>
                    <Form.Item label="Category" name="chuyenMucId" rules={[{ required: true, message: 'Vui lòng chọn chuyên mục' }]}>
                        <Select placeholder="Select category">
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.tenChuyenMuc}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Content" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                        <Input.TextArea rows={6} placeholder="Write your announcement here..." />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="submit-button" size="large" loading={loading}>
                            Post Announcement
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InformationSharing;
