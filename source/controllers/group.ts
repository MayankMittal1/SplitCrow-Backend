import { Request, Response, NextFunction, application } from 'express'
import axios, { AxiosResponse } from 'axios'
import * as crypto from 'crypto'
import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()
import * as jwt from 'jsonwebtoken'
import 'dotenv/config'
import { connect, use } from '../routes/user'
var KEY = process.env.KEY

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    var str = req.get('Authorization')
    try {
        var users: Array<number> = req.body.users
        var parsedUsers: Array<User> = []
        users.forEach(async (val) => {
            let user = await prisma.user.findFirst({
                where: {
                    id: val,
                },
            })
            if (user) parsedUsers.push(user)
        })
        var decoded
        if (str && KEY) {
            decoded = jwt.verify(str, KEY)
        } else {
            res.status(401)
            res.send('Bad Token')
        }
        await prisma.group.create({
            data: {
                name: req.body.name,
                users: {
                    connect: parsedUsers,
                },
            },
        })
    } catch {
        res.status(401)
        res.send('Bad Token')
    }
}

export default { createGroup }
