import { useContext } from "react";
import { LoginUser } from "~/apis/user.api";
import { AuthContext } from "~/contexts/AuthContext";

// export type TUser = {
//   accessToken: string;
//   refreshToken: string;
// };

export const useAuth = () => useContext(AuthContext);

export const getUserData = () => {
  let user;
  if (typeof Storage === "undefined") {
    user = {};
  }
  user = JSON.parse(localStorage.getItem("user") || "{}");
  if (Object.keys(user).length === 0) {
    return null;
  }
  return user;
};

export const setUserData = (user: Partial<LoginUser>) => {
  if (!user || typeof user !== "object") {
    throw new Error("No valid data found");
  }
  if (Object.keys(user).length === 0) {
    throw new Error("No data found");
  }
  if (typeof Storage === "undefined") {
    throw new Error("No valid storage type found");
  }
  localStorage.setItem("user", JSON.stringify(user));
};

export function clearUserData(): void {
  if (typeof Storage === "undefined") return;
  localStorage.removeItem("user");
}

export const getRefreshToken = () => {
  if (typeof Storage === "undefined") return false;
  return JSON.parse(localStorage.getItem("user") || "{}")?.refreshToken;
};

export const getAccessToken = () => {
  if (typeof Storage === "undefined") {
    return new Error("Storage type not valid");
  }
  return JSON.parse(localStorage.getItem("user") || "{}")?.accessToken;
};

export const updateAccessToken = (token: string): void => {
  if (typeof Storage === "undefined") return;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  user.accessToken = token;
  localStorage.setItem("user", JSON.stringify(user));
};

export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  if (!accessToken) return false;
  return true;
};

export function getPayloadFromToken(token: string) {
  if (!token) {
    return {};
  }
  const base64Url = token.split(".")[1] as string;
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}
