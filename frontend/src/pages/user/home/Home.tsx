import HighlightBlogs from "./highlight-blogs/HighlightBlogs";
import { BlogItem } from "~/utils/models/blog.model";
import { useState, useEffect } from "react";
import LatestBlogs from "./latest-blogs/LatesBlogs";
import OptionSideHome from "./option-side-home/OptionSideHome";
import ForYouBlogs from "./for-you-blog/ForYouBlogs";
import { useAuth } from "~/utils/helpers";
import useAxiosPrivate from "~/config/useAxiosPrivate";

const thumbnail = require("~/assets/images/home_thumbnail.jpg");

const blogsData: BlogItem[] = [
  {
    _id: "1",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium minus aperiam inventore sunt excepturi doloremque quis rerum ducimus eligendi tenetur.",
    blogCateId: {
      name: "Kinh tế",
      _id: "sadadada1"
    },
    blogSeriesId: "jiherg̃êâ",
    slug: "yrthg",
    thumbnail:
      "https://media.istockphoto.com/id/518954548/photo/open-moleskin-book-with-fountain-pen-on-wood.jpg?s=612x612&w=0&k=20&c=vFTPdHQlk5OJYuh2ShF8TE33NqdVUqdkYosLrxIm87k=",
    numComment: 323,
    numView: 231,
    blogTagIds: [
      { _id: "asdasd", name: "tag1" },
      { _id: "2313", name: "tag2" }
    ],
    createdAt: "sdasad",
    userId: {
      avatar: "https://cdn-icons-png.flaticon.com/512/1995/1995562.png",
      _id: "1a",
      fullName: "Nguyễn Văn A"
    }
  },
  {
    _id: "12135",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. 1",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium minus aperiam inventore sunt excepturi doloremque quis rerum ducimus eligendi tenetur.",
    blogCateId: {
      name: "Kinh tế",
      _id: "sadadada1"
    },
    blogSeriesId: "561489",
    slug: "yrthg",
    thumbnail:
      "https://media.istockphoto.com/id/518954548/photo/open-moleskin-book-with-fountain-pen-on-wood.jpg?s=612x612&w=0&k=20&c=vFTPdHQlk5OJYuh2ShF8TE33NqdVUqdkYosLrxIm87k=",
    numComment: 323,
    numView: 231,
    blogTagIds: [
      { _id: "asdasd", name: "tag1" },
      { _id: "2313", name: "tag2" }
    ],
    createdAt: "sdasad",
    userId: {
      avatar: "https://cdn-icons-png.flaticon.com/512/1995/1995562.png",
      _id: "1a",
      fullName: "Nguyễn Văn A"
    }
  }
];

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
        <HighlightBlogs blogsData={blogsData} />
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
