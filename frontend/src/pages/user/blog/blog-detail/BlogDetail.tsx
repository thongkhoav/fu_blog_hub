import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/MainLayout";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { PATH } from "~/utils/constants";
import { Tag } from "~/utils/models/blog.model";
import { formatDate } from "~/utils/helpers/format";
import BlogInfoSide from "~/components/blog-info-side/BlogInfoSide";

interface BlogDetail {
  id: string;
  title: string;
  category: string[];
  createdAt: Date;
  thumbnail: string;
  views: number;
  tags: Tag[];
  author: {
    avatar: string;
    id: string;
    levelColor: string;
    name: string;
  };
}

const data: BlogDetail = {
  id: "1",
  title: "Một Năm Trên Spiderum: Cuộc Hành Trình Viết Lách và Kinh Nghiệm Sưu Tầm",
  category: ["Kinh tế", "Công nghệ"],
  thumbnail:
    "https://media.istockphoto.com/id/518954548/photo/open-moleskin-book-with-fountain-pen-on-wood.jpg?s=612x612&w=0&k=20&c=vFTPdHQlk5OJYuh2ShF8TE33NqdVUqdkYosLrxIm87k=",
  views: 231,
  tags: [
    { _id: "3422", name: "tag1 asdasd" },
    { _id: "657", name: "tag2rttyr ty" },
    { _id: "6846", name: "tag3" },
    { _id: "dhojg", name: "tag4" }
  ],
  createdAt: new Date(),
  author: {
    avatar: "https://cdn-icons-png.flaticon.com/512/1995/1995562.png",
    id: "1a",
    levelColor: "#FF0000",
    name: "Nguyễn Văn A"
  }
};

// comment được fetch sau
function BlogDetail() {
  const { idBlog } = useParams<{ idBlog: string }>();
  const [blogDetail, setBlogDetail] = useState<BlogDetail>(data);
  useEffect(() => {
    // fetch blog
    try {
    } catch (error) {}
  }, [idBlog]);
  return (
    <div className="flex gap-5 px-8">
      <BlogInfoSide />
      <div className="flex-[2]">
        <img src={blogDetail.thumbnail} alt="" className="h-[320px] w-full object-cover mb-6" />
        <h2 className="capitalize text-[#404040] opacity-80 mb-2">
          <span>Thể loại: {blogDetail.category[0]}</span>
          {blogDetail.category.slice(1).map(cate => (
            <span> - {cate}</span>
          ))}
        </h2>
        <div className="mb-3">
          Tag:
          {blogDetail.tags.map(tag => (
            <Link
              to={`${PATH.BLOG}?tag=${tag.name}`}
              key={tag._id}
              className="text-sm text-inherit px-3 py-2 mr-3 rounded-sm underline hover:opacity-100 text-gray-800 opacity-80"
            >
              {tag.name}
            </Link>
          ))}
        </div>
        <h1 className="text-[42px] mb-2">{blogDetail.title}</h1>
        <span className="text-gray-500 mb-4">{formatDate(blogDetail.createdAt)}</span>
        {/* divider */}
        {/* content */}
        {/* blog tương tự */}
        {/* comment */}
      </div>
    </div>
  );
}

export default BlogDetail;
