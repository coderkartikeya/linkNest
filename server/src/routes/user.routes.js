import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router=express.Router();

router.route("/register").post(upload.fields(
    [
        {
            name:"profilePic",
            maxCount:1
        }
    ]
),registerUser)

router.route("/login").post(loginUser)

// for log out
router.route("/logout").post(verifyJWT,logoutUser)


export default router;