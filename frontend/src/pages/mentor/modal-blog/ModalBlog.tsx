import { Button, Col, Modal, Row } from "antd";
import "./modal-blog.scss";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import moment from "moment";

export default function ModalBlog({ blogDetail, onClose, ...props }: any) {
  const modalTitle = (
    <Row>
      <Col span={16}>
        {blogDetail.title}
        <span style={{ color: "#00000078", fontSize: "12px", marginLeft: "6px" }}>
          {moment(blogDetail.createdAt).utc().format("DD-MM-YYYY hh:mm:ss")} - {blogDetail.status === "waiting" ? "Chờ duyệt": "Đã từ chối"}
        </span>
      </Col>
      <Col span={8} style={{ textAlign: "right" }}>
        <Button
          className="btn-reject"
          icon={<CloseOutlined />}
          onClick={() => {
            handleReject();
          }}
        >
          Từ chối
        </Button>
        <Button
          className="btn-primary"
          style={{ marginLeft: "6px" }}
          icon={<CheckOutlined />}
          onClick={() => {
            handleAccept();
          }}
        >
          Duyệt
        </Button>
      </Col>
    </Row>
  );

  const handleReject = () => {
    onClose();
  };
  const handleAccept = () => {
    onClose();
  };

  return (
    <>
      <Modal
        closable={false}
        className="modal_container"
        title={modalTitle}
        centered
        width={"70%"}
        onCancel={onClose}
        footer={false}
        {...props}
      >
        <div className="flex overflow-x-hidden mt-[-10px] mb-2">
          {blogDetail &&
            blogDetail.tags?.map((tag: string) => (
              <div
                key={tag}
                className="text-sm text-inherit px-2 py-1 mr-2 rounded-sm bg-[#f2f2f2]"
              >
                {tag}
              </div>
            ))}
        </div>
        <div>{blogDetail.intro}</div>

        <div style={{ textAlign: "center" }}>
          <img src={blogDetail.thumbnail} style={{ height: "600px", margin: "auto" }}></img>
        </div>
      </Modal>
    </>
  );
}
