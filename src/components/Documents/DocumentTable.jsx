import React from 'react';
import { Table, Space, Button, Tag, App, Typography } from 'antd';
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

import taiLieuApi from '../../api/taiLieuApi';

const { Text } = Typography;

const DocumentTable = () => {
    const { message } = App.useApp();
    const dispatch = useDispatch();
    const { items, loading, searchText, selectedCategoryId, categories } = useSelector((state) => state.documents);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Administrator';

    // Helper to get all sub-category IDs recursively
    const getCategoryDescendants = (parentId) => {
        let results = [parentId];
        const children = categories.filter(c => c.danhMucChaId === parentId);
        children.forEach(child => {
            results = [...results, ...getCategoryDescendants(child.id)];
        });
        return results;
    };

    const handleDownload = async (record) => {
        try {
            message.loading({ content: `Downloading ${record.tenTaiLieu}...`, key: 'download' });
            const blob = await taiLieuApi.download(record.id);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', record.tenTaiLieu);
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success({ content: 'Download complete!', key: 'download' });
        } catch (error) {
            message.error({ content: 'Download failed: ' + error, key: 'download' });
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'tenTaiLieu',
            key: 'tenTaiLieu',
            render: (text, record) => {
                const extension = text.split('.').pop();
                return (
                    <Space>
                        {getFileIcon(extension)}
                        <span className="doc-name" style={{ color: '#1890ff', cursor: 'pointer', fontWeight: 500 }} onClick={() => dispatch(fetchDocumentDetail(record.id))}>
                            {text}
                        </span>
                    </Space>
                );
            },
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
            title: 'Category',
            dataIndex: 'tenDanhMuc',
            key: 'tenDanhMuc',
            render: (cat) => <Text type="secondary">{cat || 'Uncategorized'}</Text>
        },
        {
            title: 'Department',
            dataIndex: 'tenPhongBan',
            key: 'tenPhongBan',
            render: (dept) => (
                <Tag color="cyan">
                    {dept || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Owner',
            dataIndex: 'tenChuSoHuu',
            key: 'tenChuSoHuu',
            render: (owner) => <Text>{owner || 'System'}</Text>
        },
        {
            title: 'Date',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
            sorter: (a, b) => new Date(a.ngayTao) - new Date(b.ngayTao),
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
                        onClick={() => handleDownload(record)}
                    />
                    {isAdmin && (
                        <>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    dispatch(fetchDocumentDetail(record.id));
                                }}
                            />
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => dispatch(deleteDocument(record.id))}
                            />
                        </>
                    )}
                </Space>
            ),
        },
    ];

    const filteredData = items.filter(item => {
        const matchesSearch = item.tenTaiLieu.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.tenPhongBan && item.tenPhongBan.toLowerCase().includes(searchText.toLowerCase())) ||
            (item.tenDanhMuc && item.tenDanhMuc.toLowerCase().includes(searchText.toLowerCase()));

        let matchesCategory = true;
        if (selectedCategoryId) {
            const allowedCategoryIds = getCategoryDescendants(selectedCategoryId);
            matchesCategory = allowedCategoryIds.includes(item.danhMucId);
        }

        return matchesSearch && matchesCategory;
    });

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
