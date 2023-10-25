import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "~/config/axios";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useStoreContext } from "~/contexts/StoreProvider";
import { HOST, PATH, userPath } from "~/utils/constants";
import toastOption from "~/utils/constants/toastOption";
import { UserProfile } from "~/utils/models/user.model";

const genTabItems = (userId: string) => {
  return [
    {
      label: "Trang chủ",
      path: userPath(PATH.PROFILE, userId)
    },
    {
      label: "Series",
      path: userPath(PATH.PROFILE, userId) + "/series"
    }
  ];
};

export default function Profile() {
  const { idUser } = useParams();
  const { pathname } = useLocation();
  const [user, setUser] = useState<UserProfile>();
  const [tabItems, setTabItems] = useState<{ label: string; path: string }[]>([]);
  const { followingList, setFollowingList } = useStoreContext();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setTabItems(genTabItems(idUser!));
    (async function () {
      try {
        const { data } = await axios.get(`${HOST}/api/v1/users/basic/${idUser}`);
        setUser(data.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
  }, [idUser]);

  const followUser = async () => {
    try {
      const { data } = await axiosPrivate.post(`${HOST}/api/v1/users/${idUser}/follow`);
      setFollowingList(prev => [...prev, idUser!]);
      toast.success(data.message, toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  const unFollowUser = async () => {
    try {
      const { data } = await axiosPrivate.delete(`${HOST}/api/v1/users/${idUser}/unfollow`);
      setFollowingList(prev => prev.filter(id => id !== idUser));
      toast.success(data.message, toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  return (
    <div className="mt-12 gap-5 grid grid-cols-12 w-full justify-between">
      <div className="col-span-2 min-w-[200px]">
        <div className="w-full flex items-center justify-center">
          <img
            className="w-[100px] h-[100px] rounded-full border border-slate-600"
            src={user?.avatar}
            alt=""
          />
        </div>
        <p className="text-sm text-center mt-2">{user?.fullName}</p>

        <div className="flex justify-around mt-2">
          <div className="col-span-1 text-center  ">
            <p className="font-medium text-xs">{user?.numFollower || 0}</p>
            <p className="text-xs">followers</p>
          </div>
          <div className="col-span-1 text-center ">
            <p className="font-medium text-xs">{user?.numFollowing || 0}</p>
            <p className="text-xs">following</p>
          </div>
        </div>
        <button
          className="w-full hover:opacity-70 mt-3 border border-blue-500 text-blue-500 items-center 
        text-xs rounded justify-center py-1"
        >
          {followingList.includes(idUser!) ? (
            <span onClick={unFollowUser}>Bỏ theo dõi</span>
          ) : (
            <span onClick={followUser}>Theo dõi</span>
          )}
        </button>
        <div className="grid grid-cols-3 mt-[10px]">
          <div className="col-span-1 text-center  ">
            <p className="font-medium">{user?.numFollower || 0}</p>
            <p className="text-sm">followers</p>
          </div>
          <div className="col-span-1 text-center ">
            <p className="font-medium">{user?.numFollowing || 0}</p>
            <p className="text-sm">following</p>
          </div>
          <div className="col-span-1 text-center">
            <p className="font-medium">{user?.totalPoint || 0}</p>
            <p className="text-sm">điểm</p>
          </div>
        </div>
        <p className="text-center text-xs my-3 font-light">
          {user?.userTitle || "Chưa có chức danh"}
        </p>
        <div className="flex p-3 justify-center gap-4 items-center">
          {user?.instagram && (
            <a href={user?.instagram}>
              <img
                src="/image/instagram.png"
                alt=""
                className="w-10 h-10 rounded cursor-pointer hover:opacity-80"
              />
            </a>
          )}
          {user?.facebook && (
            <a href={user?.facebook}>
              <img
                src="/image/facebook.png"
                alt=""
                className="w-8 h-8 rounded cursor-pointer hover:opacity-80"
              />
            </a>
          )}
        </div>
      </div>
      {/* phan ben phai */}
      <div className="col-span-10">
        <div className="flex gap-2">
          {tabItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-center text-sm gap-1 ${
                pathname === item.path
                  ? "text-blue-500  border-b-4 border-blue-500"
                  : "text-gray-500"
              } px-2 py-1 hover:bg-gray-100 transition-colors duration-300`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
}
