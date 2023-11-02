import React, {useEffect, useState} from "react";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import { PATH, userPath } from "~/utils/constants/paths";
import { useAuth } from "~/utils/helpers/auth";
import { BiSearch } from "react-icons/bi";
import { AiFillBell } from "react-icons/ai";
import { Avatar, Dropdown, MenuProps } from "antd";
import { FiLogOut } from "react-icons/fi";
import { Role } from "~/utils/models/user.model";
import useAxiosPrivate from "~/config/useAxiosPrivate";

const Header = () => {
  const { userGlobal, onLogout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount  , setNotificationCount] = useState<number>(0);
  const axiosPrivate = useAxiosPrivate();

  const getNotificationCount = async () => {
    try {
      const { data } = await axiosPrivate.get("/api/v1/notifications/count");
      setNotificationCount(data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getNotificationCount();
  },[])

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
        <Link to={userPath(PATH.BLOG)} className="font-normal hover:bg-gray-100 py-2 px-4 rounded">
          Danh sách
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to='/notification'>
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
          <Link
            to={userPath(PATH.WAITING_BLOGS)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          >
            Duyệt bài
          </Link>
        )}
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleWriteBlog}
        >
          Viết bài
        </button>
        {userGlobal ? (
          <div>
            <Dropdown menu={{ items }}>
              <Avatar src={userGlobal.avatar} />
            </Dropdown>
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
