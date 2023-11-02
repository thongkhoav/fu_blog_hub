import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ADMIN_PATH, adminPath } from "~/utils/constants";

function ReportUserLayout() {
  const { pathname } = useLocation();
  const tabItems = [
    {
      label: "Chưa xử lý",
      path: adminPath(ADMIN_PATH.REPORT_USER) + "/unresolved"
    },
    {
      label: "Đã xử lý",
      path: adminPath(ADMIN_PATH.REPORT_USER) + "/resolved"
    }
  ];
  return (
    <div>
      <h1 className="text-center my-4">Danh sách báo cáo người dùng</h1>
      <div className="flex">
        {tabItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex items-center justify-center gap-1 ${
              pathname === item.path ? "text-blue-500  border-b-4 border-blue-500" : "text-gray-500"
            } px-3 py-2 hover:bg-gray-100 transition-colors duration-300`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}

export default ReportUserLayout;
