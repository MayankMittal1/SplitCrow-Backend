import express from 'express';
import controller from '../controllers/user';
const router = express.Router();

// router.post('/posts', controller.addPost);
router.post('/login',controller.userLogin)
router.post('/signup',controller.userSignup)
export = router;