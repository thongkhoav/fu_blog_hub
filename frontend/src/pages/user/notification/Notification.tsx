import React, { useEffect, useState } from "react";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);

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
      console.log(data.data);

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
      <h1 className="text-center mb-5">Notifications</h1>
      <div className="w-full max-w-[1000px] mx-auto">
        {notification.map((item, index) => (
          <NotificationItem key={index} notificationItem={item} />
        ))}
      </div>
    </div>
  );
};

export default Notification;

const NotificationItem = (props: any) => {
  const timeAgo = new TimeAgo("en");

  return (
    <div
      className={`border rounded mb-4 p-4 shadow-mdm ${
        props.notificationItem.readed ? "bg-white" : "bg-red-300"
      }`}
    >
      <Link
        to={props.notificationItem.url.includes("/blogs/") && props.notificationItem.url}
        className="flex items-center justify-between mb-2"
      >
        <div className="font-semibold text-lg">Notifications</div>
        <div className="text-gray-600 text-sm">
          <span className="mr-1">{timeAgo.format(new Date(props.notificationItem.createdAt))}</span>
          <span className={`font-semibold `}></span>
        </div>
      </Link>
      <div className="text-gray-800">{props.notificationItem.content}</div>
    </div>
  );
};
