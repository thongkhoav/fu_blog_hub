import { AxiosResponse } from "axios";

interface ResLoginApi extends AxiosResponse {
  data: {
    access_token: string;
  };
}

export interface UserInfo {
  id: string;
  name: string;
  userRoles: Role[];
  level: string;
}

export enum Role {
  ADM = "admin",
  MTR = "mentor",
  STU = "student"
}
