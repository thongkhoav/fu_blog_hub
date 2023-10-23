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
    <div className="grid grid-cols-12 gap-5 mt-12 w-[1200px]">
      <div className="col-span-3 h-screen mt-[80px] relative">
        <div className="w-full flex items-center justify-center absolute top-[-105px] ">
          <img
            className="w-[100px] h-[100px] rounded-full border border-slate-600"
            src={user?.avatar}
            alt=""
          />
        </div>
        <p className="text-lg font-bold text-center">{user?.fullName}</p>
        <button className="my-4 w-full bg-blue-400 items-center justify-center rounded-md py-2 text-white font-bold ">
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
        <p className="text-center mt-[10px] text-base  font-light ">
          {user?.userTitle || "Chưa có chức danh"}
        </p>
      </div>
      {/* phan ben phai */}
      <div className="col-span-9">
        <div className="mb-4">
          {tabItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`${
                pathname === item.path
                  ? "text-blue-500  border-b-4 border-blue-500"
                  : "text-gray-500"
              } px-3 py-2 hover:bg-gray-100 transition-colors duration-300`}
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
