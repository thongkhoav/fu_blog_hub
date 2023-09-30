import React, { useEffect, useState } from "react";
import MainLayout from "src/layouts/MainLayout";
import { Link } from "react-router-dom";
import { PATH } from "src/utils/constants/paths";

interface ProductItem {
  id: number;
  title: string;
  createdAt: string;
}

// isUserProfile = true thì là profile của mình
const Profile = ({ isUserProfile = false }) => {
  return (
    <div>
      {/* profile gồm home, blog series */}
      {/* home thì chỉ cho thấy public blog */}
      {/* nếu vào profile chính mình thì được edit blog series, xem following, followers, Unpublished blog*/}
      {/* Unpublished blog có thể chọn các option trong dropdown để xem private, banned, waiting */}
    </div>
  );
};

export default Profile;
