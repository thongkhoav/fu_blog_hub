import OptionNav from "~/components/blog-info-side/BlogInfoSide";
import HighlightBlogs from "./highlight-blogs/HighlightBlogs";
import { BlogItem } from "~/utils/models/blog.model";
import { useState } from "react";
import LatestBlogs from "./latest-blogs/LatesBlogs";
import OptionSideHome from "./option-side-home/OptionSideHome";

const thumbnail = require("~/assets/images/home_thumbnail.jpg");

const blogsData: BlogItem[] = [
  {
    id: "1",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. 1",
    introduction:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium minus aperiam inventore sunt excepturi doloremque quis rerum ducimus eligendi tenetur.",
    category: "Kinh tế",
    thumbnail:
      "https://media.istockphoto.com/id/518954548/photo/open-moleskin-book-with-fountain-pen-on-wood.jpg?s=612x612&w=0&k=20&c=vFTPdHQlk5OJYuh2ShF8TE33NqdVUqdkYosLrxIm87k=",
    comments: 323,
    views: 231,
    tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9"],
    createAt: new Date(),
    author: {
      avatar: "https://cdn-icons-png.flaticon.com/512/1995/1995562.png",
      id: "1a",
      levelColor: "#FF0000",
      name: "Nguyễn Văn A"
    }
  },
  {
    id: "2",
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. 2",
    introduction:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium minus aperiam inventore sunt excepturi doloremque quis rerum ducimus eligendi tenetur.",
    category: "Công nghệ",
    thumbnail:
      "https://media.istockphoto.com/id/518954548/photo/open-moleskin-book-with-fountain-pen-on-wood.jpg?s=612x612&w=0&k=20&c=vFTPdHQlk5OJYuh2ShF8TE33NqdVUqdkYosLrxIm87k=",
    tags: ["tag1", "tag2", "tag3"],
    comments: 531,
    views: 458,
    createAt: new Date(),
    author: {
      avatar: "https://cdn-icons-png.flaticon.com/512/1995/1995562.png",
      id: "1a",
      levelColor: "#FF0000",
      name: "Nguyễn Văn B"
    }
  }
];

export default function Home() {
  const [highlightBlogs, setHighlightBlogs] = useState<BlogItem[]>(blogsData);
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
        <HighlightBlogs blogsData={highlightBlogs} />
        {/* Latest */}
        <h1>Tải lên gần đây</h1>
        <LatestBlogs blogsData={highlightBlogs} />
        {/* Dành cho bạn gồm những chủ đề bạn yêu thích */}
        <h1>Dành cho bạn</h1>
        <div className="flex gap-5">
          <div className="flex-[2] bg-slate-300 h-80">
            {/* danh sách blog theo chủ để đã chọn lúc mới đăng nhập hoặc có thể setting */}
          </div>
          <OptionSideHome />
        </div>
      </div>
    </div>
  );
}
