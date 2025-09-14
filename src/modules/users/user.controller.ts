import { Router } from "express";
import userService  from "./user.service.js";
import { confirmEmailSchema, signINSchema, signUpSchema } from "./user.validation.js";``
import { validtion } from "../../middleware/validatore.js";
import { Authenticatin } from "../../middleware/Authentcation.js";

const userController:Router = Router();

userController.post("/signup", validtion(signUpSchema), userService.signUp);
userController.patch("/confirmEmail", validtion(confirmEmailSchema), userService.confirmEmail);
userController.post("/signIn", validtion(signINSchema), userService.signIn);
userController.get("/profile",Authenticatin(),userService.Profile)

export default userController;