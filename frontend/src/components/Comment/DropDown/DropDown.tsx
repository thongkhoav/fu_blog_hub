import React, { useContext, useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, message, Space } from "antd";
import useAxiosPrivate from "~/config/useAxiosPrivate";
import { useAuth } from "~/utils/helpers";

const items: MenuProps["items"] = [
  {
    label: "Edit",
    key: "1"
  },
  {
    label: "Remove",
    key: "2"
  }
];

function DropDown({comment, parentData, updateRenderList, setEdit, Edit}: {comment: any, parentData: any, updateRenderList: any, setEdit: any, Edit: any}){
  const axiosPrivate = useAxiosPrivate();
  const { userGlobal } = useAuth();

  const onClick: MenuProps["onClick"] = async ({ key }) => {

    if(!userGlobal){
      return;
    }
    const res = await axiosPrivate.put(`/api/v1/comment/check/${comment.id}`, {
      userId: userGlobal._id as string,
    });
    const data = res.data.data
    console.log(res)
    
    if(key == "1"){
      if(!data){
        return;
      }
      const list = parentData.map((com: any) => {
        if (com.id == comment.id) {
          //check parent comment
          console.log(com)
          com.editStatus = !com.editStatus;
          setEdit(!Edit);
          return com; 
        } else if(com.children.length > 0) {
         //if parent dont have check child
            let childComment = com.children.map((child: any) =>{
              if(child.id == comment.id){
                child.editStatus = !child.editStatus;
                setEdit(!Edit);
                return child
              }else{
                return child;
              }
            })
            return childComment;
          //paren
        }else{
          return com;
        }
      });
      updateRenderList(list);
      
    }else{
      if(!data){
        return;
      }
      //change status comment
      const confirmed = window.confirm(`Bạn Có Muốn Xóa Bình Luận Này?`);
      if (confirmed) {
        //call api to change status comment
        const res = await axiosPrivate.put(`/api/v1/comment/delete/${comment.id}`);
        const data = res.data.data
   
        const list = parentData.map((com: any) => {
          if (com.id == comment.id) {
            return data;
          } else {
            return com;
            
          }
        });
        updateRenderList(list);
        window.location.reload();
      }

    }  
};
  
  return (
    <Dropdown menu={{ items, onClick }}>
      <a onClick={e => e.preventDefault()}>
        <Space>
          <EllipsisOutlined />
        </Space>
      </a>
    </Dropdown>
  );
}

export default DropDown;
