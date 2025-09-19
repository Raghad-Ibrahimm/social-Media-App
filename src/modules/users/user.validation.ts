 import z from "zod"
import { GenderType, RoleType } from "../../DB/model/user.model.js"
export enum FlagType{
    all ="all",
    current ="current"
}

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
export const logOutSchema={
    body:z.strictObject({
      flag:z.enum(FlagType)

   }).required()
}
export const forgetPasswordSchema={
    body:z.strictObject({
      email:z.email()

   }).required()
}

export const loginWithGmailSchema={
    body:z.strictObject({
      idToken:z.string()

   }).required()
}
export const resetPasswordSchema={
    body:confirmEmailSchema.body.extend({
    password:z.string().min(3),
    cPassword:z.string(),
   }).required().superRefine((value,ctx)=>{
    if (value.password !== value.cPassword) {
        ctx.addIssue({
            code:"custom",
            path:["cPassword"],
            message:"password not match"
        })
    }
   })
}


export type signUpSchemaType = z.infer<typeof signUpSchema.body>
export type confirmEmailSchemaType = z.infer<typeof confirmEmailSchema.body>
export type signINSchemaType = z.infer<typeof signINSchema.body>
export type logOutSchemaType = z.infer<typeof logOutSchema.body>
export type loginWithGmailSchemaType = z.infer<typeof loginWithGmailSchema.body>
export type forgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema.body>
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema.body>

