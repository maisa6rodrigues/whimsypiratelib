export type BookType = "ebook" | "audiobook" | "both";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  type: BookType;
  genres: string[];
  themes: string[];
  ebookLink: string;
  audiobookLink: string;
  dateAdded: string;
}

export type SortMode = "alphabetical" | "newest";
export type TypeFilter = "all" | BookType;
