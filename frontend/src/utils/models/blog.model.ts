export interface Category {
  _id: string;
  name: string;
}

export interface Tag {
  _id: string;
  name: string;
}

interface BlogItemAuthor {
  id: string;
  name: string;
  levelColor: string;
  avatar: string;
}

export interface BlogNavItem {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  createAt?: Date;
  author: BlogItemAuthor;
}

export interface BlogItem {
  id: string;
  title: string;
  thumbnail: string;
  author: BlogItemAuthor;
  category: string;
  introduction: string;
  tags: string[];
  views: number;
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
