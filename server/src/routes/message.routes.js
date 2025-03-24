import express from 'express'
import { upload } from '../middlewares/multer.middlewares.js';
import { check, fetchMessageByGroupId, saveMessage } from '../controllers/message.controllers.js';

const router=express.Router();

router.route('/allMessages').post(fetchMessageByGroupId);
router.route('/check').get(check);
router.route('/saveMessage').post(upload.single('image'),saveMessage);

export default router;