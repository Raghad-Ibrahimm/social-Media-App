import { Router } from "express";
import CS from "./comment.service";
import { Authenticatin } from "../../middleware/Authentcation";
import { fileValidation, multerCloud } from "../../middleware/multer.cloud";
import { validtion } from "../../middleware/validatore";
import * as CV from "./comment.validtion";



const commentRouter: Router = Router({mergeParams:true})

 commentRouter.post("/create",
 Authenticatin()
 ,multerCloud({fileTypes:fileValidation.image}).array("attachments",2),
 validtion(CV.createCommentSchema),
 CS.createComment)
 
export default commentRouter