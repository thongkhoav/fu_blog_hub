import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import { getUserData, setUserData, useAuth } from "~/utils/helpers";
import "./information.scss";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import axios from "~/config/axios";
import { HOST } from "~/utils/constants";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

export default function Information() {
  const { userGlobal } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [form] = Form.useForm();
  const [cates, setCates] = useState([]);
  const { setUserGlobal } = useAuth();
  const user = getUserData();

  const initialValues = {
    email: userGlobal.email,
    phone: userGlobal.phone,
    fullName: userGlobal.fullName,
    facebook: userGlobal.facebook,
    instagram: userGlobal.instagram,
    favoriteCates: userGlobal.favoriteCates
  };

  const handleUpdate = async (form: any) => {
    let { email, ...dataSend } = form;
    try {
      const res = await axiosPrivate.put(
        `${HOST}/api/v1/users/updateMe/${userGlobal._id}`,
        dataSend
      );
      if (res.data.status === "success") {
        let infoUser = res.data.data;
        setUserData({
          ...user,
          fullName: infoUser.fullName,
          phone: infoUser.phone,
          facebook: infoUser.facebook,
          instagram: infoUser.instagram,
          favoriteCates: infoUser.favoriteCates
        });
        setUserGlobal((prev: any) => ({
          ...prev,
          fullName: infoUser.fullName,
          phone: infoUser.phone,
          facebook: infoUser.facebook,
          instagram: infoUser.instagram,
          favoriteCates: infoUser.favoriteCates
        }));
        toast.success("Cập nhật thông tin thành công!", toastOption);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

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
    <div className="mt-6 ml-[-50px]">
      <Form
        {...formItemLayout}
        form={form}
        name="information"
        initialValues={initialValues}
        scrollToFirstError
        onFinish={e => {
          handleUpdate(e);
        }}
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input readOnly disabled />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Full name"
          rules={[{ required: true, message: "Please input full name" }]}
        >
          <Input placeholder="Input your Full name" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone number"
          rules={[
            {
              pattern: new RegExp(/^0\d{9,10}$/),
              message: "Phone number must be start with 0 and 10 or 11 digits"
            }
          ]}
        >
          <Input placeholder="Input your Phone number" type="number" />
        </Form.Item>

        <Form.Item name="facebook" label="Facebook">
          <Input placeholder="Input your Facebook URL" maxLength={100} />
        </Form.Item>

        <Form.Item name="userTitle" label="Bio">
          <Input placeholder="Bio của bạn" maxLength={100} />
        </Form.Item>

        <Form.Item name="instagram" label="Instagram">
          <Input placeholder="Input your Instagram URL" maxLength={100} />
        </Form.Item>

        <Form.Item name="favoriteCates" label="Favorite category">
          <Select
            showSearch={false}
            size="large"
            mode="multiple"
            placeholder="Select your favorite category"
            allowClear
            options={cates.map((cate: any) => ({
              value: cate._id,
              label: cate.name,
              key: cate._id
            }))}
          />
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 w-[20%] rounded "
          >
            Update
          </button>
        </Form.Item>
      </Form>
    </div>
  );
}
