import React, { useEffect } from 'react';
import {
    Button,
    Typography,
    Modal
} from 'antd';
import {
    PlusOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments, setPreviewItem, setUploadModalVisible } from '../features/documentSlice';
import taiLieuApi from '../api/taiLieuApi';
import DirectorySidebar from '../components/Documents/DirectorySidebar';
import DocumentSearch from '../components/Documents/DocumentSearch';
import DocumentTable from '../components/Documents/DocumentTable';
import DocumentDetailDrawer from '../components/Documents/DocumentDetailDrawer';
import DocumentUploadModal from '../components/Documents/DocumentUploadModal';
import DocumentEditModal from '../components/Documents/DocumentEditModal';
import { getFileIcon } from '../utils/fileUtils';
import '../styles/pages/Documents.scss';

const { Title, Text } = Typography;

const Documents = () => {
    const dispatch = useDispatch();

    const { previewItem, previewVisible } = useSelector((state) => state.documents);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';

    useEffect(() => {
        dispatch(fetchDocuments());
    }, [dispatch]);

    const handleDownload = async (item) => {
        if (!item) return;
        try {
            const blob = await taiLieuApi.download(item.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', item.tenTaiLieu || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            // Error handling already handled by axios interceptor or message
            console.error('Download failed', error);
        }
    };

    return (
        <div className="documents-container">
            <DirectorySidebar />

            <div className="main-content">
                <div className="documents-header">
                    <Title level={3}>Document Management</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => dispatch(setUploadModalVisible(true))}
                    >
                        Upload Document
                    </Button>
                </div>

                <DocumentSearch />
                <DocumentTable />
            </div>

            <Modal
                title={`Preview: ${previewItem?.tenTaiLieu}`}
                open={previewVisible}
                onCancel={() => dispatch(setPreviewItem(null))}
                footer={[
                    <Button
                        key="download"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(previewItem)}
                    >
                        Download
                    </Button>,
                    <Button key="close" onClick={() => dispatch(setPreviewItem(null))}>Close</Button>
                ]}
                width={800}
            >
                <div style={{ padding: '40px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {previewItem && getFileIcon(previewItem.loai)}
                    <div style={{ marginTop: '20px' }}>
                        <Title level={4}>{previewItem?.tenTaiLieu}</Title>
                        <Text type="secondary">Enterprise CMS Secure Viewer Engine v1.0</Text>
                    </div>
                    <div style={{ marginTop: '40px', width: '100%', border: '1px dashed #d9d9d9', padding: '20px' }}>
                        <Text italic>Content rendering is simulated for this demonstration. In a production environment, this would integrate with an Office/PDF viewer service.</Text>
                    </div>
                </div>
            </Modal>

            <DocumentDetailDrawer />
            <DocumentUploadModal />
            <DocumentEditModal />
        </div>
    );
};

export default Documents;
