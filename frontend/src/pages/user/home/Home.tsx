import HighlightBlogs from "./highlight-blogs/HighlightBlogs";
import { BlogItem } from "~/utils/models/blog.model";
import { useState, useEffect } from "react";
import LatestBlogs from "./latest-blogs/LatesBlogs";
import OptionSideHome from "./option-side-home/OptionSideHome";
import ForYouBlogs from "./for-you-blog/ForYouBlogs";
import { useAuth } from "~/utils/helpers";
import useAxiosPrivate from "~/config/useAxiosPrivate";

const thumbnail = require("~/assets/images/home_thumbnail.jpg");

export default function Home() {
  //lỗi

  return (
    <div>
      <div className="relative">
        <img src={thumbnail} alt="thumbnail" className="w-full max-h-96" />
        <div className="absolute flex flex-col gap-1 bottom-16 left-12 text-white p-5 rounded-lg">
          <h1 className="text-3xl font-bold">Nền tảng chia sẻ bài viết dành cho FPTU</h1>
          <p className="text-lg font-medium">Viết để hiểu</p>
          <p className="text-lg font-medium">Chia sẻ để kết nối</p>
        </div>
      </div>
      {/* Nổi bật 4 cái - 3 slide*/}
      <div className="max-w-[1192px] mx-auto">
        <h1>Nổi bật</h1>
        <HighlightBlogs />
        {/* Latest */}
        <h1>Tải lên gần đây</h1>
        <LatestBlogs />
        {/* Dành cho bạn gồm những chủ đề bạn yêu thích */}
        <h1>Dành cho bạn</h1>
        <div className="flex gap-5">
          <div className="flex-[2]">
            {/* danh sách blog theo chủ để đã chọn lúc mới đăng nhập hoặc có thể setting */}
            <ForYouBlogs />
          </div>
          <OptionSideHome />
        </div>
      </div>
    </div>
  );
}
