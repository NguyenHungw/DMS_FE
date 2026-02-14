import React from 'react';
import { Modal, Form, Button, Input, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadModalVisible, createDocument } from '../../features/documentSlice';

const { Option } = Select;

const DocumentUploadModal = () => {
    const dispatch = useDispatch();
    const { uploadModalVisible } = useSelector((state) => state.documents);
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            await dispatch(createDocument({
                tenTaiLieu: values.docName,
                moTa: values.moTa,
                danhMucId: values.category
            })).unwrap();
            message.success('Tài liệu đã được tạo thành công!');
            dispatch(setUploadModalVisible(false));
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi tải lên tài liệu');
        }
    };

    return (
        <Modal
            title="Upload New Document"
            open={uploadModalVisible}
            onCancel={() => dispatch(setUploadModalVisible(false))}
            footer={null}
        >
            <Form
                form={form}
                className="upload-modal-form"
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item label="Document Name" name="docName" rules={[{ required: true }]}>
                    <Input placeholder="Enter document name" />
                </Form.Item>
                <Form.Item label="Description" name="moTa">
                    <Input.TextArea placeholder="Enter description" />
                </Form.Item>
                <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                    <Select placeholder="Select category">
                        <Option value={1}>HR Policies</Option>
                        <Option value={2}>IT Security</Option>
                        <Option value={3}>Financial Reports</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="File" name="file" rules={[{ required: false }]}>
                    <Upload.Dragger className="upload-dragger" multiple={false} maxCount={1}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area (Simulated)</p>
                    </Upload.Dragger>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="submit-button" size="large">
                        Submit Upload
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DocumentUploadModal;
