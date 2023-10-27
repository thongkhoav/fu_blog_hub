import React, { useState } from "react";
import {
  TagsOutlined,
  BookOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import { GoReport } from "react-icons/go";
import { BsNewspaper } from "react-icons/bs";
import { Avatar, Button, Layout, Menu, Space, Typography, theme } from "antd";
import { Outlet } from "react-router-dom";
import { ADMIN_PATH, adminPath } from "~/utils/constants";
import { Link } from "react-router-dom";
import { AiOutlineComment } from "react-icons/ai";
import Meta from "antd/es/card/Meta";
import { useAuth } from "~/utils/helpers";

const { Sider } = Layout;

interface SideBarItemProps {
  link?: string;
  icon: React.ReactNode;
  label: string;
  parentMenu?: boolean;
  children?: SideBarItemProps[];
}

const items: SideBarItemProps[] = [
  { icon: <UserOutlined />, label: "Users", link: adminPath(ADMIN_PATH.MANAGE_USER) },
  { icon: <TagsOutlined />, label: "Tags", link: adminPath(ADMIN_PATH.MANAGE_TAG) },
  {
    icon: <BookOutlined />,
    label: "Categories",
    link: adminPath(ADMIN_PATH.MANAGE_CATEGORY)
  },
  { icon: <BsNewspaper />, label: "Blogs", link: adminPath(ADMIN_PATH.MANAGE_BLOG) },
  {
    icon: <GoReport />,
    label: "Reports",
    parentMenu: true,
    children: [
      { icon: <UserOutlined />, label: "Users", link: adminPath(ADMIN_PATH.REPORT_USER) },
      {
        icon: <BsNewspaper />,
        label: "Blogs",
        link: adminPath(ADMIN_PATH.REPORT_BLOG, "resolved")
      },
      {
        icon: <AiOutlineComment />,
        label: "Comments",
        link: adminPath(ADMIN_PATH.REPORT_COMMENT)
      }
    ]
  }
];

function AdminLayout() {
  const [openKeys, setOpenKeys] = useState([]);
  const { onLogout } = useAuth();

  const handleSubMenuClick = (key: never) => {
    if (openKeys.includes(key)) {
      // If the submenu is already open, close it
      setOpenKeys(openKeys.filter(k => k !== key));
    } else {
      // If the submenu is closed, open it
      setOpenKeys([...openKeys, key]);
    }
  };
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        <Space style={{ padding: "15px 0 0 28px" }}>
          <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
          <Typography.Text style={{ color: "white" }}>Admin</Typography.Text>
        </Space>
        <Menu theme="dark" mode="inline" defaultOpenKeys={openKeys} style={{ marginTop: "20px" }}>
          {items.map((item, index) =>
            !item.parentMenu ? (
              <Menu.Item key={item.link}>
                <Space>
                  {item.icon}
                  <Link to={item.link!}>{item.label}</Link>
                </Space>
              </Menu.Item>
            ) : (
              <Menu.SubMenu
                key={`sub${index}`}
                title={
                  <Space>
                    {item.icon}
                    <span>{item.label}</span>
                  </Space>
                }
                onTitleClick={() => handleSubMenuClick(`sub${index}` as never)}
              >
                {item.children?.map((child, index) => (
                  <Menu.Item key={child.link}>
                    <Space>
                      {child.icon}
                      <Link to={child.link!}>{child.label}</Link>
                    </Space>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            )
          )}
        </Menu>
        <Button
          type="primary"
          style={{ position: "absolute", bottom: 10, right: 0, left: 0 }}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 220 }}>
        <Outlet />
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
