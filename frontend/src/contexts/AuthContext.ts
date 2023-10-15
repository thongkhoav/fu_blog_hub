import { createContext } from "react";
import { LoginUser } from "~/apis/user.api";

export interface IAuthContext {
  token: string;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
  userGlobal: LoginUser;
  setUserGlobal: React.Dispatch<any>;
}

export const AuthContext = createContext<IAuthContext>({
  token: "",
  userGlobal: {
    _id: "",
    fullName: "",
    email: "",
    role: "student",
    active: false,
    isVerifiedEmail: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    accessToken: "",
    refreshToken: ""
  },
  setUserGlobal: () => {},
  onLogin: () => {},
  onLogout: () => {}
});
