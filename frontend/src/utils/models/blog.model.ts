export interface Category {
  _id: string;
  name: string;
}

export interface Tag {
  _id: string;
  name: string;
}

interface BlogItemAuthor {
  _id: string;
  fullName: string;
  avatar: string;
  slug?: string;
}

export interface BlogNavItem {
  _id: string;
  title: string;
  thumbnail: string;
  blogCateId: { _id: string; name: string };
  createAt?: Date;
  userId: BlogItemAuthor;
}

export interface BlogItem {
  _id: string;
  title: string;
  thumbnail: string;
  userId: BlogItemAuthor;
  blogCateId: { _id: string; name: string };
  description: string;
  blogTagIds: { _id: string; name: string }[];
  numView: number;
  numComment: number;
  slug: string;
  createAt: Date;
}

export interface BlogDetail {
  _id: string;
  title: string;
  blogCateId: { _id: string; name: string };
  blogTagIds: { _id: string; name: string }[];
  description: string;
  createdAt: Date;
  thumbnail: string;
  numView: number;
  contentRaw: string | TrustedHTML;
  tags: { _id: string; name: string }[];
  userId: {
    avatar: string;
    _id: string;
    fullName: string;
  };
}

export interface Comment {}
