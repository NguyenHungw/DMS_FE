import React, { useState, useEffect, useRef } from 'react';
import { Layout, List, Avatar, Input, Button, Card, Typography, Space, Badge, Divider, Result } from 'antd';
import { SendOutlined, UserOutlined, SmileOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import '../styles/pages/InternalChat.scss';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const InternalChat = () => {
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Nguyen Van A', text: 'Hi everyone, did you see the new policy update?', time: '10:05 AM', isMe: false },
        { id: 2, sender: 'Administrator', text: 'Yes, it is pinned in the Information Sharing section.', time: '10:08 AM', isMe: true },
        { id: 3, sender: 'Tran Thi B', text: 'Thanks! I will check it out now.', time: '10:10 AM', isMe: false },
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMessage = {
            id: Date.now(),
            sender: user?.name || 'Administrator',
            text: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };
        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    const contacts = [
        { id: 1, name: 'General Chat', lastMsg: 'Tran Thi B: Thanks!', online: true, isGroup: true },
        { id: 2, name: 'Nguyen Van A', lastMsg: 'See you later!', online: true },
        { id: 3, name: 'Tran Thi B', lastMsg: 'I have some questions...', online: false },
        { id: 4, name: 'Le Van C', lastMsg: 'Document attached.', online: true },
    ];

    return (
        <div className="chat-container">
            <div className="chat-under-construction">
                <Result
                    status="info"
                    title="Tính năng đang được phát triển"
                    subTitle="Trò chuyện nội bộ sẽ sớm ra mắt để giúp đội ngũ kết nối nhanh chóng hơn. Cảm ơn bạn đã kiên nhẫn!"
                    extra={
                        <Button type="primary" onClick={() => window.history.back()}>
                            Quay lại trang chủ
                        </Button>
                    }
                />
            </div>
            <Layout className="chat-layout">
                <Sider width={280} theme="light" className="chat-sider">
                    <div className="chat-sider-header">
                        <Title level={4}>Messages</Title>
                    </div>
                    <List
                        className="contact-list"
                        itemLayout="horizontal"
                        dataSource={contacts}
                        renderItem={(item) => (
                            <List.Item className={`contact-item ${item.id === 1 ? 'active' : ''}`}>
                                <List.Item.Meta
                                    avatar={
                                        <Badge dot color={item.online ? 'green' : 'gray'}>
                                            <Avatar icon={item.isGroup ? null : <UserOutlined />} style={{ backgroundColor: item.isGroup ? '#1890ff' : '#87d068' }}>
                                                {item.isGroup ? 'G' : null}
                                            </Avatar>
                                        </Badge>
                                    }
                                    title={<Text strong>{item.name}</Text>}
                                    description={<Text type="secondary" ellipsis>{item.lastMsg}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                </Sider>
                <Content className="chat-content">
                    <div className="chat-header">
                        <Title level={5}>General Chat</Title>
                        <Text type="secondary">3 members online</Text>
                    </div>
                    <div className="message-list-container">
                        <List
                            className="message-list"
                            dataSource={messages}
                            renderItem={(msg) => (
                                <div className={`message-wrapper ${msg.isMe ? 'me' : 'others'}`}>
                                    {!msg.isMe && <Avatar size="small" icon={<UserOutlined />} className="sender-avatar" />}
                                    <div className="message-body">
                                        {!msg.isMe && <div className="sender-name">{msg.sender}</div>}
                                        <div className="message-bubble">{msg.text}</div>
                                        <div className="message-time">{msg.time}</div>
                                    </div>
                                </div>
                            )}
                        />
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input-area">
                        <Input
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onPressEnter={handleSend}
                            suffix={
                                <Space>
                                    <SmileOutlined className="input-icon" theme="outlined" />
                                    <PaperClipOutlined className="input-icon" />
                                </Space>
                            }
                        />
                        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
                    </div>
                </Content>
            </Layout>
        </div>
    );
};

export default InternalChat;
