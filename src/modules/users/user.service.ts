import { NextFunction, Request, Response } from "express";
import { confirmEmailSchemaType, FlagType, forgetPasswordSchemaType, loginWithGmailSchemaType, logOutSchemaType, resetPasswordSchemaType, signINSchemaType, signUpSchemaType } from "./user.validation.js";
import userModel, { Iuser, Provider, RoleType } from "../../DB/model/user.model.js";
import { userRepository } from "../../DB/repositories/user.repository.js";
import { appErr } from "../../utilts/classError.js";
import { Compare, Hash } from "../../utilts/Hash.js";
import { eventEmitter } from "../../utilts/event.js";
import { generateOTP } from "../../service/sendEmail.js";
import { generateToken } from "../../utilts/token.js";
import { v4 as uuidv4 } from 'uuid';
import { RevokeTokenRepository } from "../../DB/repositories/revokeToken.repository.js";
import RevokeTokenModel from "../../DB/model/revokeToken.model.js";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { compare } from "bcrypt";




class userService {
  private _userModel = new userRepository(userModel)
  private _revokeToken = new RevokeTokenRepository(RevokeTokenModel)
  constructor() { }
  //===================sign up ============
  signUp = async (req: Request, res: Response, next: NextFunction) => {

    const { fullName, email, password, cPassword, age, phone, gender, role, address }: signUpSchemaType = req.body
    if (await this._userModel.findOne({ email })) {
      throw new appErr("Email is already exist", 409)
    }

    const otp = await generateOTP()
    const hashOTP = await Hash(String(otp))
    const hashPass = await Hash(password)
    eventEmitter.emit("confirmEmail", { email, otp })

    const user: Iuser = await this._userModel.createOneUser({ fullName, email, otp: hashOTP, password: hashPass, age, phone, gender, role, address })

    return res.status(201).json({ message: "User created successfully", user })
  }
  //===================confirm email============
  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp }: confirmEmailSchemaType = req.body

    const user = await this._userModel.findOne({ email, confirmed: { $exists: false } })
    if (!user) {
      throw new appErr("User not exist Or already confirmed", 404)
    }
    if (!await Compare(otp, user?.otp!)) {
      throw new appErr("InValid otp")
    }

    await this._userModel.updateOne({ email: user?.email }, { confirmed: true, $unset: { otp: "" } })

    return res.status(200).json({ message: "Email is confirmed success" })
  }
  //===================sign up ============
  signIn = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password }: signINSchemaType = req.body
    const user = await this._userModel.findOne({ email ,confirmed :{$exists:true},provider:Provider.system })
    if (!user) {
      throw new appErr("User not found Or not confirmed yet Or  inValid provider", 404)
    }
    if (!await Compare(password, user?.password!)) {
      throw new appErr("Email Or password wrong")
    }
    const jwtid = uuidv4()
    // create jwt 
    const AccessToken = await generateToken({
      payload: { id: user._id, email: user.email },
      signature: user.role == RoleType.user ? process.env.ACCESS_TOKEN_USER! : process.env.ACCESS_TOKEN_ADMIN!,
      option: { expiresIn: "1h", jwtid }
    })

    const RefreshToken = await generateToken({
      payload: { id: user._id, email },
      signature: user.role == RoleType.user ? process.env.REFRESH_TOKEN_USER! : process.env.REFRESH_TOKEN_ADMIN!,
      option: { expiresIn: "1y", jwtid }
    })


    return res.status(201).json({ message: "login succssfully", AccessToken, RefreshToken })
  }


  Profile = async (req: Request, res: Response, next: NextFunction) => {

    return res.status(201).json({ message: "success", user: req.user })

  }
  refreashToken = async (req: Request, res: Response, next: NextFunction) => {
    const jwtid = uuidv4()
    // create jwt 
    const AccessToken = await generateToken({
      payload: { id: req?.user?._id, email: req?.user?.email },
      signature: req?.user?.role == RoleType.user ? process.env.ACCESS_TOKEN_USER! : process.env.ACCESS_TOKEN_ADMIN!,
      option: { expiresIn: "1h", jwtid }
    })

    const RefreshToken = await generateToken({
      payload: { id: req?.user?._id, email: req?.user?.email },
      signature: req?.user?.role == RoleType.user ? process.env.REFRESH_TOKEN_USER! : process.env.REFRESH_TOKEN_ADMIN!,
      option: { expiresIn: "1y", jwtid }
    })
    await this._revokeToken.create({
      tokenId: req.decoded?.jti!,
      userId: req.user?._id!,
      expireAt: new Date(req.decoded?.exp! * 1000)
    })

    return res.status(201).json({ message: "success to refreash ", AccessToken, RefreshToken })

  }
  logOut = async (req: Request, res: Response, next: NextFunction) => {
    const { flag }: logOutSchemaType = req.body
    if (flag === FlagType?.all) {
      await this._userModel.updateOne({ _id: req.user?._id }, { changeCredentials: new Date() })
      return res.status(201).json({ message: "success logout from all devices" })

    }

    await this._revokeToken.create({
      tokenId: req.decoded?.jti!,
      userId: req.user?._id!,
      expireAt: new Date(req.decoded?.exp! * 1000)
    })
    return res.status(201).json({ message: "success log out from this device" })

  }


  logInWithGmail = async (req: Request, res: Response, next: NextFunction) => {

    const { idToken }:loginWithGmailSchemaType = req.body;


    const client = new OAuth2Client();
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.WEB_CLIENT_ID!,
      });
      const payload = ticket.getPayload();
      return payload

    }
    const { picture, name, email_verified, email } = await verify() as TokenPayload

    let user = await this._userModel.findOne({ email })
    if (!user) {
      user = await this._userModel.create({
        fullName: name!,
        email:email!,
        image: picture!,
        confirmed: email_verified!,
        password: uuidv4(),
        provider: Provider.google
      })
    }
    if (user?.provider === Provider.system) {
      throw new appErr("please login on system")
    }

       const jwtid = uuidv4()
    // create jwt 
    const AccessToken = await generateToken({
      payload: { id: req?.user?._id, email: req?.user?.email },
      signature: req?.user?.role == RoleType.user ? process.env.ACCESS_TOKEN_USER! : process.env.ACCESS_TOKEN_ADMIN!,
      option: { expiresIn: "1h", jwtid }
    })

    const RefreshToken = await generateToken({
      payload: { id: req?.user?._id, email: req?.user?.email },
      signature: req?.user?.role == RoleType.user ? process.env.REFRESH_TOKEN_USER! : process.env.REFRESH_TOKEN_ADMIN!,
      option: { expiresIn: "1y", jwtid }
    })




    return res.status(201).json({ message: "success",AccessToken,RefreshToken })

  }

   forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
         const {email}: forgetPasswordSchemaType = req.body;
          const user = await this._userModel.findOne({ email ,confirmed :{$exists:true} })
    if (!user) {
      throw new appErr("User not found Or not confirmed yet", 404)
    }
        const otp = await generateOTP()
    const hashOTP = await Hash(String(otp))
    eventEmitter.emit("ForgetPassword", { email, otp })
    await this._userModel.updateOne({email:user.email},{otp:hashOTP})



    return res.status(200).json({ message: "Success to send otp " })

  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
         const {otp ,email, password,cPassword }: resetPasswordSchemaType = req.body;
          const user = await this._userModel.findOne({ email ,otp :{$exists:true} })
    if (!user) {
      throw new appErr("User not found", 404)
    }
if ( ! await Compare(otp,user?.otp!)) {
      throw new appErr("InValid otp", 404)
  
}
    const hashPass = await Hash(password)



await this._userModel.updateOne({email:user?.email},{
password:hashPass,$unset:{otp:""}
})
    return res.status(200).json({ message: "Success to reset your password " })

  }



}

export default new userService()