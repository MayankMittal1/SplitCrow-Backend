import express from 'express'
import controller from '../controllers/group'
const router = express.Router()

router.post('/create', controller.createGroup)
router.get('/get/:id', controller.getGroupDetails)
router.post('/addUser', controller.addUsers)
router.get('/getSettlements/:id', controller.getSettlements)
export = router
