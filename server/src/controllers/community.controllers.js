import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import Community from "../models/community.models.js"
import { User} from "../models/User.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ChatGroup from "../models/chatGroup.models.js";
import Post from "../models/post.modules.js";
const registerCommunity=asyncHandler(async (req,res)=>{
    // getting the data from frontend
    // check if it's non empty
    // profile image is compulory
    //image ko cloudinary par save karna h 
    // save kra kar check karo hua ki nhi 
    // response return karo
    const {name,owner,location,description,category}=req.body;
    // console.log(req.file);
    // console.log(owner);
    if([name,owner,description,category].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"all fields are required");
    }
    // check if the image is valid
    const user= await User.findOne({username:owner});
    if(!user){
        throw new ApiError(400,"user not found");
    }
    // check if the community already exists
    const community=await Community.findOne({name});
    if(community){
        throw new ApiError(400,"community already exists");
    }
    const imagep=req.file?.path;
    if(!imagep){
        throw new ApiError(400,"image is required");
    }
    // upload the image to cloudinary
    const imageUploaded=await uploadOnCloudinary(imagep);

    // saving the group
    const chatGroup =await  ChatGroup.create({
        name: name,
        admin: user,
        members: [user],
        ProfilePic:imageUploaded.url
    })
    await chatGroup.save();
    // save the community to the database
    const newCommunity=await Community.create({
        name,
        owner:user,
        profileImage:imageUploaded.url,
        description,
        category,
        location :location || {},
        group:chatGroup._id
    })
    const newCommunityUploaded=await Community.findById(newCommunity._id);
    await user.updateOne({})
    
    if(!newCommunityUploaded){
        throw new ApiError(500,"something went wrong try again ");
    }
    user.communities.push(newCommunity._id);
    user.conversations.push(chatGroup._id);
    await user.save();
    // return the response
    res.json(
        new ApiResponse(200,"community created Successfully")
    )


})
const updateCommunityByName = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const { description, category, location } = req.body;

    // Find the community by name and update it
    const updatedCommunity = await Community.findOneAndUpdate(
        { name },
        { description, category, location },
        { new: true, runValidators: true }
    );

    if (!updatedCommunity) {
        throw new ApiError(404, "Community not found");
    }

    res.json(new ApiResponse(200, "Community updated successfully", updatedCommunity));
});

const getAllCommunities = asyncHandler(async (req, res) => {
    const communities = await Community.find().populate('owner', 'username');
    res.json(new ApiResponse(200,"all coummunities",communities));

});
const getCommunitiesByCategory = asyncHandler(async (req, res) => {
    const { category } = req.query;
    if (!category) {
        throw new ApiError(400, "Category is required");
    }

    const communities = await Community.find({ category: { $regex: category, $options: 'i' }}).populate('owner', 'username');
    res.json(communities);
});
const addMemberToCommunity = asyncHandler(async (req, res) => {
    const { communityName, username } = req.body;

    // Find the community by name
    // console.table({communityName,username})
    const community = await Community.findOne({ name: communityName });
    if (!community) {
        throw new ApiError(404, "Community not found");
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the user is already a member
    if (community.members.includes(user._id)) {
        throw new ApiError(400, "User is already a member of the community");
    }
    if(community.owner===user){
        throw new ApiError(400, "User is the owner of the community");
    }

    // Add the user to the community's members array
    community.members.push(user._id);
    await community.save();

    // Add the community to the user's communities array
    user.communities.push(community._id);
    await user.save();

    res.status(200).json(new ApiResponse(200, "Member added to community successfully"));
});

const removeMemberFromCommunity = asyncHandler(async (req, res) => {
    const { communityName, username } = req.body;

    // Find the community by name
    const community = await Community.findOne({ name: communityName });
    if (!community) {
        throw new ApiError(404, "Community not found");
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if(community.owner===user){
        throw new ApiError(400, "Cannot remove the owner of the community");
    }

    // Check if the user is a member of the community
    const isMember = community.members.includes(user._id);
    if (!isMember) {
        throw new ApiError(400, "User is not a member of the community");
    }

    // Remove the user from the community's members array
    community.members = community.members.filter(memberId => memberId.toString() !== user._id.toString());
    await community.save();

    // Remove the community from the user's communities array
    user.communities = user.communities.filter(communityId => communityId.toString() !== community._id.toString());
    await user.save();

    res.status(200).json(new ApiResponse(200, "Member removed from community successfully"));
});

const getCommunitiesByUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    // console.log(userId);

    // Check if userId is provided
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // Find all communities created by the user
    const communities = await Community.find({ owner: userId });
    
    // if (!communities) {
    //     throw new ApiError(404, "No communities found for this user");
    // }

    res.json(new ApiResponse(200, "Community updated successfully", communities));
});

const communitByid=asyncHandler(async(req,res)=>{
    const {id}=req.body;
    // console.log(req.body)
    const community=await Community.findById(id);

    // console.log(id);
        if(!community){
            throw new ApiError(404, "Community not found");
            }
        const posts=await Post.find({community:community._id});
        community.posts=posts;
        // console.log(posts)

        
            res.json(new ApiResponse(200, "Community found successfully", community));
})
const communityPost = asyncHandler(async (req, res) => {
    const { community, text, likes, date, user } = req.body;
    
    const usr=await User.findById(user);
    if(!usr){
        throw new ApiError(404, "User not found");
        }
    

    const c = await Community.findById(community);
    if (!c) {
        throw new ApiError(404, "Community not found");
    }
    
    const imagep = req.file?.path;

    const profile = imagep ? await uploadOnCloudinary(imagep) : '';

    const post = await Post.create({
        content: text,
        picture: profile.url,
        likes: likes,
        community: c._id,
        owner: usr,
        ownerName:usr.fullName,
        date: new Date(),
        communityName:c.name
    });
    
    const newPost = await Post.findById(post._id);  // populate user field to get details
    
    if (!newPost) {
        throw new ApiError(404, "Post not found");
    }
    c.posts.push(newPost);
    await c.save();
    
    res.json(new ApiResponse(200, "Post created successfully"));
});
const communityPostsAll=asyncHandler(async (req,res)=>{
    const posts = await Post.find({});
    res.json(new ApiResponse(200, "Posts found successfully", posts));
})

const deleteCommunity=asyncHandler(async (req,res)=>{
    const {id}=req.body;
    const community = await Community.findById(id);
    if (!community) {
        throw new ApiError(404, "Community not found");
    }
    await community.deleteOne({_id:id});
    res.json(new ApiResponse(200, "Community deleted successfully"));
})

const getMessage=asyncHandler(async(req,res)=>{
    const {id}=req.body;
    const group = await ChatGroup.findById(id);
    if (!group) {
        throw new ApiError(404, "Message not found");
    }
    res.json(new ApiResponse(200,"Group found",group));    
    
})




export{
    registerCommunity,
    updateCommunityByName,
    getAllCommunities,
    getCommunitiesByCategory,
    addMemberToCommunity,
    removeMemberFromCommunity,
    getCommunitiesByUser,
    communitByid,
    communityPost,
    communityPostsAll,
    deleteCommunity,
    getMessage


}