/* eslint-disable prettier/prettier */
import { Button, List, Popover, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { BsBookmarkFill, BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "~/config/axios";
import { HOST, PATH } from "~/utils/constants";
import { useAuth } from "~/utils/helpers";
import { BlogItem } from "~/utils/models/blog.model";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import moment from "moment";
import { AiOutlineEye } from "react-icons/ai";
import { useStoreContext } from "~/contexts/StoreProvider";
import toastOption from "~/utils/constants/toastOption";
import { BiBookmark } from "react-icons/bi";
import TimeAgo from "javascript-time-ago";
// import IMG from "~/assets/images/default_img.pjpg";
import { DEFAULT_IMG } from "~/utils/constants";
import en from "javascript-time-ago/locale/en";
// import readingTime from "reading-time";
TimeAgo.addLocale(en);

const BlogState = {
  PUBLIC: "public",
  REMOVED: "removed",
  WAITING: "waiting",
  DRAFT: "draft",
  REJECTED: "rejected"
};

const Posts = ({ isEdit = true }: { isEdit?: boolean }) => {
  const { idUser } = useParams();
  const { userGlobal } = useAuth();
  const [blogList, setBlogList] = useState<BlogItem[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const [status, setStatus] = useState<string | null>(null);

  // If params is one of the values of BlogState, set status = params
  useEffect(() => {
    const params = location.pathname.split("/")[3];
    const blogStateArr = Object.values(BlogState);
    if (blogStateArr.includes(params)) {
      return setStatus(params);
    }
    return setStatus(null);
  }, [location]);

  useEffect(() => {
    (async function () {
      try {
        // If status is not null, call the API to get blogs by status
        if (status != null) {
          const { data } = await axiosPrivate.get(
            `${HOST}/api/v1/blogs/user/private/${idUser || userGlobal?._id}?status=${status}`
          );
          setBlogList(data.data);
        } else {
          const { data } = await axios.get(
            `${HOST}/api/v1/blogs/user/${idUser || userGlobal?._id}`
          );
          setBlogList(data.data);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [idUser, userGlobal?._id, status]);

  const handleDeleteBlog = async (id: string) => {
    try {
      const { data } = await axiosPrivate.delete(`${HOST}/api/v1/blogs/${id}`);
      toast.success(data.message);
      setBlogList(prev => prev.filter(blog => blog._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="my-2 w-full">
      <List
        grid={{ gutter: 12, column: 4 }}
        dataSource={blogList}
        renderItem={(blog: BlogItem) => (
          <List.Item>{BlogCard(blog, handleDeleteBlog, isEdit)}</List.Item>
        )}
      />
    </div>
  );
};

export default Posts;

const BlogCard = (blog: BlogItem, onDelete: any, isEdit: boolean) => {
  const timeAgo = new TimeAgo("en");
  return (
    <div key={blog._id} className="h-auto relative w-full">
      {isEdit ? (
        <Popover
          content={
            <div className="flex flex-col p-0">
              <NavLink to={`/edit-blog/${blog._id}`}>
                <Button className="text-blue-500 border-none h-fit rounded-none">Edit</Button>
              </NavLink>
              <Popconfirm
                title="Delete blog?"
                description="Are you sure you want to delete this blog?"
                onConfirm={() => onDelete(blog._id)}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true, className: "text-red-500" }}
              >
                <Button danger className=" text-red-500 border-none p-0 h-fit w-full rounded-none">
                  Delete
                </Button>
              </Popconfirm>
            </div>
          }
          trigger="click"
          placement="rightBottom"
        >
          <div className=" p-1 rounded bg-white opacity-60 absolute right-1 top-1 cursor-pointer ant-popover-open">
            <AiOutlineSetting className="text-sm text-black" />
          </div>
        </Popover>
      ) : undefined}
      <img
        className="w-full h-[180px]"
        src={blog.thumbnail ? blog.thumbnail : DEFAULT_IMG}
        alt="blog thumbnail"
      />
      <div className="flex items-center justify-between mt-2">
        {/* <p className="opacity-50 text-[13px]">{readingTime(blog?.contentRaw)?.text}</p> */}
        <div className="">
          <i className="fa-regular fa-bookmark mr-3"></i>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
      </div>
      {BlogState.PUBLIC === blog.status ? (
        <Link
          to={`${PATH.BLOG}/${blog._id}`}
          className="w-1/3 rounded-md overflow-hidden max-h-fit"
        >
          <p className="font-semibold mt-1 line-clamp-2">{blog.title}</p>
        </Link>
      ) : (
        <p className="font-semibold mt-1 line-clamp-2">{blog.title}</p>
      )}
      <p className="line-clamp-2">{blog.description}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="opacity-50 text-[13px]">{timeAgo.format(new Date(blog.createdAt))}</p>
        <div className="flex gap-1 items-center">
          <AiOutlineEye />
          <span className="text-[13px]">{blog.numView}</span>
        </div>
      </div>
    </div>
  );
};
