import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    location:{
        ipAddress:{
            type:String,
            required:true            
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
            },
        country:{
            type:String,
            required:true
        }

    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    isPrivate:{
        type:Boolean,
        default:false
    },
    category:{
        type:String,
        required:true
    },
    reportCommunity:{
        type:Boolean,
        default:false,    
    }        
    
    
});

const Community = mongoose.model('Community', communitySchema);
export default Community;
