import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ChatGroup from "../models/chatGroup.models.js";
import Message from "../models/Message.models.js";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { io } from "../index.js";


const saveMessage = asyncHandler(async (req, res) => {
    const { groupId, text, date, user } = req.body;

    const group = await ChatGroup.findById(groupId);
    if (!group) {
        return res.json(new ApiError(400, "Group not found"));
    }

    const usr = await User.findById(user);
    if (!usr) {
        return res.json(new ApiError(400, "User not found"));
    }

    if (!text || text.trim() === "") {
        return res.json(new ApiError(400, "Message text is required"));
    }

    const imagep = req.file?.path;
    const img = imagep ? await uploadOnCloudinary(imagep) : null;
    const imageUrl = img?.secure_url || null; // Extract only the URL

    const message = await Message.create({
        user: usr._id,
        username: usr.username,
        message: text.trim(),
        date: new Date(),
        image: imageUrl, // Store only the image URL
        groupId: groupId
    });


    if (!message) {
        return res.json(new ApiError(400, "Something went wrong while saving message"));
    }
    io.to(groupId).emit("newMessage", message);

    group.messages.push(message);
    await group.save();
    const data=await Message.find({groupId:group._id});

    return res.json(new ApiResponse(200, "Message saved successfully", data));
});


const fetchMessageByGroupId=asyncHandler(async(req,res)=>{
    const {groupId}=req.body;
    const group=await ChatGroup.findById(groupId);

    if(!group){
        return res.json(new ApiError(400,"group is not found"));
    }
    const messages=await Message.find({groupId:groupId}).sort({date:-1});
    return res.json(new ApiResponse(200,messages));
})
const check=asyncHandler(async(req,res)=>{
    return res.json(new ApiResponse(200,"systumm"));
})

export {
    saveMessage,
    fetchMessageByGroupId,
    check
}