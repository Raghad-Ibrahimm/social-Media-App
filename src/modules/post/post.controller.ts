import { Router } from "express";
import pS from "./post.service";
import { Authenticatin } from "../../middleware/Authentcation";
import { fileValidation, multerCloud } from "../../middleware/multer.cloud";
import { validtion } from "../../middleware/validatore";
import * as PV from "./post.validtion";
import commentRouter from "../comment/comment.controller";



const postRouter: Router = Router({})
postRouter.use('/:postId/comments{/:commentId/reply}',commentRouter)

postRouter.post("/create",Authenticatin()
,multerCloud({fileTypes:fileValidation.image}).array("attachments",2),
validtion(PV.createPostSchema),
 pS.createPost)
 postRouter.patch("/:postId",Authenticatin(),validtion(PV.likePostSchema),pS.likePost)
 
 postRouter.patch("/update/:postId",Authenticatin(),
 multerCloud({fileTypes:fileValidation.image}).array("attachments",2)
 ,validtion(PV.updatePostSchema),pS.updatePost)


 postRouter.get("/get/posts",pS.getAllPosts)
 postRouter.get("/getPostsWithComments",pS.getAllPostsWithComments)

export default postRouter