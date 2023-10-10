import React from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const items: MenuProps["items"] = [
  {
    label: "1st menu Item",
    key: "0"
  }
];

const Reply = () => (
  <Dropdown menu={{ items }} trigger={["click"]}>
    <a onClick={e => e.preventDefault()}>
      <Space>
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default Reply;
