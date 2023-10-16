import BlogsSide from "~/pages/user/blog/blog-detail/blogs-side/BlogsSide";
import OptionNav from "~/components/blog-info-side/BlogInfoSide";

export default function BlogRelatedLayout({
  isBlogDetail = false,
  children
}: {
  isBlogDetail?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex mx-auto mt-5 gap-5 justify-between max-w-[1200px]">
      {children}
      {/* {isBlogDetail && <BlogsSide />} */}
    </div>
  );
}
