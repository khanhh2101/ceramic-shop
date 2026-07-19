import React, { useState } from 'react';
import { Table, Button, Space, Typography, Popconfirm, Modal, Form, Input, InputNumber, TreeSelect, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAdminMenus, useCreateMenu, useUpdateMenu, useDeleteMenu } from './hooks/useMenuQueries';
import { usePermissions } from './hooks/useRbacQueries';

const { Title } = Typography;

export default function MenuManager() {
  const { data: menus, isLoading } = useAdminMenus();
  const { data: permissions } = usePermissions();

  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const deleteMutation = useDeleteMenu();

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  // Transform flat menu to tree for TreeSelect
  const buildTree = (items, parentId = null) => {
    return items
      ?.filter(item => item.parentId === parentId)
      ?.sort((a, b) => a.order - b.order)
      ?.map(item => ({
        ...item,
        title: item.titleVi,
        value: item.id,
        key: item.id,
        children: buildTree(items, item.id),
      }));
  };

  const treeData = React.useMemo(() => buildTree(menus || []), [menus]);

  const handleOpenForm = (menu = null, parentId = null) => {
    setEditingMenu(menu);
    if (menu) {
      form.setFieldsValue(menu);
    } else {
      form.resetFields();
      if (parentId) {
        form.setFieldsValue({ parentId, order: 0, isActive: true });
      } else {
        form.setFieldsValue({ order: 0, isActive: true });
      }
    }
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingMenu) {
        updateMutation.mutate({ id: editingMenu.id, data: values }, { onSuccess: handleCloseForm });
      } else {
        createMutation.mutate(values, { onSuccess: handleCloseForm });
      }
    } catch (e) {
      // Validation error
    }
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: 'Tiêu đề (VI / EN)',
      key: 'title',
      render: (_, record) => (
        <span>
          <strong>{record.titleVi}</strong> / <span className="text-gray-500">{record.titleEn}</span>
        </span>
      ),
    },
    {
      title: 'Đường dẫn (Path)',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: 'Quyền yêu cầu',
      dataIndex: 'requirePermission',
      key: 'requirePermission',
      render: (val) => val ? <Tag color="blue">{val}</Tag> : <Tag color="default">Không có</Tag>,
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="dashed" 
            size="small"
            icon={<PlusOutlined />} 
            onClick={() => handleOpenForm(null, record.id)}
          >
            Thêm con
          </Button>
          <Button 
            type="primary" 
            ghost
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleOpenForm(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá menu này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">Quản lý Menu Động</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenForm()}>
          Tạo Menu Gốc
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={treeData} 
        rowKey="id" 
        loading={isLoading}
        pagination={false}
        defaultExpandAllRows
      />

      <Modal
        title={editingMenu ? "Cập nhật Menu" : "Tạo Menu Mới"}
        open={isModalOpen}
        onCancel={handleCloseForm}
        onOk={handleSubmit}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={700}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="titleVi" 
              label="Tiêu đề (Tiếng Việt)" 
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tiếng Việt' }]}
            >
              <Input placeholder="Ví dụ: Bảng điều khiển" />
            </Form.Item>
            
            <Form.Item 
              name="titleEn" 
              label="Tiêu đề (Tiếng Anh)" 
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tiếng Anh' }]}
            >
              <Input placeholder="Ví dụ: Dashboard" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="path" 
              label="Đường dẫn" 
              rules={[{ required: true, message: 'Vui lòng nhập đường dẫn' }]}
            >
              <Input placeholder="Ví dụ: /admin/dashboard" />
            </Form.Item>

            <Form.Item 
              name="icon" 
              label="Tên Icon (Feather/Lucide)"
            >
              <Input placeholder="Ví dụ: Home, Users, Settings" />
            </Form.Item>
          </div>

          <Form.Item 
            name="requirePermission" 
            label="Quyền Yêu Cầu (RBAC)"
            extra="Nếu trống, menu này sẽ hiển thị cho mọi admin."
          >
            <Select
              allowClear
              showSearch
              placeholder="Chọn quyền yêu cầu"
              options={permissions?.map(p => ({ value: p.code, label: `${p.name} (${p.code})` }))}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="parentId" 
              label="Menu Cha"
            >
              <TreeSelect
                treeData={treeData}
                placeholder="Chọn menu cha (để trống nếu là menu gốc)"
                allowClear
                treeDefaultExpandAll
              />
            </Form.Item>

            <Form.Item 
              name="order" 
              label="Thứ tự hiển thị"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
