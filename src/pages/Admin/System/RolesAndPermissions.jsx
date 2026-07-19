import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Modal, Radio, Divider, Spin, Empty } from 'antd';
import { CheckCircleOutlined, StopOutlined, SettingOutlined } from '@ant-design/icons';
import { useRoles, usePermissions, useRolePermissions, useAssignPermissionsToRole } from './hooks/useRbacQueries';

const { Title, Text } = Typography;

export default function RolesAndPermissions() {
  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { data: allPermissions, isLoading: permsLoading } = usePermissions();
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Matrix data state: { [permissionCode]: effect (0, 1, 2) }
  const [permissionMatrix, setPermissionMatrix] = useState({});
  
  const { data: rolePermissions, isLoading: rolePermsLoading, isFetching } = useRolePermissions(selectedRole?.id);
  const assignPermsMutation = useAssignPermissionsToRole();

  // Populate matrix when role permissions are loaded
  useEffect(() => {
    if (rolePermissions && isModalVisible) {
      const initialMatrix = {};
      rolePermissions.forEach(rp => {
        initialMatrix[rp.permissionCode] = rp.effect;
      });
      setPermissionMatrix(initialMatrix);
    }
  }, [rolePermissions, isModalVisible]);

  const handleOpenPermissions = (record) => {
    setSelectedRole(record);
    setIsModalVisible(true);
    setPermissionMatrix({});
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedRole(null);
  };

  const handleSave = () => {
    const data = Object.keys(permissionMatrix)
      .map(code => ({ permissionCode: code, effect: permissionMatrix[code] }))
      .filter(p => p.effect !== 0); // Only send Allow or Deny (NotSet can just be omitted, or backend can handle it. Backend deletes omitted ones or updates them if we send everything. Let's send everything that is 1 or 2).
    
    assignPermsMutation.mutate({ roleId: selectedRole.id, data: { permissions: data } }, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  // Group permissions by GroupName
  const groupedPermissions = React.useMemo(() => {
    if (!allPermissions) return {};
    return allPermissions.reduce((acc, curr) => {
      if (!acc[curr.groupName]) acc[curr.groupName] = [];
      acc[curr.groupName].push(curr);
      return acc;
    }, {});
  }, [allPermissions]);

  const columns = [
    {
      title: 'Tên Vai trò',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<SettingOutlined />} 
          onClick={() => handleOpenPermissions(record)}
        >
          Cấu hình Quyền
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">Vai Trò & Phân Quyền</Title>
      </div>

      <Table 
        columns={columns} 
        dataSource={roles} 
        rowKey="id" 
        loading={rolesLoading}
        pagination={false}
      />

      <Modal
        title={`Cấu hình quyền cho: ${selectedRole?.name}`}
        open={isModalVisible}
        onCancel={handleClose}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleClose}>Huỷ</Button>,
          <Button 
            key="save" 
            type="primary" 
            loading={assignPermsMutation.isPending} 
            onClick={handleSave}
          >
            Lưu thiết lập
          </Button>
        ]}
      >
        {(permsLoading || isFetching) ? (
          <div className="flex justify-center p-12"><Spin size="large" /></div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            {Object.keys(groupedPermissions).length === 0 ? (
              <Empty description="Không có quyền nào được định nghĩa" />
            ) : (
              Object.keys(groupedPermissions).map(groupName => (
                <div key={groupName} className="mb-6">
                  <Text strong className="text-lg text-primary">{groupName}</Text>
                  <Divider className="my-2" />
                  
                  {groupedPermissions[groupName].map(perm => {
                    const currentEffect = permissionMatrix[perm.code] || 0;
                    return (
                      <div key={perm.code} className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{perm.name}</div>
                          <div className="text-xs text-gray-500">{perm.code}</div>
                        </div>
                        <Radio.Group 
                          value={currentEffect} 
                          onChange={e => setPermissionMatrix(prev => ({ ...prev, [perm.code]: e.target.value }))}
                          buttonStyle="solid"
                        >
                          <Radio.Button value={1} className="text-green-600 hover:text-green-700">
                            <CheckCircleOutlined className="mr-1" /> Cho phép
                          </Radio.Button>
                          <Radio.Button value={0}>
                            Không set
                          </Radio.Button>
                          <Radio.Button value={2} className="text-red-600 hover:text-red-700">
                            <StopOutlined className="mr-1" /> Từ chối
                          </Radio.Button>
                        </Radio.Group>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
