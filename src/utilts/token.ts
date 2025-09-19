

import jwt, { JwtPayload } from "jsonwebtoken"

import { appErr } from "./classError.js"
import { userRepository } from "../DB/repositories/user.repository.js"
import userModel from "../DB/model/user.model.js"
import { RevokeTokenRepository } from "../DB/repositories/revokeToken.repository.js"
import RevokeTokenModel from "../DB/model/revokeToken.model.js"

export enum TokenType {
    access = "access",
    refresh = "refresh"
}
const _userModel = new userRepository(userModel)
const _revokeToken = new RevokeTokenRepository(RevokeTokenModel)

export const generateToken = async ({ payload, signature, option }: { payload: object, signature: string, option?: jwt.SignOptions }): Promise<string> => {
    return jwt.sign(payload, signature, option)
}
export const verfiyToken = async ({ token, signature }: { token: string, signature: string }): Promise<JwtPayload> => {
    return jwt.verify(token, signature) as JwtPayload
}
export const GetSignature = async (tokenType: TokenType, prefix: string) => {
    if (tokenType === TokenType.access) {
        if (prefix === process.env.BEARER_USER) {
            return process.env.ACCESS_TOKEN_USER
        } else if (prefix === process.env.BEARER_ADMIN) {
            return process.env.ACCESS_TOKEN_ADMIN
        } else {
            return null
        }
    }


    if (tokenType === TokenType.refresh) {
        if (prefix === process.env.BEARER_USER) {
            return process.env.REFRESH_TOKEN_USER
        } else if (prefix === process.env.BEARER_ADMIN) {
            return process.env.REFRESH_TOKEN_ADMIN
        } else {
            return null
        }
    }
    return null;
}


export const decodedTokenAndFetchUser = async (token: string, signature: string) => {

    // decoded token
    const decoded = await verfiyToken({ token, signature });
    if (!decoded) {
        throw new appErr("Invalid Token decoded", 400)
    }


    const user = await _userModel.findOne({ email: decoded.email, })

    if (!user) {
        throw new appErr("User is not exist", 404)
    }
    if (!user?.confirmed) {
        throw new appErr("Please confirm email first", 404)
    }

    if (await _revokeToken.findOne({ tokenId: decoded?.jti })) {
        throw new appErr("Token has been revoked", 401)

    }
    if (user?.changeCredentials?.getTime() > decoded?.iat! * 1000) {
        throw new appErr("Token has been revoked or expires", 401)

    }

    return { decoded, user };
}
