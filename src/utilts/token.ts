

import jwt, { JwtPayload } from "jsonwebtoken"
import { promises } from "nodemailer/lib/xoauth2/index.js"
                                                        
export const generateToken =async({payload,signature,option}:{payload:object,signature:string,option?:jwt.SignOptions}):Promise<string>=>{
   return  jwt.sign( payload , signature,option )
}
export const verfiyToken =async({token,signature}:{token:string,signature:string}):Promise<JwtPayload>=>{
   return  jwt.verify( token , signature ) as JwtPayload
}