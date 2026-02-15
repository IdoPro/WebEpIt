
export interface Reply {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface Memory {
  id: string;
  // Added _id to support MongoDB objects alongside local id
  _id?: string;
  author: string;
  relation: string;
  content: string;
  date: string;
  likes: number;
  replies: Reply[];
}

export enum SectionType {
  HOME = 'home',
  BIO = 'bio',
  MEMORIES = 'memories',
  JUDAISM = 'judaism'
}

export interface JewishText {
  title: string;
  content: string;
  subtext?: string;
}
