import React, { useEffect, useState } from "react";
import type { CascaderProps } from "antd";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select
} from "antd";
import axios from "~/config/axios";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";

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

interface AddSeriesModalProps {
  handleAddSeries: (data: any) => Promise<void>;
}

const AddSeriesModal: React.FC<AddSeriesModalProps> = ({ handleAddSeries }) => {
  const [form] = Form.useForm();

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="addNewSeries"
      onFinish={handleAddSeries}
      initialValues={{}}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          {
            required: true,
            message: "Please enter a title!"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter a description!" }]}
      >
        <Input maxLength={200} />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Series
        </button>
      </Form.Item>
    </Form>
  );
};

export default AddSeriesModal;
