import React, { useEffect } from "react";
import "./header.scss";
import { Link, useNavigate } from "react-router-dom";
import { PATH, navigateUserTo } from "~/utils/constants/paths";
import { useAuth } from "~/utils/helpers/auth";
import { BiSearch } from "react-icons/bi";
import { Avatar, Dropdown, MenuProps } from "antd";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const { userGlobal, onLogout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {}, []);
  const handleWriteBlog = () => {
    console.log(userGlobal);

    if (userGlobal == null) {
      navigate(navigateUserTo(PATH.LOGIN));
    } else {
      navigate(navigateUserTo(PATH.WRITE_BLOG));
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to={navigateUserTo(PATH.PROFILE)}>Profile</Link>
    },
    {
      key: "2",
      label: <span onClick={onLogout}>Logout</span>,
      icon: <FiLogOut />
    }
  ];

  return (
    <header className="flex bg-light justify-between px-10 py-4 w-full h-fit">
      <div className="flex gap-4 items-center">
        <Link className="w-12 h-12" to={navigateUserTo(PATH.HOME)}>
          <img
            src="https://gudlogo.com/wp-content/uploads/2019/04/logo-blog-13.png"
            alt="logo"
            className="object-cover w-full h-full"
          />
        </Link>
        <div className="w-[0.5px] h-full bg-gray-200" />
        <Link
          to={navigateUserTo(PATH.BLOG)}
          className="font-normal hover:bg-gray-100 py-2 px-4 rounded"
        >
          Danh sách
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <div className="p-2 hover:bg-gray-100 hover:cursor-pointer rounded-sm">
          <BiSearch className="text-2xl " />
        </div>
        <button
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleWriteBlog}
        >
          Đăng bài
        </button>
        {userGlobal ? (
          <div>
            <Dropdown menu={{ items }}>
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
            </Dropdown>
          </div>
        ) : (
          <Link
            to={navigateUserTo(PATH.LOGIN)}
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
