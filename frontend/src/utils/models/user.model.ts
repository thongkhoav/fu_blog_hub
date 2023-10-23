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

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: Role;
  numFollower: number;
  numFollowing: number;
  totalPoint: number;
  facebook: string;
  instagram: string;
  userTitle: string;
  numBlog: number;
  marjorId?: {
    _id: string;
    name: string;
  };
}

export enum Role {
  ADM = "admin",
  MTR = "mentor",
  STU = "student"
}
