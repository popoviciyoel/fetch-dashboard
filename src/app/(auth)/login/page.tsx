'use client';

import { Button, Card, Form, Input, message } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

interface LoginFormData {
    email: string;
    name: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values: LoginFormData) => {
        try {
            const path = "auth/login"
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
                credentials: 'include'
            });

            if (response.ok) {
                router.push('/search');
            }

        } catch (error) {
            message.error('Login failed. Please try again.' + error);
        }
    };

    return (<div className={styles.container}>
        <Card title="Welcome to Fetch 🐶 " className={styles.loginCard} >

            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Name"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>
    );
}
