import { useEffect, useState } from "react";
import { Button, Input, Layout, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./manage-category.scss";
import { toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import axios from "~/config/axios";

export interface Category {
  _id: string;
  name: string;
  numBlog: number;
  key: string;
}

const ManageCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCate, setNewCate] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const handleAddNewCategory = async () => {
    try {
      const res = await axiosPrivate.post("/api/v1/categories", {
        name: newCate
      });
      setCategories(prev => [{ ...res.data.data, key: res.data.data._id }, ...prev]);
      setNewCate("");
      toast.success("Add new category successfully", toastOption);
    } catch (error: any) {
      console.log(error);

      // toast.error(error.response.data.message, toastOption);
    }
  };

  const handleDeleteCate = async (record: Category) => {
    try {
      await axiosPrivate.delete(`/api/v1/categories/${record._id}`);
      setCategories(prev => prev.filter(tag => tag._id !== record._id));
      toast.success("Deleted category", toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get("/api/v1/categories");

        const formatedTags = res.data.data?.map((tag: Category) => ({ ...tag, key: tag._id }));
        setCategories(formatedTags);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    };
    getCategories();
  }, []);

  const columns: ColumnsType<Category> = [
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
      render: (_, record) => <Button onClick={() => handleDeleteCate(record)}>Delete</Button>
    }
  ];

  return (
    <Layout className="mt-5">
      <Typography.Title
        level={2}
        className="text-center"
        onClick={() => toast.success("Add new tag successfully", toastOption)}
      >
        Category list
      </Typography.Title>
      <Space align="center" size="middle" className="my-5">
        <Input
          placeholder="Category title"
          onChange={e => setNewCate(e.target.value)}
          value={newCate}
        />
        <Button shape="circle" icon={<PlusOutlined />} onClick={handleAddNewCategory} />
      </Space>
      <Table columns={columns} dataSource={categories} />
    </Layout>
  );
};

export default ManageCategory;
