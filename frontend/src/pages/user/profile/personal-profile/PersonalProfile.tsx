import { Tabs, TabsProps } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants";
import { useEffect, useState } from "react";
import { useAuth } from "~/utils/helpers";
import { BsPersonFillLock } from "react-icons/bs";

const tabItems = [
  {
    label: "Trang chủ",
    path: PATH.PROFILE + "/me"
  },
  {
    label: "Series",
    path: PATH.PROFILE + "/me/series"
  },
  {
    label: "Following",
    path: PATH.PROFILE + "/me/following",
    icon: <BsPersonFillLock />
  },
  {
    label: "Followers",
    path: PATH.PROFILE + "/me/followers",
    icon: <BsPersonFillLock />
  },
  {
    label: "Bookmark",
    path: PATH.PROFILE + "/me/bookmark",
    icon: <BsPersonFillLock />
  },
  {
    label: "Information",
    path: PATH.PROFILE + "/me/information"
    // icon: <BsPersonFillLock />
  }
];

export default function PersonalProfile() {
  const { pathname } = useLocation();
  const { userGlobal } = useAuth();

  useEffect(() => {
    // console.log(userGlobal);
  }, [pathname]);
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className="flex gap-5 mt-12 w-[1200px] justify-between">
      <div className="flex-1 h-screen mt-[80px] relative">
        <div className="w-full flex items-center justify-center absolute top-[-105px] ">
          <img
            className="w-[100px] h-[100px] rounded-full border border-slate-600"
            src={userGlobal.avatar}
            alt=""
          />
        </div>
        <p className="text-lg font-bold text-center">{userGlobal.fullName}</p>
        <div className="grid grid-cols-3 mt-[10px]">
          <div className="col-span-1 text-center  ">
            <p className="font-medium">83</p>
            <p className="text-sm">followers</p>
          </div>
          <div className="col-span-1 text-center ">
            <p className="font-medium">83</p>
            <p className="text-sm">following</p>
          </div>
          <div className="col-span-1 text-center">
            <p className="font-medium">83</p>
            <p className="text-sm">điểm</p>
          </div>
        </div>
        <p className="text-center mt-[10px] text-base  font-light ">Bio của các bạn viết ở đây</p>
      </div>
      {/* phan ben phai */}
      <div className="flex-[3]">
        <div className="flex">
          {tabItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center gap-1 ${
                pathname === item.path
                  ? "text-blue-500  border-b-4 border-blue-500"
                  : "text-gray-500"
              } px-3 py-2 hover:bg-gray-100 transition-colors duration-300`}
            >
              {item.label}
              {item.icon && <span className="text-xl">{item.icon}</span>}
            </NavLink>
          ))}
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
