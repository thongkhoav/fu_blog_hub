import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, IAuthContext } from "./AuthContext";
import {
  clearUserData,
  getAccessToken,
  getRefreshToken,
  getUserData,
  setUserData
} from "~/utils/helpers/auth";
import { loginApi, logoutApi } from "~/apis/user.api";
import { Role } from "~/utils/models/user.model";

interface LocationState {
  from: {
    pathname: string;
  };
}

function AuthProvider({ children }: any) {
  const localAccessToken = getAccessToken() || null;
  const [userGlobal, setUserGlobal] = useState(getUserData());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userGlobal != null) {
      if (userGlobal?.role === Role.ADM) {
        navigate("/admin");
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await loginApi({
        email,
        password
      });
      setUserData(user.data);
      setUserGlobal(user.data);
      console.log(user.data.role);

      if (user.data.role === Role.ADM) {
        navigate("/admin");
        return;
      }
      const origin = (location.state as LocationState)?.from?.pathname || "/home";
      navigate(origin);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    if (userGlobal.role === Role.ADM) {
      navigate("/login");
    }
    clearUserData();
    setUserGlobal(null);

    // Also remove user's refresh token from server
    // await logoutApi(refreshToken); // do not create logout api yet
    // navigate("/login");
  };

  const value = useMemo(
    () => ({
      token: localAccessToken,
      userGlobal,
      setUserGlobal,
      onLogin: handleLogin,
      onLogout: handleLogout
    }),
    [localAccessToken, userGlobal]
  ) as IAuthContext;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
