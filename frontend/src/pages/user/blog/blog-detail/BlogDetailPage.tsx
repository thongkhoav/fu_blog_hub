import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { PATH } from "~/utils/constants";
import { BlogDetail, Tag } from "~/utils/models/blog.model";
import { formatDate } from "~/utils/helpers/format";
import BlogInfoSide from "~/components/blog-info-side/BlogInfoSide";
import Comment from "~/components/Comment/Comment";
import axios from "~/config/axios";
import toastOption from "~/utils/constants/toastOption";
import parse from "html-react-parser";
import { toast } from "react-toastify";

// comment được fetch sau
function BlogDetailPage() {
  const { idBlog } = useParams<{ idBlog: string }>();
  const [blogDetail, setBlogDetail] = useState<BlogDetail>();
  // const refBlog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // fetch blog
    (async function () {
      try {
        const { data } = await axios.get("/api/v1/blogs/" + idBlog);
        setBlogDetail(data.data);
      } catch (error: any) {
        toast.error(error.message, toastOption);
      }
    })();
    try {
    } catch (error) {}
  }, [idBlog]);
  return (
    <div className="flex gap-5 px-8">
      {blogDetail && <BlogInfoSide blogDetail={blogDetail} />}
      <div className="flex-[2]">
        <img src={blogDetail?.thumbnail} alt="" className="h-[320px] w-full object-cover mb-6" />
        <h2 className="capitalize text-[#404040] opacity-80 mb-2">
          <span>Thể loại: {blogDetail?.blogCateId.name}</span>
        </h2>
        <div className="mb-3">
          Tag:
          {blogDetail?.blogTagIds.map(tag => (
            <Link
              to={`${PATH.BLOG}?tag=${tag.name}`}
              key={tag._id}
              className="text-sm text-inherit px-3 py-2 mr-3 rounded-sm underline hover:opacity-100 text-gray-800 opacity-80"
            >
              {tag.name}
            </Link>
          ))}
        </div>
        <h1 className="text-[42px] mb-2">{blogDetail?.title}</h1>
        <span className="text-gray-500 mb-4">
          {blogDetail?.createdAt && formatDate(blogDetail.createdAt)}
        </span>
        {/* divider */}
        <div>{blogDetail?.contentRaw && parse(`${blogDetail?.contentRaw}`)}</div>
        {/* content */}
        {/* blog tương tự */}
        <Comment />
      </div>
    </div>
  );
}

export default BlogDetailPage;
