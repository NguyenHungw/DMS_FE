import React from 'react';
import { Drawer, Typography, Descriptions, Tag, Divider, Timeline, Space, Button } from 'antd';
import { InfoCircleOutlined, HistoryOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setDrawerVisible, clearSelectedItem } from '../../features/documentSlice';

const { Title, Text, Paragraph } = Typography;

const DocumentDetailDrawer = () => {
    const dispatch = useDispatch();
    const { selectedItem, drawerVisible } = useSelector((state) => state.documents);

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
                            <Descriptions.Item label="File Type">{selectedItem.loai}</Descriptions.Item>
                            <Descriptions.Item label="File Size">{selectedItem.dungLuong || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Department">{selectedItem.phongBan}</Descriptions.Item>
                            <Descriptions.Item label="Owner">{selectedItem.owner}</Descriptions.Item>
                            <Descriptions.Item label="Created">{new Date(selectedItem.ngayTao).toLocaleString()}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={selectedItem.trangThai === 'Approved' ? 'green' : 'orange'}>
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

                    <Space style={{ marginTop: 24, width: '100%' }}>
                        <Button type="primary" icon={<DownloadOutlined />} block>Download Now</Button>
                        <Button icon={<EditOutlined />} block>Edit Metadata</Button>
                    </Space>
                </div>
            )}
        </Drawer>
    );
};

export default DocumentDetailDrawer;
