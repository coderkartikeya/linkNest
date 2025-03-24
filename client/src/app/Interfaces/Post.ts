interface Post {
    _id: string;
    ownerName: string;
    owner: string;
    content: string;
    date: Date;
    picture?: string;
    createdAt: Date;
    likes?: number;
    comments?: number;
    community:string;
  }

export type {Post};