import mongoose from "mongoose";


const chatGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    isDeleted: { type: Boolean, default: false },
    ProfilePic:{
        type:String,
        default:""
    }
    
});

const ChatGroup = mongoose.model('ChatGroup', chatGroupSchema);
export default ChatGroup;
