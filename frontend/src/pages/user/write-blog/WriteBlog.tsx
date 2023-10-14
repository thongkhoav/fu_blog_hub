import { ButtonTitle } from "~/utils/constants/buttonTitle";
import "./write-blog.scss";
import Editor from "./EditorJS";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Divider,
  Space,
  InputRef,
  UploadFile,
  UploadProps,
  Checkbox
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { beforeUpload, getBase64 } from "~/utils/constants/uploadPlugin";
import { Upload } from "antd";
import { HOST } from "~/utils/constants";
import { getBlogTagsApi, getBlogCategoriesApi } from "~/apis/blog.api";
import useAxiosPrivate from "~/config/useAxiosPrivate";
const { v4: uuidv4 } = require("uuid");

const { TextArea } = Input;

interface Props {
  mode?: ButtonTitle.CREATE | ButtonTitle.EDIT;
}

interface Tag {
  name: string;
  numBlog: number;
}

interface Category {
  _id?: string;
  name: string;
  numBlog: number;
}

export default function WriteBlog({ mode = ButtonTitle.CREATE }: Props) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [blogSeries, setBlogSeries] = useState<any[]>([
    { value: "jack", label: "Jack" },
    { value: "lucy", label: "Lucy" },
    { value: "Yiminghe", label: "yiminghe" }
  ]);
  const [blogCategory, setBlogCategory] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const inputNewTagRef = useRef<InputRef>(null);
  const [loadingPostImage, setLoadingPostImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const axiosPrivate = useAxiosPrivate();

  const addNewTag = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (newTag === "") return;
    const newTagObj: Tag = {
      name: newTag,
      numBlog: 0
    };

    setTags([newTagObj, ...tags]);
    setNewTag("");
    setTimeout(() => {
      inputNewTagRef.current?.focus();
    }, 0);
  };

  const onNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };

  const showModal = (value: boolean) => setIsModalOpen(value);

  const handleUploadImage: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoadingPostImage(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoadingPostImage(false);
      });
    }
    const response = info.file.response;
    setImageUrl(response.file.url);
  };

  const handleSaveDraft = () => {
    handleSubmit("draft");
    setIsModalOpen(false);
  };

  const handleSubmit = (status?: string) => {
    const regexH2 = /<h2[^>]*>(.*?)<\/h2>/;
    let title = data.match(regexH2);

    if (!title) {
      const regexH3 = /<h3[^>]*>(.*?)<\/h3>/;
      title = data.match(regexH3);
    }

    if (!title) {
      return toast.error("Vui lòng nhập tiều đề của bạn!!!", toastOption);
    }

    const values = {
      ...form.getFieldsValue(),
      thumbnail: imageUrl,
      contentRaw: data,
      title: title ? title[1] : "",
      status: status || "waiting"
    };

    axiosPrivate
      .post("/api/v1/blogs", values)
      .then(res => {
        setIsModalOpen(false);
        toast.success("Thêm bài viết thành công", toastOption);
      })
      .catch(err => {
        toast.error(err.response.data.message, toastOption);
      });

    form.validateFields().then(values => {
      form.resetFields();
      showModal(false);
    });
  };

  useEffect(() => {
    setEditorLoaded(true);
    const defaultData = "<h1>Tiêu đề ...</h1> <p>Nội dung ...</p>";
    setData(defaultData);
    getAllCategory();
    getAllTag();
  }, []);

  const getAllTag = async () => {
    const res = await getBlogTagsApi();
    const data = res.data.data;
    setTags(data);
  };

  const getAllCategory = async () => {
    const res = await getBlogCategoriesApi();
    const data = res.data.data;
    setBlogCategory(data);
  };

  const uploadButton = (
    <div>
      {loadingPostImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="w-full py-1">
      <div className="container m-auto pt-8 h-full min-h-[600px] justify-between flex-col flex">
        {/* Editor blog */}
        <Editor
          name="description"
          onChange={(data: any) => {
            setData(data);
          }}
          editorLoaded={editorLoaded}
          value={data}
        />

        <div className="w-full h-auto flex justify-center">
          <Button
            onClick={() => showModal(true)}
            className="h-[40px] bg-blue-500 hover:bg-blue-600 text-white px-4 rounded"
          >
            Bước tiếp theo
          </Button>
        </div>

        <Modal
          title="Thông tin khác"
          style={{ maxWidth: "700px" }}
          open={isModalOpen}
          onCancel={() => showModal(false)}
          footer={[
            <Button key="draft" className="h-[40px]" onClick={handleSaveDraft}>
              Lưu bản nháp
            </Button>,
            <Button key="customCancel" className="h-[40px]" onClick={() => showModal(false)}>
              Quay lại
            </Button>,
            <Button key="customOk" form="myForm" htmlType="submit" className="h-[40px]">
              Tạo bài viết
            </Button>
          ]}
        >
          <Form form={form} id="myForm" layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Mô tả bài viết"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả bài viết" }]}
            >
              <TextArea rows={4} maxLength={200} />
            </Form.Item>

            <Form.Item label="Blogseries">
              <Select options={blogSeries} />
            </Form.Item>

            <Form.Item
              label="Danh mục blog"
              name="blogCateId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục cho Blog" }]}
            >
              <Select
                allowClear
                options={blogCategory.map(item => ({
                  label: item.name,
                  value: item._id,
                  key: item._id
                }))}
              />
            </Form.Item>

            <Form.Item label="Tag" name="tags">
              <Select
                mode="multiple"
                placeholder="#Tag"
                dropdownRender={menu => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px", width: "100%" }}>
                      <Input
                        placeholder="Tạo tag mới"
                        ref={inputNewTagRef}
                        value={newTag}
                        onChange={onNewTagChange}
                        style={{ width: "90%" }}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addNewTag}>
                        Add item
                      </Button>
                    </Space>
                  </>
                )}
                options={tags.map(item => ({
                  label: `#${item.name}`,
                  value: item.name,
                  key: uuidv4()
                }))}
              />
            </Form.Item>

            <Form.Item label="Blog Thumbnail">
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={`${HOST}/api/upload`}
                beforeUpload={beforeUpload}
                onChange={handleUploadImage}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ height: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              label="Cài đặt khác"
              name="showComment"
              initialValue={true}
              valuePropName="checked"
            >
              <Checkbox defaultChecked={true}> Hiển thị bình luận</Checkbox>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
