import React from 'react';
import {
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileImageOutlined,
    FolderOutlined
} from '@ant-design/icons';

export const getFileIcon = (type) => {
    const loai = type?.toUpperCase();
    if (loai?.includes('PDF')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    if (loai?.includes('DOC')) return <FileWordOutlined style={{ color: '#1890ff' }} />;
    if (loai?.includes('XLS') || loai?.includes('CSV')) return <FileExcelOutlined style={{ color: '#52c41a' }} />;
    if (loai?.includes('PNG') || loai?.includes('JPG') || loai?.includes('IMG')) return <FileImageOutlined style={{ color: '#faad14' }} />;
    return <FolderOutlined />;
};
