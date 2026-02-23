import React from 'react';
import { Drawer, Typography, Descriptions, Tag, Divider, Timeline, Space, Button } from 'antd';
import { InfoCircleOutlined, HistoryOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerVisible, clearSelectedItem, setEditModalVisible, fetchDocuments } from '../../features/documentSlice';
import taiLieuApi from '../../api/taiLieuApi';
import { message } from 'antd';

const { Title, Text, Paragraph } = Typography;

const DocumentDetailDrawer = () => {
    const dispatch = useDispatch();
    const { selectedItem, drawerVisible } = useSelector((state) => state.documents);

    const handleDownload = async () => {
        if (!selectedItem) return;
        try {
            const blob = await taiLieuApi.download(selectedItem.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', selectedItem.tenTaiLieu || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success('Bắt đầu tải xuống tài liệu...');
        } catch (error) {
            message.error('Lỗi khi tải xuống tài liệu: ' + (error.message || error));
        }
    };

    const handleSubmitForApproval = async () => {
        try {
            await taiLieuApi.submitForApproval(selectedItem.id);
            message.success('Đã gửi tài liệu đi phê duyệt!');
            dispatch(fetchDocuments()); // Refresh list
            dispatch(setDrawerVisible(false));
        } catch (error) {
            message.error('Lỗi khi gửi duyệt: ' + (error.message || error));
        }
    };

    const handleApprove = async () => {
        try {
            await taiLieuApi.approve(selectedItem.id);
            message.success('Đã phê duyệt tài liệu thành công!');
            dispatch(fetchDocuments()); // Refresh list
            dispatch(setDrawerVisible(false));
        } catch (error) {
            message.error('Lỗi khi phê duyệt: ' + (error.message || error));
        }
    };

    return (
        <Drawer
            title={selectedItem?.tenTaiLieu}
            placement="right"
            onClose={() => dispatch(setDrawerVisible(false))}
            open={drawerVisible}
            width={500}
            className="detail-drawer"
            afterOpenChange={(open) => {
                if (!open) dispatch(clearSelectedItem());
            }}
        >
            {selectedItem && (
                <div className="detail-drawer-content">
                    <div className="drawer-section">
                        <Title level={5}><InfoCircleOutlined /> Document Information</Title>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="File Size">{selectedItem.dungLuong || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Department">{selectedItem.tenPhongBan}</Descriptions.Item>
                            <Descriptions.Item label="Owner">{selectedItem.tenChuSoHuu}</Descriptions.Item>
                            <Descriptions.Item label="Category">{selectedItem.tenDanhMuc}</Descriptions.Item>
                            <Descriptions.Item label="Created">{new Date(selectedItem.ngayTao).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={selectedItem.trangThai === 'Approved' ? 'green' : (selectedItem.trangThai === 'Draft' ? 'default' : 'orange')}>
                                    {selectedItem.trangThai}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginTop: 16 }}>
                            <Text strong>Description:</Text>
                            <Paragraph type="secondary" style={{ marginTop: 8 }}>
                                {selectedItem.moTa || 'Không có mô tả.'}
                            </Paragraph>
                        </div>
                    </div>

                    <Divider />

                    <div className="drawer-section">
                        <Title level={5}><HistoryOutlined /> Versions</Title>
                        <Timeline
                            mode="left"
                            items={selectedItem.versions?.map(v => ({
                                label: new Date(v.ngayTao).toLocaleDateString(),
                                children: (
                                    <div>
                                        <Text strong>v{v.soPhienBan}</Text> - <Text type="secondary">by {v.nguoiTao}</Text>
                                    </div>
                                ),
                                color: v.soPhienBan === selectedItem.versions[0]?.soPhienBan ? 'green' : 'blue'
                            })) || [{ children: 'No version history available' }]}
                        />
                    </div>

                    <Space style={{ marginTop: 24, width: '100%' }} direction="vertical">
                        <Space style={{ width: '100%' }}>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                block
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                block
                                onClick={() => dispatch(setEditModalVisible(true))}
                            >
                                Edit
                            </Button>
                        </Space>

                        {selectedItem.trangThai === 'Draft' && (
                            <Button type="primary" ghost block onClick={handleSubmitForApproval}>
                                Submit for Approval
                            </Button>
                        )}

                        {selectedItem.trangThai === 'PendingApproval' && (
                            <Button type="primary" ghost block danger={false} style={{ color: '#52c41a', borderColor: '#52c41a' }} onClick={handleApprove}>
                                Approve Document
                            </Button>
                        )}
                    </Space>
                </div>
            )}
        </Drawer>
    );
};

export default DocumentDetailDrawer;
