import { Outlet } from "react-router-dom";
import BlogsNav from "~/components/blogs-nav/BlogsNav";
import OptionNav from "~/components/option-nav/OptionNav";

export default function UserViewBlogLayout({ isBlogDetail = false }) {
  return (
    <div className="flex gap-5 justify-between">
      <OptionNav isBlogDetail={isBlogDetail} />
      <div className="flex-[2] bg-gray-400">
        <Outlet />
      </div>
      <BlogsNav />
    </div>
  );
}
