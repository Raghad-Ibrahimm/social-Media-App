import { Router } from "express";
import  uS from "./user.service.js";
import { validtion } from "../../middleware/validatore.js";
import { confirmEmailSchema, signINSchema, signUpSchema } from "./user.validation.js";

const userRouter = Router()

userRouter.post("/signup",validtion(signUpSchema),uS.signUp)
userRouter.patch("/confirmEmail",validtion(confirmEmailSchema),uS.confirmEmail)
userRouter.post("/signIn",validtion(signINSchema), uS.signIn)

export default userRouter