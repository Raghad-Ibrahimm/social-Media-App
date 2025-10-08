import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"
import { appErr } from "../utilts/classError"

type ReqTypes =keyof Request   //==>  "body" ||"params" || "headers" .........
type schemaTypes =Partial<Record < ReqTypes , ZodType >>


export const validtion =(schema:schemaTypes)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const validtionErrs =[]
    for (const key of Object.keys(schema) as ReqTypes []) {


         if (!schema[key]) continue

         if (req?.file) {
            req.body.attachment =req.file
         }
         if (req?.files) {
            req.body.attachments =req.files
         }


        const result = schema[key].safeParse(req[key])


        if (!result?.success) {
            validtionErrs.push(result.error)
        }
        
    }

    if (validtionErrs.length) {
                    throw new appErr(JSON.parse(validtionErrs as unknown as string),400)

    }
    next()
}

}