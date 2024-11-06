import { NextFunction, Request, Response } from "express"
import { findById } from "../services/apiKey.service"
import { BadRequestError, ForbiddenError } from "../core/error.response"

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const apiKey = async (req: any, res: Response, next: NextFunction) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            throw new ForbiddenError('Forbidden Error')
        }
        //check obj key
        const objKey = await findById(key)
        if (!objKey) {
            throw new ForbiddenError('Forbidden Error')
        }

        req.objectKey = objKey;
        return next()
    } catch (error) {

    }
}


const permission = (permission: string) => {
    return (req: any, res: any, next: any) => {
        if (!req.objectKey.permissions) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        console.log('permission::', req.objectKey.permissions);
        console.log('req.objectKey', req.objectKey.permissions);
        console.log('typeof permission:', typeof permission);
        console.log('permissions array:', req.objectKey.permissions);
        console.log('permissions array type:', typeof req.objectKey.permissions);

        const validPermission = req.objectKey.permissions.includes(permission)
        if (!validPermission) {
            return next(new ForbiddenError('permission denied 2'));
            // return res.status(403).json({
            //     message: 'permission denied'
            // })
        }

        return next()
    }
}



export { apiKey, permission }