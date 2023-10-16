/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { Avatar, List } from "antd";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { HOST } from "~/utils/constants";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useStoreContext } from "~/contexts/StoreProvider";

export interface Follower {
  _id: string;
  followUserId: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
  };
  creadedAt: string;
}
const Followers = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axiosPrivate.get(`${HOST}/api/v1/users/followers`);
        setFollowers(data.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
  }, [axiosPrivate]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={followers}
      renderItem={(follower: Follower, index) => (
        <List.Item style={{ minWidth: "400px", maxWidth: "50%" }}>
          <List.Item.Meta
            avatar={<Avatar src={follower.userId.avatar} />}
            title={<Link to={`/profile/${follower.userId._id}`}>{follower.userId.fullName}</Link>}
            description={follower.userId.email}
          />
        </List.Item>
      )}
    />
  );
};

export default Followers;
