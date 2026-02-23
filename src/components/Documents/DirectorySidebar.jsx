import React, { useEffect, useMemo } from 'react';
import { Typography, Tree, Empty, Spin, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { FolderOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setCategoryId, createCategory } from '../../features/documentSlice';

const { Title } = Typography;
const { DirectoryTree } = Tree;
const { Option } = Select;

const DirectorySidebar = () => {
    const dispatch = useDispatch();
    const { categories, loading } = useSelector((state) => state.documents);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCreateFolder = async (values) => {
        try {
            await dispatch(createCategory({
                tenDanhMuc: values.name,
                danhMucChaId: values.parentId || null
            })).unwrap();
            message.success('Đã tạo thư mục mới!');
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi tạo thư mục: ' + error);
        }
    };

    const treeData = useMemo(() => {
        // ... existing treeData logic
        if (!categories || categories.length === 0) return [];

        const map = {};
        const roots = [];

        // Initialize map
        categories.forEach(cat => {
            map[cat.id] = {
                title: cat.tenDanhMuc,
                key: cat.id,
                icon: <FolderOutlined />,
                children: []
            };
        });

        // Build hierarchy
        categories.forEach(cat => {
            if (cat.danhMucChaId && map[cat.danhMucChaId]) {
                map[cat.danhMucChaId].children.push(map[cat.id]);
            } else {
                roots.push(map[cat.id]);
            }
        });

        // Add "Tất cả tài liệu" at the beginning
        return [
            {
                title: 'Tất cả tài liệu',
                key: 'all',
                icon: <FolderOutlined style={{ color: '#1890ff' }} />,
                children: []
            },
            ...roots
        ];
    }, [categories]);

    return (
        <div className="folder-sider">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>Directories</Title>
                <Space>
                    {loading && <Spin size="small" />}
                    {isAdmin && (
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                            size="small"
                        />
                    )}
                </Space>
            </div>

            {treeData.length > 0 ? (
                <DirectoryTree
                    defaultExpandAll
                    treeData={treeData}
                    onSelect={(keys) => {
                        const selectedKey = keys.length > 0 ? keys[0] : null;
                        dispatch(setCategoryId(selectedKey === 'all' ? null : selectedKey));
                    }}
                />
            ) : (
                !loading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No categories" />
            )}

            <Modal
                title="Create New Folder"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                okText="Create"
            >
                <Form form={form} layout="vertical" onFinish={handleCreateFolder}>
                    <Form.Item name="name" label="Folder Name" rules={[{ required: true, message: 'Please enter folder name' }]}>
                        <Input placeholder="Enter folder name" />
                    </Form.Item>
                    <Form.Item name="parentId" label="Parent Folder">
                        <Select placeholder="Select parent folder (Optional)" allowClear>
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.tenDanhMuc}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DirectorySidebar;
