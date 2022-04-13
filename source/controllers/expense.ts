import { Request, Response, NextFunction, application } from 'express'
import axios, { AxiosResponse } from 'axios'
import * as crypto from 'crypto'
import { ExpenseBalance, Prisma, PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()
import * as jwt from 'jsonwebtoken'
import 'dotenv/config'
import { connect, use } from '../routes/user'
var KEY = process.env.KEY

const addExpense = async (req: Request, res: Response, next: NextFunction) => {
    var str = req.get('Authorization')
    var decoded
    var balances: Array<{ id: number }> = []
    try {
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
    var expenses: Array<{ userId: number; balance: number }> = req.body.expense
    expenses.forEach(async (val) => {
        var expenseBalance = await prisma.expenseBalance.create({
            data: {
                User: {
                    connect: { id: val.userId },
                },
                balance: val.balance,
            },
        })
        balances.push({ id: expenseBalance.id })
        await prisma.balance.upsert({
            where: {
                groupId_userId: {
                    groupId: req.body.groupId,
                    userId: val.userId,
                },
            },
            update: {
                balance: {
                    decrement: val.balance,
                },
            },
            create: {
                group: {
                    connect: { id: req.body.groupId },
                },
                user: {
                    connect: { id: val.userId },
                },
                balance: -1 * val.balance,
            },
        })
    })
    await prisma.balance.upsert({
        where: {
            groupId_userId: {
                groupId: req.body.groupId,
                userId: req.body.paidBy,
            },
        },
        update: {
            balance: {
                increment: req.body.amount,
            },
        },
        create: {
            group: {
                connect: { id: req.body.groupId },
            },
            user: {
                connect: { id: req.body.paidBy },
            },
            balance: req.body.amount,
        },
    })
    await prisma.expense.create({
        data: {
            group: {
                connect: { id: req.body.groupId },
            },
            PaidBy: {
                connect: { id: req.body.paidBy },
            },
            name: req.body.name,
            amount: req.body.amount,
            Balances: {
                connect: balances,
            },
        },
    })
    res.status(201)
    res.send('Success')
}

export default { addExpense }
