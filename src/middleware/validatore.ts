import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"
import { appErr } from "../utilts/classError.js"

type ReqTypes =keyof Request   //==>  "body" ||"params" || "headers" .........
type schemaTypes =Partial<Record < ReqTypes , ZodType >>


export const validtion =(schema:schemaTypes)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const validtionErrs =[]
    for (const key of Object.keys(schema) as ReqTypes []) {


         if (!schema[key]) continue


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