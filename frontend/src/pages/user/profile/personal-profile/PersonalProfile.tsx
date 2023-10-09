import { Tabs, TabsProps } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants";
import Posts from "../Posts";
import { useEffect, useState } from "react";
import Series from "../Series";

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
    path: PATH.PROFILE + "/me/following"
  },
  {
    label: "Followers",
    path: PATH.PROFILE + "/me/followers"
  },
  {
    label: "Bookmark",
    path: PATH.PROFILE + "/me/bookmark"
  }
];

export default function PersonalProfile() {
  const { pathname } = useLocation();
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className="grid grid-cols-12 gap-5 mt-12">
      <div className="col-span-3 h-screen mt-[80px] relative">
        <div className="w-[100px] h-[100px] rounded-full border border-slate-600 flex items-center justify-center col-span-6 absolute top-[-105px] left-[-30px] right-[0px] m-auto">
          <img
            className="w-full h-full rounded-full"
            src="https://photocross.net/wp-content/uploads/2020/03/anh-chan-dung.jpg"
            alt=""
          />
        </div>
        <p className="text-lg font-bold">Thạch đi viết thuê blog</p>
        <p className="text-lg font-thin font-['Brush_Script_MT']">@ThachHD</p>
        <button className="my-4 w-full bg-blue-200 items-center justify-center rounded-md py-2">
          Theo dõi
        </button>
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
        <p className="text-center mt-[10px] text-2xl  font-light font-['Brush_Script_MT']">
          Bio của các bạn viết ở đây
        </p>
      </div>
      {/* phan ben phai */}
      <div className="col-span-9">
        <div>
          {tabItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`${pathname === item.path ? "text-blue-500" : "text-gray-500"} px-3 py-2`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
