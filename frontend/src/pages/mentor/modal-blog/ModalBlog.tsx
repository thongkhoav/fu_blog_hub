import { Button, Col, Modal, Row } from "antd";
import React from "react";
import "./modal-blog.scss";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
export default function ModalBlog({ blogDetail, onCancel, ...props }: any) {
  const modalTitle = (
    <Row>
      <Col span={6}>
        {blogDetail.title}
        <span style={{ color: "#00000078", fontSize: "12px", marginLeft: "6px" }}>
          {blogDetail.createdAt}
        </span>
      </Col>
      <Col span={18} style={{ textAlign: "right" }}>
        <Button
          className="btn-reject"
          onClick={() => {
            onCancel();
          }}
          icon={<CloseOutlined />}
        >
          Reject
        </Button>
        <Button className="btn-primary" style={{ marginLeft: "6px" }} icon={<CheckOutlined />}>
          Accept
        </Button>
      </Col>
    </Row>
  );
  return (
    <>
      <Modal
        closable={false}
        className="modal_container"
        title={modalTitle}
        centered
        width={"70%"}
        onCancel={onCancel}
        footer={false}
        {...props}
      >
        <div>{blogDetail.intro}</div>
        <div>{blogDetail.status}</div>
        <div style={{ textAlign: "center" }}>
          <img src={blogDetail.thumbnail} style={{ height: "600px", margin: "auto" }}></img>
          <i>Hinh anh</i>
          <div className="h-[2000px]"></div>
        </div>
      </Modal>
    </>
  );
}
