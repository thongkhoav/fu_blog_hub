import React, { useEffect, useState } from "react";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import vi from "javascript-time-ago/locale/vi";
TimeAgo.addDefaultLocale(vi);

interface NotificationProps {
  readed: boolean;
  content: string;
  createdAt: string;
  url: string;
}

const Notification = () => {
  const [notification, setNotification] = useState<NotificationProps[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const getNotification = async () => {
    try {
      const { data } = await axiosPrivate.get("/api/v1/notifications");
      setNotification(data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <div className="w-full py-5">
      <h1>Danh sách thông báo</h1>
      <div className="w-full">
        {notification.map((item, index) => (
          <NotificationItem key={index} notificationItem={item} />
        ))}
      </div>
    </div>
  );
};

export default Notification;

const NotificationItem = (props: any) => {
  const timeAgo = new TimeAgo("vi-VN");

  return (
    <div
      className={`bg-white border rounded p-4 shadow-mdm ${
        props.notificationItem.readed ? "bg-green-300" : "bg-red-300"
      }`}
    >
      <Link to={props.notificationItem.url.includes("/blogs/") && props.notificationItem.url}>
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-lg">Thông báo</div>
          <div className="text-gray-600 text-sm">
            <span className="mr-1">
              {timeAgo.format(new Date(props.notificationItem.createdAt))}
            </span>
            <span className={`font-semibold `}></span>
          </div>
        </div>
        <div className="text-gray-800">{props.notificationItem.content}</div>
      </Link>
    </div>
  );
};
