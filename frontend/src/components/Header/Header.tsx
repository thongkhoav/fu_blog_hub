import React, { useEffect } from "react";
import { PATH } from "src/utils/constants/paths";

const Header = () => {
  const handleLogout = () => {
    // logout()
    // history.push(PATH.LOGIN)
  };
  useEffect(() => {}, []);

  return <header className="d-flex bg-light justify-content-between p-3 shadow-sm"></header>;
};

export default Header;
