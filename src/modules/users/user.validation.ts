 import z from "zod"
import { GenderType, RoleType } from "../../DB/model/user.model.js"

export const signINSchema={
    body:z.object({
   
    email:z.email(),
    password:z.string().min(3),
  
   }).required()
}
export const signUpSchema={
    body:signINSchema.body.extend({
    fullName:z.string().min(2).max(20).trim(),
    cPassword:z.string(),
    gender:z.enum([GenderType.female,GenderType.male]),
    age:z.number().min(18).max(60),
    phone:z.string().min(11).max(14),
    role:z.enum([RoleType.user,RoleType.admin]),
    address:z.string()

   }).required().superRefine((data,ctx)=>{
    if (data.password!==data.cPassword) {
        ctx.addIssue({code:"custom",path:["cPassword"],message:"cPassword shoud be match password"})
    }
   })
}
export const confirmEmailSchema={
    body:z.strictObject({
  
    email:z.email(),
    otp:z.string().regex(/^\d{6}$/).trim()

   }).required()
}


export type signUpSchemaType = z.infer<typeof signUpSchema.body>
export type confirmEmailSchemaType = z.infer<typeof confirmEmailSchema.body>
export type signINSchemaType = z.infer<typeof signINSchema.body>

