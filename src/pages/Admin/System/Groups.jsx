import React, { useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { 
  useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup, 
  useAssignRolesToGroup, useRoles 
} from './hooks/useRbacQueries';

const { Title } = Typography;

export default function Groups() {
  const { data: groups, isLoading } = useGroups();
  const { data: roles } = useRoles();
  
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();
  const assignMutation = useAssignRolesToGroup();

  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [assigningGroup, setAssigningGroup] = useState(null);

  const handleOpenForm = (group = null) => {
    setEditingGroup(group);
    if (group) {
      form.setFieldsValue({ name: group.name, description: group.description });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    form.resetFields();
  };

  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      if (editingGroup) {
        updateMutation.mutate({ id: editingGroup.id, data: values }, { onSuccess: handleCloseForm });
      } else {
        createMutation.mutate(values, { onSuccess: handleCloseForm });
      }
    } catch (e) {
      // Validation error
    }
  };

  const handleOpenAssign = (group) => {
    setAssigningGroup(group);
    roleForm.setFieldsValue({
      roleIds: group.roles?.map(r => r.id) || []
    });
    setIsRoleModalOpen(true);
  };

  const handleCloseAssign = () => {
    setIsRoleModalOpen(false);
    setAssigningGroup(null);
    roleForm.resetFields();
  };

  const handleSubmitAssign = async () => {
    try {
      const values = await roleForm.validateFields();
      assignMutation.mutate({ id: assigningGroup.id, data: values }, { onSuccess: handleCloseAssign });
    } catch (e) {
      // Validation error
    }
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: 'Tên Nhóm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Roles đã gán',
      key: 'roles',
      render: (_, record) => record.roles?.map(r => r.name).join(', ') || 'Chưa có',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="default" 
            icon={<SettingOutlined />} 
            onClick={() => handleOpenAssign(record)}
          >
            Gán Role
          </Button>
          <Button 
            type="primary" 
            ghost
            icon={<EditOutlined />} 
            onClick={() => handleOpenForm(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá nhóm này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />}>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">Quản lý Nhóm người dùng</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm()}>
          Tạo nhóm
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={groups} 
        rowKey="id" 
        loading={isLoading}
      />

      <Modal
        title={editingGroup ? "Cập nhật Nhóm" : "Tạo Nhóm Mới"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        onOk={handleSubmitForm}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="Tên nhóm" 
            rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}
          >
            <Input placeholder="Nhập tên nhóm" />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="Mô tả"
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Gán Role cho nhóm: ${assigningGroup?.name}`}
        open={isRoleModalOpen}
        onCancel={handleCloseAssign}
        onOk={handleSubmitAssign}
        confirmLoading={assignMutation.isPending}
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item 
            name="roleIds" 
            label="Chọn các Role muốn gán"
          >
            <Select 
              mode="multiple" 
              placeholder="Chọn role..."
              options={roles?.map(r => ({ value: r.id, label: r.name }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
