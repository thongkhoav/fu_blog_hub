import axios, { AxiosResponse } from "axios";
import { HOST } from "~/utils/constants";

interface User {
  id: number;
  username: string;
  fullname: string;
  access_token: string;
  refresh_token: string;
}

interface ReqLogin {
  username: string;
  password: string;
}

interface UserLoginRes extends AxiosResponse {
  data: User;
}

interface AccessTokenRes extends AxiosResponse {
  data: {
    accessToken: string;
  };
}

export const loginApi = async (body: ReqLogin): Promise<UserLoginRes> =>
  await axios.post(`${HOST}/api/user/login`, body);

export const logoutApi = async (refreshToken: string) =>
  await axios.post(`${HOST}/api/user/logout`, {
    refreshToken
  });

export const getAccessTokenApi = async (refreshToken: string): Promise<AccessTokenRes> =>
  await axios.post(`${HOST}/api/user/refresh-token`, {
    refreshToken
  });
