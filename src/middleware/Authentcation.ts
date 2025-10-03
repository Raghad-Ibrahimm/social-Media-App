import { NextFunction, Request, Response } from "express"
import { appErr } from "../utilts/classError.js"
import { decodedTokenAndFetchUser, GetSignature, TokenType } from "../utilts/token.js"



export const Authenticatin = (tokenType:TokenType = TokenType.access )  => {
  return async (req: Request, res: Response, next: NextFunction)=> {
      // get token from headers as Authorization
      const { authorization } = req.headers
      const [prefix, token] = authorization?.split(" ") || []
      if (!prefix || !token) {
         throw new appErr("Token not exist", 404)
      }
      const signature = await GetSignature(tokenType, prefix)
      if (!signature) {
         throw new appErr("Invalid signatureee", 400)
      }

      const decoded = await decodedTokenAndFetchUser(token, signature)
      if (!decoded) {
         throw new appErr("Invalid token decoded", 400)
      }

       req.user  = decoded?.user
      req.decoded =  decoded?.decoded
     return next();

   };
}