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
    var decoded
    var parsedUsers = []
    try {
        var users: Array<string> = req.body.users
        users.forEach((val) => {
            parsedUsers.push({
                email: val,
            })
        })
        if (str && KEY) {
            decoded = jwt.verify(str, KEY) as jwt.JwtPayload
        } else {
            res.status(401)
            res.send('Bad Token')
        }
    } catch {
        res.status(401)
        res.send('Bad Token')
    }
    if (decoded)
        parsedUsers.push({
            email: decoded.email,
        })
    await prisma.group.create({
        data: {
            name: req.body.name,
            users: {
                connect: parsedUsers,
            },
        },
    })
    res.status(201)
    res.send('Success')
}

const addUsers = async (req: Request, res: Response, next: NextFunction) => {
    var str = req.get('Authorization')
    var decoded
    var parsedUsers: Array<{}> = []
    try {
        var users: Array<string> = req.body.users
        users.forEach((val) => {
            parsedUsers.push({
                email: val,
            })
        })
        if (str && KEY) {
            decoded = jwt.verify(str, KEY) as jwt.JwtPayload
        } else {
            res.status(401)
            res.send('Bad Token')
        }
    } catch {
        res.status(401)
        res.send('Bad Token')
    }
    var id: number = +req.body.id
    await prisma.group.update({
        where: {
            id: id,
        },
        data: {
            users: {
                connect: parsedUsers,
            },
        },
    })
    res.status(200)
    res.send('Success')
}
const getGroupDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    var str = req.get('Authorization')
    try {
        var decoded
        if (str && KEY) {
            decoded = jwt.verify(str, KEY) as jwt.JwtPayload
        } else {
            res.status(401)
            res.send('Bad Token')
        }
        var id: number = +req.params.id
        var group = await prisma.group.findFirst({
            where: {
                id: id,
            },
            include: {
                users:{
                    select:{
                        name:true,
                        email:true,
                        Phone:true,
                    }
                },
            },
        })
        res.status(201)
        res.send(group)
    } catch {
        res.status(401)
        res.send('Bad Token')
    }
}

export default { createGroup, getGroupDetails, addUsers }
