import { Request, Response, NextFunction, application } from 'express'
import axios, { AxiosResponse } from 'axios'
import * as crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import * as jwt from 'jsonwebtoken'
import 'dotenv/config'
import { connect, use } from '../routes/user'
import { json } from 'body-parser'
var KEY = process.env.KEY
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    var password = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex')
    const user = await prisma.user.findFirst({
        where: {
            email: req.body.email,
            password: password,
        },
    })
    if (user != null) {
        var payload = {
            userId: user.id,
            email: user.email,
        }
        var token
        if (KEY) {
            token = jwt.sign(payload, KEY)
        } else {
            console.log('SECRET KEy not found')
            res.status(401)
            res.send('Error')
        }
        res.send(token)
    } else {
        console.error('Failure')
        res.status(401)
        res.send("There's no user matching that")
    }
}

const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    var password = crypto
        .createHash('sha256')
        .update(req.body.password)
        .digest('hex')
    var user = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
    })
    if (user == null) {
        user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: password,
                Phone: req.body.phone,
                UPI: req.body.upi,
                name: req.body.name,
            },
        })
        res.status(201)
        res.send('Success')
    } else {
        res.status(409)
        res.send('An user with that username already exists')
    }
}

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    var str = req.get('Authorization')
    try {
        var decoded
        if (str && KEY) {
            decoded = jwt.verify(str, KEY) as jwt.JwtPayload
        } else {
            res.status(401)
            res.send('Bad Token')
        }
        var user
        if (decoded) {
            user = await prisma.user.findUnique({
                where: {
                    email: decoded.email,
                },
                include: {
                    Groups: true,
                },
            })
        }
        res.status(201)
        res.send(user)
    } catch {
        res.status(401)
        res.send('Bad Token')
    }
}
export default { userLogin, userSignup, getUserInfo }
