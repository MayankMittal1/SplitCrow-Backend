import express from 'express'
import controller from '../controllers/user'
const router = express.Router()

router.post('/login', controller.userLogin)
router.post('/signup', controller.userSignup)
router.get('/get', controller.getUserInfo)
export = router
