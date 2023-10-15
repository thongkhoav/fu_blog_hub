export interface BookmarkContext {
  blogId: string;
}

export interface BookmarkBlogItem {
  _id: string;
  createAt?: Date;
  blogId: {
    _id: string;
    title: string;
    thumbnail: string;
    blogCateId: { _id: string; name: string };
    createAt?: Date;
    totalPoint: number;
    numView: number;
    description: string;
    userId: {
      _id: string;
      fullName: string;
      avatar: string;
    };
  };
}
