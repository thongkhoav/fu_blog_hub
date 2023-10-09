import { Card, Col, Row } from "antd";

const Series = () => {
  // cảu tôi thì được sửa
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card hoverable title="Card titleCard contentCard contentCard contentCard content" bordered>
          <p className="line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat tempore minima
            distinctio commodi repudiandae? Qui sit architecto doloremque quaerat beatae.
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-base ">7 bài viết</span>
            <button className=" bg-blue-200 items-center justify-center rounded-sm py-1 px-3">
              Chi tiết
            </button>
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card hoverable title="Card titleCard contentCard contentCard contentCard content" bordered>
          <p className="line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat tempore minima
            distinctio commodi repudiandae? Qui sit architecto doloremque quaerat beatae.
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-base ">7 bài viết</span>
            <button className=" bg-blue-200 items-center justify-center rounded-sm py-1 px-3">
              Chi tiết
            </button>
          </div>
        </Card>
      </Col>
      <Col span={8}>
        <Card hoverable title="Card titleCard contentCard contentCard contentCard content" bordered>
          <p className="line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat tempore minima
            distinctio commodi repudiandae? Qui sit architecto doloremque quaerat beatae.
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-base ">7 bài viết</span>
            <button className=" bg-blue-200 items-center justify-center rounded-sm py-1 px-3">
              Chi tiết
            </button>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Series;
