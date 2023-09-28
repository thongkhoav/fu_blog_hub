import React, { useEffect } from "react";
import "./header.scss";
import { Link } from "react-router-dom";
import { PATH, navigateUserTo } from "~/utils/constants/paths";
import { useAuth } from "~/utils/helpers/auth";
import { BiSearch } from "react-icons/bi";

const Header = () => {
  const { user } = useAuth();
  const handleLogout = () => {};
  useEffect(() => {}, []);

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
        <Link
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          to={navigateUserTo(PATH.WRITE_BLOG)}
        >
          Đăng bài
        </Link>
        <Link
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          to={navigateUserTo(PATH.WRITE_BLOG)}
        >
          Đăng nhập
        </Link>
      </div>
    </header>
  );
};

export default Header;
