import axios, { AxiosResponse } from "axios";
import { HOST } from "~/utils/constants";

export interface LoginUser {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "mentor" | "student";
  active: boolean; // account only login at 1 time
  isVerifiedEmail: boolean;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  coverAvatar?: string;
  favoriteCates?: string[];
  phone?: string;
  numBlog?: number;
  numComment?: number;
  numFollower: number;
  numFollowing: number;
  userTitle?: string;
  facebook?: string;
  instagram?: string;
  accessToken: string;
  refreshToken: string;
}

interface AccessTokenRes extends AxiosResponse {
  data: {
    accessToken: string;
  };
}

export const loginApi = async (body: ReqLogin): Promise<UserLoginRes> =>
  await axios.post(`${HOST}/api/v1/users/login`, body);

export const logoutApi = async (accessToken: string, refreshToken: string) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  const data = {
    refreshToken
  };

  return await axios.post(`${HOST}/api/v1/users/logout`, data, { withCredentials: true });
};

export const getAccessTokenApi = async (refreshToken: string): Promise<AccessTokenRes> =>
  await axios.post(`${HOST}/api/v1/users/refresh-token`, {
    refreshToken
  });

export const loginGoogleApi = async (): Promise<UserLoginRes> => {
  const res = await axios.get(`${HOST}/api/auth/google/success`, {
    withCredentials: true
  });
  return res;
};

export const deleteUserApiPath = (id: string) => `${HOST}/api/v1/users/${id}`;
