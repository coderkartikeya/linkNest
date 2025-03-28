import express from 'express'
import { upload } from '../middlewares/multer.middlewares.js';
import { addMemberToCommunity, communitByid, communityPost, communityPostsAll, deleteCommunity, getAllCommunities, getCommunitiesByCategory, getCommunitiesByUser, getMessage, registerCommunity, updateCommunityByName } from '../controllers/community.controllers.js';
import { userD } from '../controllers/user.controllers.js';


const router=express.Router();

router.route('/register').post(upload.single('profileImage'),registerCommunity)
router.route('/update').post(updateCommunityByName)
router.route('/all').get(getAllCommunities)
router.route('/category').post(getCommunitiesByCategory)
router.route('/addMember').post(addMemberToCommunity);
router.route('/byMember').post(getCommunitiesByUser);
router.route('/byId').post(communitByid);
router.route('/savePost').post(upload.single('profileImage'),communityPost)
router.route('/allposts').get(communityPostsAll);

router.route('/deleteCommunity').post(deleteCommunity)
router.route('/getmessage').post(getMessage);


export default router;

// more routes