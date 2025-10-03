import { Router } from "express";
import userService  from "./user.service";
import { confirmEmailSchema, forgetPasswordSchema, freezeSchema, loginWithGmailSchema, logOutSchema, resetPasswordSchema, signINSchema, signUpSchema, unFreezedSchema } from "./user.validation";
import { validtion } from "../../middleware/validatore";
import { Authenticatin } from "../../middleware/Authentcation";
import { TokenType } from "../../utilts/token";
import { fileValidation, multerCloud } from "../../middleware/multer.cloud";

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

userController.patch("/freeze{/:userId}",Authenticatin(TokenType.access),validtion(freezeSchema),userService.freezeAccount)
userController.patch("/unfreezed/:userId",Authenticatin(TokenType.access),validtion(unFreezedSchema),userService.unFreezedAccount)


userController.post("/sendurlToUpload",Authenticatin() ,userService.sendurlToUpload)
userController.post("/uploadProfileImage",Authenticatin() ,userService.uploadProfileImage)
userController.post("/uploadfiles",Authenticatin(),
    multerCloud({fileTypes:fileValidation.image}).array("files")
    ,userService.uploudImages)
userController.post("/uploadSingleImage",Authenticatin(),
    multerCloud({fileTypes:fileValidation.image}).single("file")
    ,userService.uploadSingleImage)

export default userController;