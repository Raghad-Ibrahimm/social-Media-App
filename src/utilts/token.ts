

import jwt, { JwtPayload } from "jsonwebtoken"

import { appErr } from "./classError.js"
import { userRepository } from "../DB/repositories/user.repository.js"
import userModel from "../DB/model/user.model.js"
         
export enum TokenType {
    access ="access",
    refresh ="refresh"
}
const _userModel = new userRepository(userModel)

export const generateToken =async({payload,signature,option}:{payload:object,signature:string,option?:jwt.SignOptions}):Promise<string>=>{
   return  jwt.sign( payload , signature,option )
}
export const verfiyToken =async({token,signature}:{token:string,signature:string}):Promise<JwtPayload>=>{
   return  jwt.verify( token , signature ) as JwtPayload
}
export const GetSignature = async(tokenType:TokenType,prefix:string)=>{
if (tokenType === TokenType.access) {
    if(prefix === process.env.BEARER_USER ){
        return process.env.ACCESS_TOKEN_USER
    } else if (prefix === process.env.BEARER_ADMIN){
       return process.env.ACCESS_TOKEN_ADMIN
    } else{
        return null
    }
}


if (tokenType ===TokenType.refresh) {
       if(prefix === process.env.BEARER_USER ){
        return process.env.REFRESH_TOKEN_USER
    } else if (prefix === process.env.BEARER_ADMIN){
      return process.env.REFRESH_TOKEN_ADMIN
    } else{
        return null
    }
}
   return null;
}


export const decodedTokenAndFetchUser =async(token:string,signature:string)=>{
      
     // decoded token
        const decoded = await verfiyToken({token,signature});
       if (!decoded) {
           throw new appErr("Invalid Token decoded",400)
       }


  const user = await _userModel.findOne({email:decoded.email,})

        if (!user) {
           throw new appErr("User is not exist",404)
        }
        if (!user?.confirmed) {
           throw new appErr("Please confirm email first",404)
        }
        return {decoded,user};
}
