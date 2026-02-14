import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginAsync } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Login.scss';

const { Title } = Typography;

const Login = () => {
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const resultAction = await dispatch(loginAsync({
                email: values.username,
                matKhau: values.password
            }));

            if (loginAsync.fulfilled.match(resultAction)) {
                message.success('Đăng nhập thành công!');
                navigate('/');
            } else {
                message.error(resultAction.payload || 'Tên đăng nhập hoặc mật khẩu không đúng');
            }
        } catch (err) {
            message.error('Có lỗi xảy ra khi đăng nhập');
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <div className="login-header">
                    <Title level={2}>CMS LOGIN</Title>
                    <p>Management System Dashboard</p>
                </div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button" loading={loading}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
