import React from 'react';
import { Table, Space, Button, Tag, message } from 'antd';
import {
    EyeOutlined,
    InfoCircleOutlined,
    DownloadOutlined,
    EditOutlined,
    DeleteOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileImageOutlined,
    FolderOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    setPreviewItem,
    fetchDocumentDetail,
    deleteDocument
} from '../../features/documentSlice';
import { getFileIcon } from '../../utils/fileUtils';

const DocumentTable = () => {
    const dispatch = useDispatch();
    const { items, loading, searchText } = useSelector((state) => state.documents);


    const columns = [
        {
            title: 'Name',
            dataIndex: 'tenTaiLieu',
            key: 'tenTaiLieu',
            render: (text, record) => (
                <Space>
                    {getFileIcon(record.loai)}
                    <span className="doc-name" onClick={() => dispatch(fetchDocumentDetail(record.id))}>{text}</span>
                </Space>
            ),
            sorter: (a, b) => a.tenTaiLieu.localeCompare(b.tenTaiLieu),
        },
        {
            title: 'Status',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (status) => {
                let color = 'blue';
                if (status === 'Draft') color = 'orange';
                if (status === 'Archived') color = 'default';
                if (status === 'Approved' || status === 'Circulating') color = 'green';
                if (status === 'PendingApproval') color = 'processing';
                return <Tag color={color}>{status || 'N/A'}</Tag>;
            }
        },
        {
            title: 'Department',
            dataIndex: 'phongBan',
            key: 'phongBan',
            render: (dept) => (
                <Tag color="cyan">
                    {dept || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Date',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => dispatch(setPreviewItem(record))}
                    />
                    <Button
                        type="text"
                        icon={<InfoCircleOutlined />}
                        onClick={() => dispatch(fetchDocumentDetail(record.id))}
                    />
                    <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => message.info(`Downloading ${record.tenTaiLieu}`)}
                    />
                    <Button type="text" icon={<EditOutlined />} />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => dispatch(deleteDocument(record.id))}
                    />
                </Space>
            ),
        },
    ];

    const filteredData = items.filter(item =>
        item.tenTaiLieu.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.phongBan && item.phongBan.toLowerCase().includes(searchText.toLowerCase()))
    );

    return (
        <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="documents-table"
        />
    );
};

export default DocumentTable;
