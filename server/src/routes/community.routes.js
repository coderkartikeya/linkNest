import express from 'express'
import { upload } from '../middlewares/multer.middlewares.js';
import { addMemberToCommunity, communitByid, getAllCommunities, getCommunitiesByCategory, getCommunitiesByUser, registerCommunity, updateCommunityByName } from '../controllers/community.controllers.js';


const router=express.Router();

router.route('/register').post(upload.single('profileImage'),registerCommunity)
router.route('/update').post(updateCommunityByName)
router.route('/all').post(getAllCommunities)
router.route('/category').post(getCommunitiesByCategory)
router.route('/addMember').post(addMemberToCommunity);
router.route('/byMember').post(getCommunitiesByUser);
router.route('/byId').post(communitByid);

export default router;

// more routes