import { ButtonTitle } from "~/utils/constants/buttonTitle";
import "./write-blog.scss";
import Editor from "./EditorJS";
import {useEffect, useRef, useState} from "react";
import {Button, Form, Input, Modal, Select, Divider, Space, InputRef, UploadFile, UploadProps, Checkbox} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import {RcFile, UploadChangeParam} from "antd/es/upload";
import {beforeUpload, getBase64} from "~/utils/constants/uploadPlugin";
import { Upload } from 'antd';
import {HOST} from "~/utils/constants";
const { TextArea } = Input;

interface Props {
  mode?: ButtonTitle.CREATE | ButtonTitle.EDIT;
}

export default function WriteBlog({ mode = ButtonTitle.CREATE }: Props) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [form] = Form.useForm();
  const [blogSeries, setBlogSeries] = useState<any[]>([
    { value: 'jack', label: 'Jack' },
    { value: 'lucy', label: 'Lucy' },
    { value: 'Yiminghe', label: 'yiminghe' },
  ]);
  const [tags, setTags] = useState(['#jack', '#lucy']);
  const [newTag, setNewTag] = useState('');
  const inputNewTagRef = useRef<InputRef>(null);
  const [loadingPostImage, setLoadingPostImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const addNewTag = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if(newTag === '') return;
    setTags([...tags, '#'+newTag]);
    setNewTag('');
    setTimeout(() => {
      inputNewTagRef.current?.focus();
    }, 0);
  };
  const onNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value);
  };
  const showModal = (value:boolean) => setIsModalOpen(value)

  useEffect(() => {
    setEditorLoaded(true);
    const defaultData = "<h1>Tiêu đề ...</h1> <p>Nội dung ...</p>";
    setData(defaultData);
  }, []);

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoadingPostImage(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoadingPostImage(false);
        setImageUrl(url);
      });
    }
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
          onChange={(data:any) => {
            setData(data);
          }}
          editorLoaded={editorLoaded}
          value={data}
        />

        <div className='w-full h-auto flex justify-center'>
          <Button onClick={() => showModal(true)} className="h-[40px] bg-blue-500 hover:bg-blue-600 text-white px-4 rounded" >
           Bước tiếp theo
          </Button>
        </div>

        <Modal
          title="Thông tin khác"
          style={{ maxWidth: "700px" }}
          open={isModalOpen}
          onCancel={() => showModal(false)}
          footer={[
            <Button key="customCancel" className="h-[40px]" onClick={() => showModal(false)} >
              Quay lại
            </Button>,
            <Button key="ok" className="h-[40px] " >
              Tạo bài viết
            </Button>,
          ]}

        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item label="Mô tả bài viết" >
              <TextArea rows={4} maxLength={6} />
            </Form.Item>

            <Form.Item label="Blogseries" >
              <Select
                options={blogSeries}
              />
            </Form.Item>

            <Form.Item label="Danh mục blog" >
              <Select
                mode="multiple"
                allowClear
                options={blogSeries}
              />
            </Form.Item>

            <Form.Item label="Tag" >
              <Select
                mode="multiple"
                placeholder="#Tag"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px', width: "100%" }}>
                      <Input
                        placeholder="Tạo tag mới"
                        ref={inputNewTagRef}
                        onChange={onNewTagChange}
                        style={{ width: "90%" }}
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addNewTag}>
                        Add item
                      </Button>
                    </Space>
                  </>
                )}
                options={tags.map((item) => ({ label: item, value: item }))}
              />
            </Form.Item>

            <Form.Item label="Blog Thumbnail" >
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={`${HOST}/api/upload`}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ height: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>

            <Form.Item label="Cài đặt khác" >
              <Checkbox>Hiển thị bình luận</Checkbox>
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>
  );
}
