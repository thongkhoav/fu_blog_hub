/* eslint-disable prettier/prettier */
import { Button, Popover, Select } from "antd";
import React, { useEffect, useState } from "react";
import { BsBookmarkFill, BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "~/config/axios";
import { HOST } from "~/utils/constants";
import { useAuth } from "~/utils/helpers";
import { BlogItem } from "~/utils/models/blog.model";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import moment from "moment";
import { AiOutlineEye } from "react-icons/ai";
import { useStoreContext } from "~/contexts/StoreProvider";
import toastOption from "~/utils/constants/toastOption";
import { BiBookmark } from "react-icons/bi";

const Posts = ({ isEdit = true }: { isEdit?: boolean }) => {
  const { idUser } = useParams();
  const { userGlobal } = useAuth();
  const [blogList, setBlogList] = useState<BlogItem[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const { bookmarkList, setBookmarkList } = useStoreContext();

  const toggleBookmark = async (blogId: string, toRemove: boolean) => {
    try {
      if (toRemove) {
        await axiosPrivate.put(`/api/v1/bookmarks/${blogId}/remove`);
        setBookmarkList((prev: string[]) => prev.filter(id => id !== blogId));
        toast.success("Đã xóa khỏi danh sách bookmark", toastOption);
      } else {
        await axiosPrivate.post(`/api/v1/bookmarks/${blogId}`);
        setBookmarkList((prev: any) => [...prev, blogId]);
        toast.success("Đã thêm vào danh sách bookmark", toastOption);
      }
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const { data } = await axios.get(`${HOST}/api/v1/blogs/user/${idUser || userGlobal?._id}`);
        setBlogList(data.data);
      } catch (error: any) {
        toast.error(error.message);
      }
    })();
  }, [idUser, userGlobal?._id]);

  const handleDeleteBlog = async (id: string) => {
    try {
      const { data } = await axiosPrivate.delete(`${HOST}/api/v1/blogs/${id}`);
      toast.success(data.message);
      setBlogList(prev => prev.filter(blog => blog._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      <div className="flex justify-end">
        <Select
          defaultValue="createdAt"
          size="middle"
          style={{ width: 150 }}
          onChange={handleChange}
          options={[
            { value: "createdAt", label: "Ngày đăng" },
            { value: "mostViews", label: "Nhiều lượt đọc" }
          ]}
        />
      </div>
      <div className="grid grid-cols-12 gap-[15px] mt-4 text-[15px]">
        {blogList.map(blog => (
          <div className="col-span-4 h-auto shadow-lg p-5 rounded-md">
            <div className="flex justify-between">
              <div className="flex-1">
                <img
                  className="w-full h-[180px] rounded-md"
                  src="https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixNavLinkb=rb-1.1.0&q=45&auto=format&w=754&fit=cNavLinkp"
                  alt=""
                />
              </div>
              <div className="w-3 flex flex-col">
                {isEdit && (
                  <Popover
                    content={
                      <div className="flex flex-col">
                        <NavLink to={`/edit-blog/${blog._id}`}>
                          <Button type="primary" className="bg-blue-500">
                            Chỉnh sửa
                          </Button>
                        </NavLink>
                        <NavLink to="#">
                          <Button
                            type="primary"
                            onClick={() => handleDeleteBlog(blog._id)}
                            danger
                            className="w-full"
                          >
                            Xoá
                          </Button>
                        </NavLink>
                      </div>
                    }
                    trigger="click"
                    placement="rightBottom"
                  >
                    <div className=" p-1  cursor-pointer">
                      <BsThreeDotsVertical className="text-xl" />
                    </div>
                  </Popover>
                )}
                {userGlobal && (
                  <span className="text-xl cursor-pointer">
                    {bookmarkList.includes(blog._id) ? (
                      <BsBookmarkFill onClick={() => toggleBookmark(blog._id, true)} />
                    ) : (
                      <BiBookmark onClick={() => toggleBookmark(blog._id, false)} />
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="opacity-50 text-[13px]">6 phút đọc</p>
              <p className="opacity-50 text-[13px]">
                {moment(blog?.createdAt).utc().format("DD/MM/YYYY")}
              </p>
            </div>

            <p className="font-semibold mt-1 line-clamp-2">{blog.title}</p>
            <p className="line-clamp-2">{blog.description}</p>
            <div className="flex items-center mt-1">
              <AiOutlineEye className="text-xl mr-1" />
              <span className="text-[13px]">{blog.numView}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
