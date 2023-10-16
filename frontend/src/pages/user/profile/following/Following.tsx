/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, List } from "antd";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { HOST } from "~/utils/constants";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useStore } from "react-redux";
import { useStoreContext } from "~/contexts/StoreProvider";

export interface Follow {
  _id: string;
  userId: string;
  followUserId: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
  };
  creadedAt: string;
}

const Following = () => {
  const [followings, setFollowings] = useState<Follow[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { setFollowingList } = useStoreContext();

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axiosPrivate.get(`${HOST}/api/v1/users/followings`);
        setFollowings(data.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
  }, [axiosPrivate]);

  const unFollowUser = async (userId: string) => {
    try {
      const { data } = await axiosPrivate.delete(`${HOST}/api/v1/users/${userId}/unfollow`);
      setFollowings((prev: any) => prev.filter((user: any) => user.followUserId._id !== userId));
      setFollowingList(prev => prev.filter(id => id !== userId));
      toast.success(data.message, toastOption);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={followings}
      renderItem={(follow: Follow, index) => (
        <List.Item style={{ minWidth: "400px", maxWidth: "50%" }}>
          <List.Item.Meta
            avatar={<Avatar src={follow.followUserId.avatar} />}
            title={<Link to={"asds"}>{follow.followUserId.fullName}</Link>}
            description={follow.followUserId.email}
          />
          <button>
            <span
              className="text-2xl cursor-pointer text-red-600"
              onClick={() => unFollowUser(follow.followUserId._id)}
            >
              <RxCross2 />
            </span>
          </button>
        </List.Item>
      )}
    />
  );
};

export default Following;
