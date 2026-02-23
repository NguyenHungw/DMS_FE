import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, App } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setEditModalVisible, updateDocument } from '../../features/documentSlice';

const { Option } = Select;

const DocumentEditModal = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { selectedItem, editModalVisible, loading } = useSelector((state) => state.documents);

    useEffect(() => {
        if (editModalVisible && selectedItem) {
            form.setFieldsValue({
                tenTaiLieu: selectedItem.tenTaiLieu,
                moTa: selectedItem.moTa,
                danhMucId: selectedItem.danhMucId,
            });
        }
    }, [editModalVisible, selectedItem, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await dispatch(updateDocument({
                id: selectedItem.id,
                data: values
            })).unwrap();
            message.success('Cập nhật thông tin tài liệu thành công!');
            dispatch(setEditModalVisible(false));
        } catch (error) {
            message.error('Lỗi khi cập nhật tài liệu: ' + (error.message || error));
        }
    };

    return (
        <Modal
            title="Edit Document Metadata"
            open={editModalVisible}
            onOk={handleOk}
            onCancel={() => dispatch(setEditModalVisible(false))}
            confirmLoading={loading}
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Document Name"
                    name="tenTaiLieu"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài liệu!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="moTa">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="danhMucId"
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                    <Select placeholder="Select category">
                        <Option value={1}>Công ty</Option>
                        <Option value={2}>Hợp đồng</Option>
                        <Option value={3}>Báo cáo tài chính</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DocumentEditModal;
