import React, { useRef, useState } from "react";
import Demo from "../DropDown/DropDown";
import { SendOutlined } from "@ant-design/icons";
// import ReplyComment from "../reply/Reply";
import { Button, Space } from "antd";
import Comment from "../Comment";
import { AnyRecord } from "dns";

function ReplyChild({ RenderList }: any) {
  const data = RenderList;
  return <div>{/* <img src={RenderList[0].srcAvartar}></img> */}</div>;
}

export default ReplyChild;
