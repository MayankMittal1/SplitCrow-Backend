import express from 'express'
import controller from '../controllers/expense'
const router = express.Router()

router.post('/add', controller.addExpense)
export = router
