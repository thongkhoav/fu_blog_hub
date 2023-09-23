import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "src/components/Header/Header";
import SideNav from "src/components/SideNav/SideNav";

export default function AdminLayout() {
  return (
    <div className="wrapper d-flex align-items-stretch">
      <SideNav />
      <main className="flex-grow-1 mw-100 overflow-auto min-vh-100">
        {/* header */}
        <Outlet />
      </main>
    </div>
  );
}
