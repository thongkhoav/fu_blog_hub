import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { useAuth } from "~/utils/helpers/auth";
import { Role } from "~/utils/models/user.model";
import { HOST, PATH } from "~/utils/constants";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import useAxiosPrivate from "~/config/useAxiosPrivate";

type ContextType = {
  bookmarkList: string[];
  setBookmarkList: Dispatch<SetStateAction<string[]>>;
  followingList: string[];
  setFollowingList: Dispatch<SetStateAction<string[]>>;
};

export const StoreContext = createContext<ContextType>({
  bookmarkList: [],
  setBookmarkList: () => {},
  followingList: [],
  setFollowingList: () => {}
});

export const useStoreContext = () => useContext(StoreContext);

function StoreProvider({ children }: any) {
  const [bookmarkList, setBookmarkList] = useState<string[]>([]);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const { userGlobal } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (userGlobal != null) {
      if (userGlobal?.role === Role.MTR || userGlobal?.role === Role.STU) {
        (async function () {
          try {
            const { data } = await axiosPrivate.get(`${HOST}/api/v1/users/bookmark`);
            setBookmarkList(data.data.map((bookmark: any) => bookmark.blogId));

            const { data: resdata } = await axiosPrivate.get(`${HOST}/api/v1/users/followings`);
            setFollowingList(resdata.data.map((follow: any) => follow.followUserId._id));
          } catch (error: any) {
            toast.error(error.message, toastOption);
          }
        })();
      }
    }
  }, [userGlobal]);

  return (
    <StoreContext.Provider
      value={{ bookmarkList, setBookmarkList, followingList, setFollowingList }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export default StoreProvider;
