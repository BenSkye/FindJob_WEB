import { Hash } from "crypto"
import { keyModel } from "../models/keytoken.model"
import { ObjectId, Types } from "mongoose"
import crypto from 'crypto';


class KeyTokenService {
    static createKeyToken = async (
        userId: Types.ObjectId,
        publicKey: string,
        privateKey: string,
        refreshToken: string
    ) => {
        try {

            const filter = { user: userId };

            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken,
            };
            console.log("update", update);
            const options = { new: true, upsert: true };
            const tokens = await keyModel.findOneAndUpdate(filter, update, options);
            console.log("tokens2", tokens);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId: string) => {
        return await keyModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }

    static removeKeyById = async (id: string) => {
        return await keyModel.deleteOne({ _id: id });
    }

    static findByRefreshTokenUsed = async (refreshToken: string) => {
        return await keyModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    };

    static findByRefreshToken = async (refreshToken: string) => {
        return await keyModel.findOne({ refreshToken }).lean() as unknown as typeof keyModel;
    };

    static deleteKeyByUserId = async (userId: string) => {
        return await keyModel.deleteOne({ user: new Types.ObjectId(userId) });
    };

    static updateRefreshTokensUsed = async (newRefreshToken: string, oldRefreshToken: string) => {
        await keyModel.updateOne(
            { refreshToken: oldRefreshToken }, // Filter to find the document with the old refresh token
            {
                $set: {
                    refreshToken: newRefreshToken
                },
                $addToSet: {
                    refreshTokensUsed: oldRefreshToken // Add the old refresh token to the array of used tokens
                }
            }
        );
    }
}

export default KeyTokenService