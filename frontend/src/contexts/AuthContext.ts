import { createContext } from "react";
import { UserInfo } from "~/utils/models/user.model";

export interface IAuthContext {
  token: string;
  onLogin: (loginAccessToken?: string) => void;
  onLogout: () => void;
  user: UserInfo;
}

export const AuthContext = createContext<IAuthContext>({
  token: "",
  user: {
    id: "",
    name: "",
    userRoles: [],
    level: ""
  },
  onLogin: () => {},
  onLogout: () => {}
});
