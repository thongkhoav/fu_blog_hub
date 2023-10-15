import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, IAuthContext } from "./AuthContext";
import {
  clearUserData,
  getAccessToken,
  getRefreshToken,
  getUserData,
  setUserData,
  useAuth
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
type ContextType = {
  bookmarkList: string[];
  setBookmarkList: Dispatch<SetStateAction<string[]>>;
};

export const StoreContext = createContext<ContextType>({
  bookmarkList: [],
  setBookmarkList: () => {}
});

export const useStoreContext = () => useContext(StoreContext);

function StoreProvider({ children }: any) {
  const [bookmarkList, setBookmarkList] = useState<string[]>([]);
  const { userGlobal } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (userGlobal != null) {
      if (userGlobal?.role === Role.MTR || userGlobal?.role === Role.STU) {
        (async function () {
          try {
            const { data } = await axiosPrivate.get(`${HOST}/api/v1/users/bookmark`);
            setBookmarkList(data.data.map((bookmark: any) => bookmark.blogId));
          } catch (error: any) {
            toast.error(error.message, toastOption);
          }
        })();
      }
    }
  }, [userGlobal]);

  return (
    <StoreContext.Provider value={{ bookmarkList, setBookmarkList }}>
      {children}
    </StoreContext.Provider>
  );
}

export default StoreProvider;
