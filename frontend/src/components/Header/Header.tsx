import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";

const Header = () => {
  const history = useHistory();
  const handleLogout = () => {
    // logout()
    // history.push(PATH.LOGIN)
  };
  useEffect(() => {}, [history]);

  return <header className="d-flex bg-light justify-content-between p-3 shadow-sm"></header>;
};

export default Header;
