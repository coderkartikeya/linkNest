
interface Message{
    _id:string,
    message:string,
    date:Date,
    user:string,
    username:string,
    image:string | File,
    groupId:string;
}

export type {Message};