import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, IAuthContext } from "./AuthContext";
import {
  TUser,
  clearUserData,
  getAccessToken,
  getRefreshToken,
  setUserData,
  updateAccessToken
} from "~/utils/helpers/auth";
import { getAccessTokenApi, logoutApi } from "~/apis/user.api";

interface LocationState {
  from: {
    pathname: string;
  };
}

const ACCESS_TOKEN_EXPIRES_TIME = 1000 * 60 * 5; // 5 mins

function AuthProvider({ children }: any) {
  const localAccessToken = getAccessToken() || null;
  const refreshToken = getRefreshToken() || null;
  const navigate = useNavigate();
  const location = useLocation();
  const [isFirstMounted, setIsFirstMounted] = useState(true);

  const handleLogin = (userData: Partial<TUser>) => {
    setUserData(userData);
    const origin = (location.state as LocationState)?.from?.pathname || "/home";
    navigate(origin);
  };

  const handleLogout = async () => {
    clearUserData();
    // Also remove user's refresh token from server
    await logoutApi(refreshToken);
    navigate("/login");
  };

  async function updateRefreshtoken() {
    const response = await getAccessTokenApi(refreshToken);

    if (response.status === 200) {
      const { accessToken } = response.data;
      updateAccessToken(accessToken);
    } else {
      clearUserData();
      navigate("/login");
      window.location.reload();
    }
    if (isFirstMounted) {
      setIsFirstMounted(false);
    }
  }

  useEffect(() => {
    if (refreshToken) {
      // Check on the first render
      if (isFirstMounted) {
        updateRefreshtoken();
      }

      // Keep checking after a certain time
      const intervalId = setInterval(() => {
        updateRefreshtoken();
      }, ACCESS_TOKEN_EXPIRES_TIME);
      return () => clearInterval(intervalId);
    }
    return undefined;
  }, [localAccessToken]);

  const value = useMemo(
    () => ({
      token: localAccessToken,
      onLogin: handleLogin,
      onLogout: handleLogout
    }),
    [localAccessToken]
  ) as IAuthContext;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
