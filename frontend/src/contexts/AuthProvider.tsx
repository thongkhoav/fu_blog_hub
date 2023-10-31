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
import { HOST, PATH } from "~/utils/constants";
import { toast } from "react-toastify";
import { loginGoogleApi } from "~/apis/user.api";
import { axiosPrivate } from "~/config/axios";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";

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
    try {
      if (userGlobal) {
        return;
      }
      loginGoogleApi()
        .then(res => {
          setUserGlobal(res.data);
          setUserData(res.data);
        })
        .catch(err => {});
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // setUserData(userGlobal === null ? {} : userGlobal);
    if (userGlobal != null) {
      // if (userGlobal?.role === Role.ADM) {
      //   navigate("/admin");
      // }
    }
  }, [userGlobal]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await loginApi({
        email,
        password
      });
      setUserData(user.data);
      setUserGlobal(user.data);

      if (user.data.role === Role.ADM) {
        navigate("/admin");
        return;
      }
      const origin = (location.state as LocationState)?.from?.pathname || PATH.HOME;
      navigate(origin);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi(localAccessToken, getRefreshToken());
      clearUserData();
      setUserGlobal(null);
    } catch (error: any) {
      console.log(error);
    }
    if (userGlobal.role === Role.ADM) {
      navigate("/login");
    }
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
