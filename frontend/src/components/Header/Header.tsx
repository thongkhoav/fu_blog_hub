import React, { useEffect, useState } from "react";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants/paths";
import { useAuth } from "~/utils/helpers/auth";
import { BiPencil, BiSearch } from "react-icons/bi";
import { AiFillBell } from "react-icons/ai";
import { Avatar, Dropdown, MenuProps, Tooltip } from "antd";
import { FiLogOut } from "react-icons/fi";
import { Role } from "~/utils/models/user.model";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { BsJournalCheck, BsListUl } from "react-icons/bs";

const Header = () => {
  const { userGlobal, onLogout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const axiosPrivate = useAxiosPrivate();

  const getNotificationCount = async () => {
    try {
      const { data } = await axiosPrivate.get("/api/v1/notifications/count");
      setNotificationCount(data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getNotificationCount();
  }, []);

  const handleWriteBlog = () => {
    if (userGlobal == null) {
      navigate(userPath(PATH.LOGIN));
    } else {
      navigate(userPath(PATH.WRITE_BLOG));
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1sdasd",
      label: <Link to={userPath(PATH.PROFILE, "me")}>Profile</Link>
    },
    {
      key: "2ertrt",
      label: <span onClick={onLogout}>Logout</span>,
      icon: <FiLogOut />
    }
  ];

  return (
    <header className="flex bg-light justify-between px-10 py-4 w-full h-fit">
      <div className="flex gap-4 items-center">
        <Link className="w-12 h-12" to={userPath(PATH.HOME)}>
          <img
            src="https://gudlogo.com/wp-content/uploads/2019/04/logo-blog-13.png"
            alt="logo"
            className="object-cover w-full h-full"
          />
        </Link>
        <div className="w-[0.5px] h-full bg-gray-200" />
        <Tooltip title="Danh sách bài viết" placement="bottom">
          <Link
            to={userPath(PATH.BLOG)}
            className="text-2xl bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
          >
            <BsListUl />
          </Link>
        </Tooltip>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/notification">
          <div className="relative">
            <AiFillBell className="text-2xl text-gray-600" />
            {notificationCount > 0 && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                {notificationCount}
              </div>
            )}
          </div>
        </Link>
        {userGlobal?.role === Role.MTR && (
          <Tooltip title="Duyệt bài" placement="bottom">
            <Link
              to={userPath(PATH.WAITING_BLOGS)}
              className="bg-gray-100 hover:bg-gray-200 text-lg font-bold p-3 rounded-full flex flex-col items-center cursor-pointer "
            >
              <BsJournalCheck />
            </Link>
          </Tooltip>
        )}
        <Tooltip title="Viết bài" placement="bottom">
          <div
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full flex flex-col items-center cursor-pointer"
            onClick={handleWriteBlog}
          >
            <BiPencil className="text-lg mx-auto" />
          </div>
        </Tooltip>
        {userGlobal ? (
          <div className="flex gap-5 items-center">
            <Tooltip title="Profile" placement="bottom">
              <Link to={userPath(PATH.PROFILE, "me")}>
                <Avatar src={userGlobal.avatar} className="border-slate-600" size={"default"} />
              </Link>
            </Tooltip>
            <Tooltip title="Logout" placement="bottom">
              <FiLogOut onClick={onLogout} className="cursor-pointer" />
            </Tooltip>
          </div>
        ) : (
          <Link
            to={userPath(PATH.LOGIN)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
