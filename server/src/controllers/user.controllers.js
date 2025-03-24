import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import { User } from '../models/User.models.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import ChatGroup from '../models/chatGroup.models.js'
import Post from '../models/post.modules.js'

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const {fullName,username,email,password}=req.body
    
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // console.log(req.files);

    const profileLocalPath = req.files?.profilePic[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

    if (!profileLocalPath) {
        throw new ApiError(400, "Profile  file is required")
    }

    const profile = await uploadOnCloudinary(profileLocalPath)
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!profile) {
        throw new ApiError(400, "Profile file is required")
    }

    const user=await User.create({
        fullName,
        username:username.toLowerCase(),
        email,
        password,
        profilePic:profile.url

    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    res.status(201).json(
        new ApiResponse(200, createdUser,"User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    // console.log(email);

    // if (!username && !email) {
    //     throw new ApiError(400, "username or email is required")
    // }
    
    // Here is an alternative of above code based on logic discussed in video:
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
        
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const getChatGroup = asyncHandler(async (req, res) => {
    // console.log(req);
    const { name } =  req.body;

    // Validate username
    if (!name?.trim()) {
        return res.status(400).json(new ApiResponse(400, {}, "Username is required"));
    }

    // console.log(name);

    // Find user by username
    const user = await User.findOne({ username: name });
    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    // Find groups where user is a member
    const groups = await ChatGroup.find({ members: user._id }).populate('members');

    // Return the groups as response
    return res.status(200).json(new ApiResponse(200, groups, "Groups Retrieved Successfully"));
});

const postById = asyncHandler(async(req,res)=>{
    const {id}=req.body;
    console.log(id);
    res.json(new ApiResponse(200,"success"));
})


export {
    registerUser,
    loginUser,
    logoutUser,
    getChatGroup,
    postById

}