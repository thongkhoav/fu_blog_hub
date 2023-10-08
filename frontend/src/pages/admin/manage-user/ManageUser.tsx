import { useEffect, useState } from "react";
import { Button, Input, Layout, Modal, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import axios from "~/config/axios";
import "./manage-user.scss";
import AddMentorModal from "./add-mentor-modal/AddMentorModal";

interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  key: string;
  ban?: {
    bannedReason: string;
    banUntil: Date;
    banAt: Date;
  };
}

const ManageUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axiosPrivate.get("/api/v1/users");
        const formatedUsers = res.data.data?.map((user: User) => ({ ...user, key: user._id }));
        setUsers(formatedUsers);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    };
    getUsers();
  }, [axiosPrivate]);

  const handleAdd = async (values: any) => {
    try {
      const res = await axiosPrivate.post("/api/v1/users/mentor", values);
      setUsers(prev => [{ ...res.data.user, key: res.data.user._id }, ...prev]);
      setIsModalOpen(false);
      toast.success("Add new mentor successfully", toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const compareTime = (date: Date | undefined) => {
    if (!date) return false;
    // if date > current date, still banned
    return date > new Date();
  };

  const columns: ColumnsType<User> = [
    {
      title: "Email",
      dataIndex: "email",
      width: "20%"
    },
    {
      title: "Full name",
      dataIndex: "fullName",
      filterSearch: true,
      // onFilter: (value: string, record: Tag) => record.name.startsWith(value),
      width: "30%"
    },
    {
      title: "Role",
      dataIndex: "role"
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => <Button>{compareTime(record?.ban?.banUntil) ? "Unban" : "Ban"}</Button>
    }
  ];

  return (
    <div>
      <Layout className="mt-5">
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => <CancelBtn />}
        >
          <AddMentorModal handleAdd={handleAdd} />
        </Modal>
        <Typography.Title
          level={2}
          className="text-center"
          onClick={() => toast.success("Add new tag successfully", toastOption)}
        >
          Manage user
        </Typography.Title>
        <Space align="center" size="middle" className="my-5">
          <Button onClick={showModal}>Add mentor</Button>
        </Space>
        <Table columns={columns} dataSource={users} />
      </Layout>
    </div>
  );
};

export default ManageUser;
