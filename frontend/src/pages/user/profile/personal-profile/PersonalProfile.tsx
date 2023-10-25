import { Tabs, TabsProps } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants";
import { useEffect, useState } from "react";
import { useAuth } from "~/utils/helpers";
import { BsPersonFillLock } from "react-icons/bs";

const BlogState = {
  PUBLIC: "public",
  REMOVED: "removed",
  WAITING: "waiting",
  DRAFT: "draft",
  REJECTED: "rejected"
};

const tabItems = [
  {
    label: "Trang chủ",
    path: PATH.PROFILE + "/me"
  },
  {
    label: "Bài nháp",
    path: PATH.PROFILE + `/me/${BlogState.DRAFT}`
  },
  {
    label: "Bài đang chờ duyệt",
    path: PATH.PROFILE + `/me/${BlogState.WAITING}`
  },
  {
    label: "Bài bị từ chối",
    path: PATH.PROFILE + `/me/${BlogState.REJECTED}`
  },
  {
    label: "Bookmark",
    path: PATH.PROFILE + "/me/bookmark",
    icon: <BsPersonFillLock />
  },
  {
    label: "Information",
    path: PATH.PROFILE + "/me/information",
    icon: <BsPersonFillLock />
  },
  {
    label: "Series",
    path: PATH.PROFILE + "/me/series"
  }
];

const userTab = [
  {
    label: "Following",
    path: PATH.PROFILE + "/me/following"
  },
  {
    label: "Followers",
    path: PATH.PROFILE + "/me/followers"
  }
];

export default function PersonalProfile() {
  const { pathname } = useLocation();
  const { userGlobal } = useAuth();

  useEffect(() => {}, [pathname]);
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className="mt-12 gap-5 grid grid-cols-12 w-full justify-between">
      <div className="col-span-2">
        <div className="w-full flex items-center justify-center">
          <img
            className="w-[100px] h-[100px] rounded-full border border-slate-600"
            src={userGlobal.avatar}
            alt=""
          />
        </div>
        <p className="text-sm text-center mt-2">{userGlobal.fullName}</p>
        <div className="flex justify-around mt-2">
          <div className="col-span-1 text-center  ">
            <p className="font-medium text-xs">83</p>
            <p className="text-xs">followers</p>
          </div>
          <div className="col-span-1 text-center ">
            <p className="font-medium text-xs">83</p>
            <p className="text-xs">following</p>
          </div>
        </div>
        <p className="text-center text-xs my-3 font-light">Bio của các bạn viết ở đây</p>
        <div className="w-full items-center gap-2 justify-center flex">
          {userTab.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`items-center justify-center border text-xs rounded ${
                pathname === item.path ? "text-blue-500 border-blue-500" : "text-gray-500"
              } px-2 py-1 hover:bg-gray-100 duration-300`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
      {/* phan ben phai */}
      <div className="flex-[3] col-span-10">
        <div className="flex gap-2">
          {tabItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center text-sm gap-1 ${
                pathname === item.path
                  ? "text-blue-500  border-b-4 border-blue-500"
                  : "text-gray-500"
              } px-2 py-1 hover:bg-gray-100 transition-colors duration-300`}
            >
              {item.label}
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
