
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { asyncHandler } from '../helpers/asyncHandler';
import KeyTokenService from '../services/keyToken.service';
import { AuthFailureError, NotFoundError } from '../core/error.response';
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-refresh-token',
}
const createTokenPair = async (payload: Object, publicKey: string, privateKey: string) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey,
            { expiresIn: '2 days' });//2 days
        const refreshToken = await jwt.sign(payload, privateKey,
            { expiresIn: '7 days' });//7 days

        //
        jwt.verify(accessToken, publicKey, (err: any, decoded: any) => {
            if (err) {
                console.error('error::', err)
            } else {
                console.log('decoded::', decoded)
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        return error
    }
}


const authentication = asyncHandler(async (req: any, res: any, next: any) => {
    /*
 1 - Check userId missing???
 2 - get accessToken
 3- verifyToken
 4 check user in bds?
 5 check keyStore with this userId?
 6-OK all => return next()
 */
    const userId = req.headers[HEADER.CLIENT_ID] as string;
    if (!userId) throw new AuthFailureError('Invalid CLIENT_ID')
    //2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    //3
    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN] as string;
            console.log('refreshToken::', refreshToken)
            const decodeUser: JwtPayload = jwt.verify(refreshToken, keyStore.privateKey) as JwtPayload;
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Refresh Token')
            req.user = decodeUser;
            req.keyStore = keyStore;
            req.refreshToken = refreshToken;
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
    if (!accessToken) throw new AuthFailureError('Invalid accessToken')
    try {
        console.log('accessToken::', accessToken)
        const decodeUser: JwtPayload = jwt.verify(accessToken, keyStore.publicKey) as JwtPayload;
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid Access Token')
        req.keyStore = keyStore;
        return next()
    } catch (error) {
        throw error
    }
})


const verifyJWT = (token: string, keySecret: string) => {
    return jwt.verify(token, keySecret)
}

export { createTokenPair, authentication, verifyJWT }