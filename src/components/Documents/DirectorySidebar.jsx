import React from 'react';
import { Typography, Tree } from 'antd';
import { FolderOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { DirectoryTree } = Tree;

const treeData = [
    {
        title: 'Company Policy',
        key: '0-0',
        icon: <FolderOutlined />,
        children: [
            { title: 'HR Policies', key: '0-0-0', isLeaf: true },
            { title: 'IT Security', key: '0-0-1', isLeaf: true },
        ],
    },
    {
        title: 'Project Alpha',
        key: '0-1',
        icon: <FolderOutlined />,
        children: [
            { title: 'Budget', key: '0-1-0', isLeaf: true },
            { title: 'Meeting Notes', key: '0-1-1', isLeaf: true },
        ],
    },
    {
        title: 'Marketing Assets',
        key: '0-2',
        icon: <FolderOutlined />,
        isLeaf: true,
    },
];

const DirectorySidebar = () => {
    return (
        <div className="folder-sider">
            <Title level={4}>Directories</Title>
            <DirectoryTree
                multiple
                defaultExpandAll
                treeData={treeData}
                onSelect={(keys, info) => console.log('Trigger Select', keys, info)}
                onExpand={(keys, info) => console.log('Trigger Expand', keys, info)}
            />
        </div>
    );
};

export default DirectorySidebar;
