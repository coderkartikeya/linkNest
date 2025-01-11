import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    date: { type: Date, default: Date.now },
    content: { type: String, required: true },
    picture: { type: String }, // Optional field for post image
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String, required: true },
            createdOn: { type: Date, default: Date.now }
        }
    ],
    report:{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String, required: true },
        createdOn: { type: Date, default: Date.now }
    }
    
},{timestamps:true});

const Post = mongoose.model('Post', postSchema);
export default Post;
