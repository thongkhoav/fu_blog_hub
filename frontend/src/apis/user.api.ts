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
  ban?: {
    bannedReason: Date;
    bannedUntil: Date;
    bannedAt: Date;
  };
  numBlog?: number;
  numComment?: number;
  numFollower?: number;
  numFollowing?: number;
  userTitle?: string;
  facebook?: string;
  instagram?: string;
  accessToken: string;
  refreshToken: string;
}

interface ReqLogin {
  email: string;
  password: string;
}

export interface UserLoginRes extends AxiosResponse {
  data: LoginUser;
}

interface AccessTokenRes extends AxiosResponse {
  data: {
    accessToken: string;
  };
}

export const loginApi = async (body: ReqLogin): Promise<UserLoginRes> =>
  await axios.post(`${HOST}/api/v1/users/login`, body);

export const logoutApi = async (refreshToken: string) =>
  await axios.post(`${HOST}/api/v1/users/logout`, {
    refreshToken
  });

export const getAccessTokenApi = async (refreshToken: string): Promise<AccessTokenRes> =>
  await axios.post(`${HOST}/api/v1/users/refresh-token`, {
    refreshToken
  });

export const loginGoogleApi = async (): Promise<UserLoginRes> => {
  const res = await axios.get(`${HOST}/api/auth/google/success`, {
    withCredentials: true,
  });
  return res;
}