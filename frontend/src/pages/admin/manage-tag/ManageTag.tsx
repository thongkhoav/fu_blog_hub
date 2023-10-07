import { useEffect, useState } from "react";
import { Button, Input, Layout, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./manage-tag.scss";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import axios from "~/config/axios";

interface Tag {
  _id: string;
  name: string;
  numBlog: number;
  key: string;
}

const ManageTag = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const handleAddNewTag = async () => {
    try {
      const res = await axiosPrivate.post("/api/v1/tags", {
        name: newTag
      });
      setTags(prev => [{ ...res.data.data, key: res.data.data._id }, ...prev]);
      setNewTag("");
      toast.success("Add new tag successfully", toastOption);
    } catch (error: any) {
      console.log(error);

      toast.error(error.response.data.message, toastOption);
    }
  };

  const handleDeleteTag = async (record: Tag) => {
    try {
      await axiosPrivate.delete(`/api/v1/tags/${record._id}`);
      setTags(prev => prev.filter(tag => tag._id !== record._id));
      toast.success("Deleted tag", toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  useEffect(() => {
    const getTags = async () => {
      try {
        const res = await axios.get("/api/v1/tags");

        const formatedTags = res.data.data?.map((tag: Tag) => ({ ...tag, key: tag._id }));
        setTags(formatedTags);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    };
    getTags();
  }, [axiosPrivate]);

  const columns: ColumnsType<Tag> = [
    {
      title: "Name",
      dataIndex: "name",
      filterSearch: true,
      // onFilter: (value: string, record: Tag) => record.name.startsWith(value),
      width: "30%"
    },
    {
      title: "Blog Used",
      dataIndex: "numBlog",
      sorter: (a, b) => a.numBlog - b.numBlog
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => <Button onClick={() => handleDeleteTag(record)}>Delete</Button>
    }
  ];

  return (
    <Layout className="mt-5">
      <Typography.Title
        level={2}
        className="text-center"
        onClick={() => toast.success("Add new tag successfully", toastOption)}
      >
        Tag list
      </Typography.Title>
      <Space align="center" size="middle" className="my-5">
        <Input placeholder="Tag name" onChange={e => setNewTag(e.target.value)} value={newTag} />
        <Button shape="circle" icon={<PlusOutlined />} onClick={handleAddNewTag} />
      </Space>
      <Table columns={columns} dataSource={tags} />
    </Layout>
  );
};

export default ManageTag;
