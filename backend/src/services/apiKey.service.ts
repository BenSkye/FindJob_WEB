import { apiKeyModel } from "../models/apiKey.model"
import crypto from 'crypto'
import { convertObjectId } from "../utils"
import { Types } from "mongoose"
const findById = async (key: string) => {
    // const newKey = await apiKeyModel.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['customer'] })
    // console.log(newKey)

    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
}

const findByUserId = async (userId: Types.ObjectId) => {
    return await apiKeyModel.findOne({ user: userId }).lean()
}

const createKey = async (permissions: string[], user: Types.ObjectId) => {
    const key = crypto.randomBytes(64).toString('hex')
    const newKey = await apiKeyModel.create({ key, permissions, user })
    return newKey;
}

export { findById, createKey, findByUserId }