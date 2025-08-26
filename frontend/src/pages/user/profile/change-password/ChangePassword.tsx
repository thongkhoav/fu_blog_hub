import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import { getUserData, setUserData, useAuth } from "~/utils/helpers";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import axios from "~/config/axios";
import { HOST } from "~/utils/constants";
import { useNavigate } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};
function ChangePassword() {
  const { userGlobal, setUserGlobal, onLogout } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [form] = Form.useForm();
  const navigator = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      const res = await axiosPrivate.put(`${HOST}/api/v1/users/changePassword/${userGlobal._id}`, {
        password: values.password
      });

      if (res.data.status === "success") {
        toast.success("Password changed successfully!", toastOption);
        toast.success("Please log in again!", toastOption);
      }

      await onLogout();
      navigator("/login");
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  return (
    <div className="mt-6 flex justify-center max-w-[700px] ">
      <Form
        {...formItemLayout}
        form={form}
        name="changePassword"
        scrollToFirstError
        onFinish={handleSubmit}
      >
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              message: "Please enter your new password!"
            },
            {
              min: 6,
              message: "Password must be at least 6 characters!"
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your new password!"
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 w-1/2 rounded "
          >
            Update
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ChangePassword;
