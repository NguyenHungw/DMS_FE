import React from 'react';
import { Modal, Form, Button, Input, Select, Upload, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadModalVisible, createDocument } from '../../features/documentSlice';

const { Option } = Select;

const DocumentUploadModal = () => {
    const { message } = App.useApp();
    const dispatch = useDispatch();
    const { uploadModalVisible, categories } = useSelector((state) => state.documents);
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('TenTaiLieu', values.docName);
            formData.append('MoTa', values.moTa || '');
            formData.append('DanhMucId', values.category);

            if (values.file && values.file.fileList && values.file.fileList[0]) {
                formData.append('File', values.file.fileList[0].originFileObj);
            }

            await dispatch(createDocument(formData)).unwrap();
            message.success('Tài liệu đã được tải lên thành công!');
            dispatch(setUploadModalVisible(false));
            form.resetFields();
        } catch (error) {
            message.error('Lỗi khi tải lên tài liệu: ' + (error.message || error));
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
                        {categories.map(cat => (
                            <Option key={cat.id} value={cat.id}>{cat.tenDanhMuc}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="File" name="file" rules={[{ required: true, message: 'Vui lòng chọn file' }]}>
                    <Upload.Dragger
                        className="upload-dragger"
                        multiple={false}
                        maxCount={1}
                        beforeUpload={() => false} // Prevent automatic upload
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single upload.</p>
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
