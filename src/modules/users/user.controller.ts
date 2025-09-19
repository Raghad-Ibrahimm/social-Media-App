import { Router } from "express";
import userService  from "./user.service.js";
import { confirmEmailSchema, forgetPasswordSchema, loginWithGmailSchema, logOutSchema, resetPasswordSchema, signINSchema, signUpSchema } from "./user.validation.js";``
import { validtion } from "../../middleware/validatore.js";
import { Authenticatin } from "../../middleware/Authentcation.js";
import { TokenType } from "../../utilts/token.js";

const userController:Router = Router();

userController.post("/signup", validtion(signUpSchema), userService.signUp);
userController.patch("/confirmEmail", validtion(confirmEmailSchema), userService.confirmEmail);
userController.post("/signIn", validtion(signINSchema), userService.signIn);
userController.post("/loginWithGmail",  validtion(loginWithGmailSchema),userService.logInWithGmail);
userController.get("/profile",Authenticatin(),userService.Profile)
userController.post("/logout",Authenticatin(),validtion(logOutSchema),userService.logOut)
userController.get("/refreashtoken",Authenticatin(TokenType.refresh),userService.refreashToken)
userController.patch("/forgetPassword",validtion(forgetPasswordSchema),userService.forgetPassword)
userController.patch("/resetPassword",validtion(resetPasswordSchema),userService.resetPassword)

export default userController;