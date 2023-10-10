import React from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, message, Space } from "antd";

const onClick: MenuProps["onClick"] = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const items: MenuProps["items"] = [
  {
    label: "Edit",
    key: "1"
  },
  {
    label: "Remove",
    key: "2"
  },
  {
    label: "Report",
    key: "3"
  }
];

const DropDown = () => (
  <Dropdown menu={{ items, onClick }}>
    <a onClick={e => e.preventDefault()}>
      <Space>
        <EllipsisOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default DropDown;
