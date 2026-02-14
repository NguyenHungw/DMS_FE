import React from 'react';
import { Card, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '../../features/documentSlice';

const DocumentSearch = () => {
    const dispatch = useDispatch();
    const searchText = useSelector((state) => state.documents.searchText);

    return (
        <Card className="search-card" size="small">
            <Input
                placeholder="Search by name, department or tags..."
                prefix={<SearchOutlined />}
                size="large"
                allowClear
                value={searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
                className="search-input"
            />
        </Card>
    );
};

export default DocumentSearch;
