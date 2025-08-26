import { useEffect, useState } from "react";
import "./manage-blog.scss";
import { BlogItem } from "~/utils/models/blog.model";
import { Button, Input, Layout, Space, Table, Typography } from "antd";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import { DEFAULT_IMG, FE_HOST, HOST } from "~/utils/constants";
import toastOption from "~/utils/constants/toastOption";
import axios from "~/config/axios";
import { get } from "http";
import { getAllPublicBlogs } from "~/apis/blog.api";
import useAxiosPrivate from "~/config/useAxiosPrivate";

const ManageBlog = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const handleDeleteBlog = async (record: BlogItem) => {
    try {
      const { data } = await axiosPrivate.delete(`${HOST}/api/v1/blogs/${record._id}`);
      setBlogs(prev => prev.filter(blog => blog._id !== record._id));
      toast.success("Deleted blog", toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  useEffect(() => {
    const getPublicBlogs = async () => {
      try {
        const res = await getAllPublicBlogs();

        const formatedBlogs = res.data.data?.map((blog: BlogItem) => ({ ...blog, key: blog._id }));
        setBlogs(formatedBlogs);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    };
    getPublicBlogs();
  }, []);

  const columns: ColumnsType<BlogItem> = [
    {
      title: "Post",
      render: (_, record: BlogItem) => (
        <Space>
          <img
            className="w-[50px] h-[50px] rounded-full border border-slate-600"
            src={record.thumbnail || DEFAULT_IMG}
            alt=""
          />
          <a href={FE_HOST + "/blogs/" + record?._id} target="_blank" rel="noreferrer">
            <Typography.Text>{record.title}</Typography.Text>
          </a>
        </Space>
      )
    },
    {
      title: "Author",
      render: (_, record: BlogItem) => (
        <Space>
          <img
            className="w-[30px] h-[30px] rounded-full border border-slate-600"
            src={record.userId.avatar}
            alt=""
          />
          <Typography.Text>{record.userId.fullName}</Typography.Text>
        </Space>
      )
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => <Button onClick={() => handleDeleteBlog(record)}>Delete</Button>
    }
  ];

  return (
    <Layout className="mt-5">
      <Typography.Title level={2} className="text-center">
        List of Public Posts
      </Typography.Title>
      <Table columns={columns} dataSource={blogs} />
    </Layout>
  );
};

export default ManageBlog;
