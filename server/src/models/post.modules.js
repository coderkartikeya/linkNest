import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName:{type:String,required:true},
    community:{type:mongoose.Schema.Types.ObjectId,ref:'Community',required:true},
    communityName:{type:String,required:true},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    picture: { type: String }, // Optional field for post image
    ownerImage:{ type:String},
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            content: { type: String },
            createdOn: { type: Date, default: Date.now }
        }
    ],
    report:{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String, },
        createdOn: { type: Date, default: Date.now }
    }
    
},{timestamps:true});

const Post = mongoose.model('Post', postSchema);
export default Post;
