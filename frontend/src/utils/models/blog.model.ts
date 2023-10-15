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
  tags: { _id: string; name: string }[];
  numView: number;
  comments: number;
  createAt: Date;
}

export interface BlogDetail {
  id: string;
  title: string;
  content: string;
  introduction: string;
  views: number;
  likes: number;
  comments: number;
  createAt: string;
}
