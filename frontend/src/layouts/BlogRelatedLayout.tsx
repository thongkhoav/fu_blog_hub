import { Outlet } from "react-router-dom";
import BlogsNav from "~/components/blogs-side/BlogsSide";
import OptionNav from "~/components/option-nav/OptionNav";

export default function BlogRelatedLayout({
  isBlogDetail = false,
  children
}: {
  isBlogDetail?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex mt-5 gap-5 justify-between max-w-[1500px]">
      <OptionNav isBlogDetail={isBlogDetail} />
      <div className="flex-[2] bg-gray-400">{children}</div>
      {isBlogDetail && <BlogsNav />}
    </div>
  );
}
