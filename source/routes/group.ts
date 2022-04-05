import express from 'express';
import controller from '../controllers/group';
const router = express.Router();

// router.post('/posts', controller.addPost);
router.post('/create',controller.createGroup)
export = router;