import http from 'http'
import express, { Express } from 'express'
import morgan from 'morgan'
import userRouter from './routes/user'
import groupRouter from './routes/group'
import expenseRouter from './routes/expense'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
const prisma = new PrismaClient()
const router: Express = express()

/** Logging */
router.use(morgan('dev'))
router.use(bodyParser.json())
/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*')
    // set the CORS headers
    res.header(
        'Access-Control-Allow-Headers',
        'origin, X-Requested-With,Content-Type,Accept, Authorization'
    )
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST')
        return res.status(200).json({})
    }
    next()
})

/** Routes */
router.use('/user', userRouter)
router.use('/group', groupRouter)
router.use('/expense', groupRouter)

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found')
    return res.status(404).json({
        message: error.message,
    })
})

/** Server */
const httpServer = http.createServer(router)
const PORT: any = process.env.PORT ?? 6060
httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
)
