

// TypeScript Interface for ChatGroupSchema
 interface IChatGroup {
    _id: string;
    name: string; 
    admin: string; 
    members: string[]; 
    createdOn?: Date; 
    updatedOn?: Date; 
    messages?: []; 
    isDeleted?: boolean; 
    ProfilePic?: string; 
}
export type {IChatGroup};
