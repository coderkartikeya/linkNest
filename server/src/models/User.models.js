import mongoose, { Schema } from 'mongoose'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});


const conversationSchema = new mongoose.Schema({
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Users in the conversation
    ],
    messages: [messageSchema], // Array of messages for this conversation
    lastMessage: {
        content: { type: String },
        sentAt: { type: Date, default: Date.now },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
}, { timestamps: true });

const userSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,

    },
    gender:{
        type:String,
        // required:true,
        trim:true,

    },
    createdOn:{
        type:Date,
        default:Date.now,
        
    },
    updatedOn:{
        type:Date,
        default:Date.now,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    profilePic:{
        type:String,
        required:true

    },
    communities:[
        {
            type:Schema.Types.ObjectId,
            ref:"Community",

        }
    ],
    conversations: [
        { type:Schema.Types.ObjectId,
            ref:"ChatGroup"
         }, 
    ],
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post",
        }
    ],
    location:{
        ipAddress:{
            type:String,
            // required:true,
        },
        city:{
            type:String,
            // required:true,
        },
        country:{
            type:String,
            // required:true,
        },
        state:{
            type:String,
            // required:true,
        }

    },
    refreshToken:{
        type:String,

    }

    
},{timestamps:true});

// password encrypt kar rhe h 
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
})

// custom method

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model('User',userSchema);
