/* eslint-disable prettier/prettier */
import { Button, Popover, Select } from "antd";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "~/config/axios";
import { HOST } from "~/utils/constants";
import { useAuth } from "~/utils/helpers";
import { BlogItem } from "~/utils/models/blog.model";
const Posts = () => {
  const { idUser } = useParams();
  const { userGlobal } = useAuth();
  const [blogList, setBlogList] = useState<BlogItem[]>([]);

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

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      <div className="flex justify-end">
        <Select
          defaultValue="lucy"
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
          <div className="col-span-4 h-auto relative">
            <Popover
              content={
                <div className="flex flex-col">
                  <NavLink to="#">
                    <Button type="primary" className="bg-blue-500">
                      Chỉnh sửa
                    </Button>
                  </NavLink>
                  <NavLink to="#">
                    <Button type="primary" danger className="w-full">
                      Xoá
                    </Button>
                  </NavLink>
                </div>
              }
              trigger="click"
              placement="rightBottom"
            >
              <div className="bg-slate-400 p-1 rounded absolute right-2 top-2 cursor-pointer">
                <BsThreeDotsVertical className="text-xl" />
              </div>
            </Popover>
            <img
              className="w-full h-[180px] rounded-md"
              src="https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg?ixNavLinkb=rb-1.1.0&q=45&auto=format&w=754&fit=cNavLinkp"
              alt=""
            />
            <div className="flex items-center justify-between mt-2">
              <p className="opacity-50 text-[13px]">6 phút đọc</p>
              <div className="">
                <i className="fa-regular fa-bookmark mr-3"></i>
                <i className="fa-soNavLinkd fa-elNavLinkpsis-vertical"></i>
              </div>
            </div>

            <p className="font-semibold mt-1 line-clamp-2">{blog.title}</p>
            <p className="line-clamp-2">{blog.description}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="opacity-50 text-[13px]">{blog.createdAt}</p>
              <div className="">
                <i className="fa-regular fa-eye mr-3"></i>
                <span className="text-[13px]">{blog.numView}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
