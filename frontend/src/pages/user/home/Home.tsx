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
          <h1 className="text-3xl font-bold">A blogging platform for FPTU community</h1>
          <p className="text-lg font-medium">Post to understand</p>
          <p className="text-lg font-medium">Sharing to connect</p>
        </div>
      </div>
      {/* Featured 4 items - 3 slides*/}
      <div className="max-w-[1192px] mx-auto">
        <h1 className="font-medium">Featured</h1>
        <HighlightBlogs />
        {/* Latest */}
        <h1 className="font-medium">Recently uploaded</h1>
        <LatestBlogs />
        {/* For you including your favorite topics */}
        <h1 className="font-medium">For you</h1>
        <div className="flex gap-5">
          <div className="flex-[2]">
            {/* list of blogs by topics selected at initial login or via settings */}
            <ForYouBlogs />
          </div>
          <OptionSideHome />
        </div>
      </div>
    </div>
  );
}
