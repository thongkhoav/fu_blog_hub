import { NavLink, Outlet } from "react-router-dom";
import { GrLocation } from "react-icons/gr";

export default function Profile() {

  return (
    <>

      <div className="grid grid-cols-12 gap-[10px]">

        <div className="col-span-3 h-screen mt-[80px] ml-[30px] relative">
          <div className="w-[100px] h-[100px] rounded-full border border-slate-600 flex items-center justify-center col-span-6 absolute top-[-105px] left-[-30px] right-[0px] m-auto">
            <img className="w-full h-full rounded-full" src="https://photocross.net/wp-content/uploads/2020/03/anh-chan-dung.jpg" alt="" />
          </div>
          <p className="text-lg font-bold">Thạch đi viết thuê blog</p>
          <p className="text-lg font-thin font-['Brush_Script_MT']">@ThachHD</p>
          <div className="grid grid-cols-1 mr-[30px] mt-[10px]" >
            <button className="max-w-[100%] h-[30px] bg-blue-200 items-center justify-center  ">Theo dõi</button>
          </div>
          <div className="grid grid-cols-3 mt-[10px]" >
            <div className="col-span-1 text-center font-medium ">
              <p>83</p>
              <p>follower</p>
            </div>
            <div className="col-span-1 text-center font-medium">
              <p>1023</p>
              <p>following</p>
            </div>
            <div className="col-span-1 text-center font-medium">
              <p>27</p>
              <p>stars</p>
            </div>
          </div>
          <div className="text-center mt-[10px]">
            <p className="text-2xl  font-light font-['Brush_Script_MT']">Bio của các bạn viết ở đây</p>
          </div>
          <div>
          </div>
          <p className="text-base mt-[20px]">Địa chỉ ở đây</p>
          <p className="text-base mt-[10px]">Trường học ở đây</p>
          <p className="text-base mt-[10px]">Nghề nghiệp ở đây</p>
        </div>
        {/* phan ben phai */}
        <div className="col-span-9 bg-gray-300 ">
          <div className="grid grid-cols-12">
            <div className="col-span-9">
            <ul className="flex gap-[50px] text-[15px]">
                <NavLink to="/profile">
                  <i className="fa-solid fa-pen-nib mr-2"></i>Bài viết
                </NavLink>
                <NavLink to="/profile/series">
                  <i className="fa-brands fa-deskpro mr-2"></i>Series
                </NavLink>
                <NavLink to='/profile/comment'>
                  <i className="fa-solid fa-comment-dots mr-2"></i>Bình luận
                </NavLink>
                <NavLink to='/profile/following'>
                  <i className="fa-regular fa-square-check mr-2"></i>Following
                </NavLink>
                <NavLink to='/profile/follower'>
                  <i className="fa-regular fa-square-check mr-2"></i>Follower
                </NavLink>
                <NavLink to='/profile/love'>
                  <i className="fa-regular fa-heart mr-2"></i>Love
                </NavLink>
              </ul>
            </div>
            <div className="col-span-4"></div>
          </div>
          <div className="grid grid-cols-12 mt-4">
            <select className="w-[150px] col-span-6 bg-gray-400">
              <option>Theo thời gian</option>
              <option>Theo thời gian</option>
              <option>Theo thời gian</option>
              <option>Theo thời gian</option>
            </select>
            <div className="col-span-6 text-center">
              <i className="fa-solid fa-grip mr-[20px]"></i>
              <span>Chế độ xem lưới</span>
            </div>
          </div>
        <Outlet></Outlet>
        </div>
      </div>

    </>
  )
}
