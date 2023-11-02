import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { CascaderProps } from "antd";
import { Form, Input, Row, Select } from "antd";
import axios from "~/config/axios";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import { User } from "../ManageUser";

const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
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

interface AddMentorModalProps {
  handleAdd: (data: any) => Promise<void>;
  mentorDetail: User | undefined;
  setMentorDetail: Dispatch<SetStateAction<User | undefined>>;
}

const AddMentorModal: React.FC<AddMentorModalProps> = ({
  handleAdd,
  mentorDetail,
  setMentorDetail
}) => {
  const [form] = Form.useForm();
  const [cates, setCates] = useState([]);

  useEffect(() => {
    const getCategoriesOption = async () => {
      try {
        const res = await axios.get("/api/v1/categories");
        setCates(res.data.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    };
    getCategoriesOption();
  }, []);

  return (
    <div>
      {mentorDetail && <h1>Mentor {mentorDetail.fullName}</h1>}
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={handleAdd}
        style={{ maxWidth: 600 }}
        initialValues={
          mentorDetail && {
            email: mentorDetail.email,
            phone: mentorDetail.phone,
            fullName: mentorDetail.fullName,
            majorId: mentorDetail.majorId
          }
        }
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!"
            },
            {
              required: true,
              message: "Please input your E-mail!"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please input your phone number!" },
            {
              pattern: new RegExp(/^0\d{9,10}$/),
              message: "Phone number must be start with 0 and 10 or 11 digits"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Full name"
          rules={[{ required: true, message: "Please input full name" }]}
        >
          <Input maxLength={30} />
        </Form.Item>

        {!mentorDetail && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!"
              },
              {
                min: 6,
                message: "Password must be at least 6 characters"
              }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="majorId"
          label="Major"
          rules={[{ required: true, message: "Please select major!" }]}
        >
          <Select mode="multiple" placeholder="Select your major">
            {cates.map((cate: any) => (
              <Option value={cate._id}>{cate.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddMentorModal;
