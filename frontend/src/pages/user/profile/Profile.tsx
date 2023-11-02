import { Modal, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { MdOutlineReportProblem } from "react-icons/md";
import { Link, useLocation, useParams } from "react-router-dom";
import { NavLink, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { reportApiPath } from "~/apis/blog.api";
import { LoginUser } from "~/apis/user.api";
import axios from "~/config/axios";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useStoreContext } from "~/contexts/StoreProvider";
import { HOST, PATH, userPath } from "~/utils/constants";
import toastOption from "~/utils/constants/toastOption";
import { useAuth } from "~/utils/helpers";
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
  const { setUserGlobal } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");

  const handleReportBlog = async () => {
    if (!userGlobal) {
      toast.error("Bạn cần đăng nhập để report", toastOption);
      return;
    }

    if (!reportContent) return toast.error("Vui lòng nhập lý do báo cáo bài viết", toastOption);

    try {
      axiosPrivate
        .post(reportApiPath, {
          content: reportContent,
          objectId: idUser,
          type: "user"
        })
        .then(res => {
          setIsModalOpen(false);
          toast.success("Report tài khoản thành công", toastOption);
        })
        .catch(err => {
          toast.error(err.response.data.message, toastOption);
        });
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

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
  }, [idUser, followingList]);

  const followUser = async () => {
    try {
      const { data } = await axiosPrivate.post(`${HOST}/api/v1/users/${idUser}/follow`);
      setFollowingList(prev => [...prev, idUser!]);
      setUserGlobal((prev: LoginUser) => ({ ...prev, numFollower: prev.numFollower + 1 }));
      toast.success(data.message, toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  const unFollowUser = async () => {
    try {
      const { data } = await axiosPrivate.delete(`${HOST}/api/v1/users/${idUser}/unfollow`);
      setFollowingList(prev => prev.filter(id => id !== idUser));
      setUserGlobal((prev: any) => ({ ...prev, numFollowing: prev.numFollowing - 1 }));
      toast.success(data.message, toastOption);
    } catch (error: any) {
      console.log(error);

      toast.error(error.message, toastOption);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-12 gap-5 grid grid-cols-12 w-full justify-between">
      <div className="col-span-2 min-w-[200px]">
        <Modal
          title="Báo cáo tài khoản"
          open={isModalOpen}
          onOk={handleReportBlog}
          onCancel={handleCancel}
          okButtonProps={{ disabled: !reportContent, className: "bg-blue-500" }}
        >
          <TextArea
            rows={4}
            placeholder="Lý do báo cáo"
            maxLength={200}
            onChange={e => setReportContent(e.target.value)}
          />
        </Modal>
        <div className="w-full flex items-center justify-center relative">
          <img
            className="w-[100px] h-[100px] rounded-full border border-slate-600"
            src={user?.avatar}
            alt=""
          />
          <Tooltip title="Report user">
            <MdOutlineReportProblem
              className="text-xl cursor-pointer absolute bottom-2 right-2"
              onClick={showModal}
            />
          </Tooltip>
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
