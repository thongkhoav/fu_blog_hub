import { Button, Modal } from "antd";
import React from "react";
import "./modal-blog.scss";

export default function ModalBlog({ blogDetail, onCancel, ...props }) {
  console.log(blogDetail);

  const modalTitle = (
    <>
      {blogDetail.title}
      <span style={{ color: "#00000078", fontSize: "12px", marginLeft: "6px" }}>
        {blogDetail.createdAt}
      </span>
    </>
  );
  return (
    <>
      <Modal
        className="modal_container"
        title={modalTitle}
        centered
        width={"70%"}
        onCancel={onCancel}
        footer={[
          <Button
            className="btn-reject"
            onClick={() => {
              onCancel();
            }}
          >
            Reject
          </Button>,
          <Button className="btn-primary">Accept</Button>
        ]}
        {...props}
      >
        <div>{blogDetail.id}</div>
        <div>{blogDetail.intro}</div>
        <div>{blogDetail.status}</div>
        <img src={blogDetail.thumbnail}></img>
      </Modal>
    </>
  );
}
