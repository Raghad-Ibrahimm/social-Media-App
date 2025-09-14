import { NextFunction, Request, Response } from "express";
import {  confirmEmailSchemaType, signINSchemaType, signUpSchemaType } from "./user.validation.js";
import userModel, { Iuser, RoleType } from "../../DB/model/user.model.js";
import { userRepository } from "../../DB/repositories/user.repository.js";
import { appErr } from "../../utilts/classError.js";
import { Compare, Hash } from "../../utilts/Hash.js";
import { eventEmitter } from "../../utilts/event.js";
import { generateOTP } from "../../service/sendEmail.js";
import { generateToken } from "../../utilts/token.js";




class userService{
private _userModel = new userRepository (userModel)
constructor(){}
//===================sign up ============
  signUp =async(req:Request,res:Response,next:NextFunction)=>{

  const {fullName ,email, password , cPassword , age , phone,gender,role,address}:signUpSchemaType=req.body
if (await this._userModel.findOne({email})) {
  throw new appErr("Email is already exist",409)
}

const otp =await generateOTP()
const hashOTP =await Hash(String(otp))
const hashPass =await Hash(password)
eventEmitter.emit("confirmEmail",{email,otp})

const user:Iuser = await this._userModel.createOneUser({fullName ,email,otp:hashOTP , password:hashPass  , age , phone,gender,role,address})
  
return res.status(201).json({message:"User created successfully",user})
}
//===================confirm email============
  confirmEmail =async(req:Request,res:Response,next:NextFunction)=>{
    const { email , otp }:confirmEmailSchemaType = req.body

const user =await this._userModel.findOne({email,confirmed:{$exists:false}})
    if (!user) {
  throw new appErr("User not exist Or already confirmed",404)
}
if (!await Compare(otp,user?.otp!)) {
  throw new appErr("InValid otp")
}

await this._userModel.updateOne({email:user?.email},{confirmed:true,$unset:{otp:""}})

     return res.status(200).json({message:"Email is confirmed success"})
}
//===================sign up ============
  signIn =async(req:Request,res:Response,next:NextFunction)=>{

    const {email,password}:signINSchemaType =req.body
    const user =await this._userModel.findOne({email,confirmed:true})
    if (!user) {
  throw new appErr("User not exist Or not confirmed yet",404)
}
if (!await Compare(password,user?.password!)) {
  throw new appErr("Email Or password wrong")
}

      // create jwt 
        const AccessToken = await generateToken({
                payload: { id: user._id, email:user.email },
                signature: user.role == RoleType.user ? process.env.ACCESS_TOKEN_USER! : process.env.ACCESS_TOKEN_ADMIN!,
                option: { expiresIn: "1h" }
        })

        const RefreshToken = await generateToken({
                payload: { id: user._id, email },
                signature: user.role == RoleType.user ? process.env.REFRESH_TOKEN_USER! : process.env.REFRESH_TOKEN_ADMIN!,
                option: { expiresIn: "1y" }
        })


return res.status(201).json({message:"login succssfully",AccessToken,RefreshToken})
}

  Profile =async(req:Request,res:Response,next:NextFunction)=>{

   console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh");
   

   
    res.status(200).json({message:"success"})
    return;
}





}

export default new userService()