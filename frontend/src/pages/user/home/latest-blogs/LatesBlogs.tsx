import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { BiBookmark } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FcLikePlaceholder } from "react-icons/fc";
import { BlogItem } from "~/utils/models/blog.model";
import { Link } from "react-router-dom";

export default function LatestBlogs({ latesBlogs }: { latesBlogs: BlogItem[] }) {
  // const [latestBlogs, setLatestBlogs] = useState<BlogItem[]>(latesBlogs);
  console.log('asda', latesBlogs)
  // useEffect(() => {

  // }, []);
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    if (activeSlide < latesBlogs.length - 3) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  const activeSlides = (idx: number) => {
    console.log(activeSlide)
    if (idx === activeSlide || idx === activeSlide + 1 || idx === activeSlide + 2) return true;
    return false;
  };

  return (
    <div  className="w-full grid grid-cols-3 gap-8 px-5 relative" data-carousel="slide">

      {latesBlogs.map((blog: { _id: Key | null | undefined; thumbnail: string | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; numView: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, blogCateId :any,userId : any }, index) => (
        <div
          key={blog._id}
          className={`h-96 flex flex-col flex-[1] box-border ${activeSlides(index) ? "block" : "hidden"}`}
          data-carousel-item
        >
          <img
            src={blog.thumbnail}
            alt="thumbnail"
            className="w-full h-40 object-cover mb-2 rounded-md"
          />
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between">
                <span className="text-sm uppercase">{blog?.blogCateId?.name}</span>
                <span className="text-2xl cursor-pointer">
                  <BiBookmark />
                </span>
              </div>
              <h1 className=" text-xl font-bold mb-2">{blog.title}</h1>
              <p className="text-xs line-clamp-2 text-justify mb-2">{blog.description}</p>
            </div>
            <div>
              {/* user and views */}
              <div className="flex justify-between mb-1">
                <Link to="/profile/123" className="flex items-center gap-3">
                  <img
                    src={blog?.userId?.avatar}
                    alt="avatar author"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold">{blog?.userId?.fullName}</span> 
                </Link>
                <span className="flex items-center text-xs">
                  <AiOutlineEye className="text-xl mr-1" />
                  {blog.numView}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center space-x-4 mt-4">
        <button onClick={prevSlide} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
          </svg>
          <span className="sr-only">Previous</span>
        </button>
        <button onClick={nextSlide} className="bg-blue-500 text-white px-4 py-2 rounded hover-bg-blue-600">
          <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
          </svg>
          <span className="sr-only">Next</span>
        </button>
      </div>

    </div>
  );
}
