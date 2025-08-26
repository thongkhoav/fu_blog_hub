import { useEffect, useState } from "react";
import { Button, Input, Layout, Modal, Popconfirm, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import axios from "~/config/axios";
import "./manage-user.scss";
import AddMentorModal from "./add-mentor-modal/AddMentorModal";
import { AxiosResponse } from "axios";

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  majorId: string[];
  key: string;
  isBanned: boolean;
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
  const [mentorDetail, setMentorDetail] = useState<User>();

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
      let res!: AxiosResponse<any, any>;
      if (mentorDetail?._id) {
        res = await axiosPrivate.patch("/api/v1/users/" + mentorDetail._id, values);
        setUsers(prev => [...prev.filter(user => user._id !== mentorDetail?._id), res.data.user]);
      } else {
        res = await axiosPrivate.post("/api/v1/users/mentor", values);
        setUsers(prev => [{ ...res.data.user, key: res.data.user._id }, ...prev]);
      }
      setIsModalOpen(false);
      setMentorDetail(undefined);
      toast.success(res.data.message, toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setMentorDetail(undefined);
  };

  const openEditModal = (user: User) => {
    setIsModalOpen(true);
    setMentorDetail(user);
  };

  const compareTime = (date: Date | undefined) => {
    if (!date) return false;
    // if date > current date, still banned
    return date > new Date();
  };

  const banUser = async (isBanned: boolean) => {
    // isBanned true to unban, false to ban
    try {
      // const res = await axiosPrivate.patch("/api/v1/users/ban", {
      //   userId: "60b9d8b6c9e3c40015a8f8c0",
      //   isBanned
      // });
      console.log("ban");
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
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
      render: (_, record) => (
        <p>
          <Popconfirm
            title="Confirm"
            description={`Are you sure you want to delete ${record.role} ${record.fullName}?`}
            onConfirm={() => banUser(compareTime(record?.ban?.banUntil))}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>{compareTime(record?.ban?.banUntil) ? "Unban" : "Ban"}</Button>
          </Popconfirm>
          {record.role === "mentor" && (
            <Button className="ml-2" onClick={() => openEditModal(record)}>
              Edit
            </Button>
          )}
        </p>
      )
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
          <AddMentorModal
            handleAdd={handleAdd}
            mentorDetail={mentorDetail}
            setMentorDetail={setMentorDetail}
          />
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
