import mongoose from "mongoose";

const message= new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    groupId:{type:mongoose.Schema.Types.ObjectId,ref:'ChatGroup',required:true},
    username:{type:String,required:true},
    message:{type:String,required:true},
    date:{type:Date,default:Date.now},
    image:{
        type:String,
        default:null
    }
})
const Message=mongoose.model('Message',message);
export default Message;