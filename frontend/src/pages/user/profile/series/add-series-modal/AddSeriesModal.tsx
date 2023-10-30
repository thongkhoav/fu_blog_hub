import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import axios from "~/config/axios";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { HOST } from "~/utils/constants";
import { useAuth } from "~/utils/helpers";
import { BlogItem } from "~/utils/models/blog.model";
import { Series } from "../Series";

const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 12
    }
  }
};

interface AddSeriesModalProps {
  handleAddSeries: (data: any) => Promise<void>;
  series?: Series;
}

const AddSeriesModal: React.FC<AddSeriesModalProps> = ({ handleAddSeries, series }) => {
  const { userGlobal } = useAuth();
  // contains available blogs and blogs of series
  const [blogsToChoose, setBlogsToChoose] = useState<BlogItem[]>([]);
  // show series blogs if series is editing
  const [seriesBlogs, setSeriesBlogs] = useState<BlogItem[]>([]);
  const [form] = Form.useForm();
  useEffect(() => {
    (async function () {
      const { data } = await axios.get(`${HOST}/api/v1/blogs/user/${userGlobal?._id}`);
      if (series?._id) {
        const blogs = data.data.filter(
          (blog: BlogItem) => !blog.blogSeriesId || blog.blogSeriesId === series._id
        );
        setSeriesBlogs(
          blogs.map((blog: BlogItem) => (blog.blogSeriesId === series._id ? blog._id : null))
        );
        setBlogsToChoose(blogs);
      } else {
        const blogs = data.data.filter((blog: BlogItem) => !blog.blogSeriesId);
        setBlogsToChoose(blogs);
      }
    })();
    form.resetFields();
  }, [form, userGlobal?._id]);

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="addNewSeries"
      onFinish={handleAddSeries}
      style={{ maxWidth: 800 }}
      scrollToFirstError
    >
      <Form.Item
        name="title"
        label="Tiêu đề"
        initialValue={series?.title}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tiêu đề!"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô tả"
        initialValue={series?.description}
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <Input maxLength={200} />
      </Form.Item>
      <Form.Item name="blogIds" label="Bài viết thêm">
        <Select mode="multiple" placeholder="Chọn bài viết thêm vào" defaultValue={seriesBlogs}>
          {blogsToChoose.map(blog => (
            <Option key={blog._id} value={blog._id}>
              {blog.title.length > 80 ? blog.title.slice(0, 80) + "..." : blog.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        {series?._id ? (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Cập nhật series
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Tạo series
          </button>
        )}
      </Form.Item>
    </Form>
  );
};

export default AddSeriesModal;
