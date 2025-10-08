import { NextFunction, Request, Response } from "express";
import postModel, { AvailabilityEnum, Ipost } from "../../DB/model/post.model";
import { PostRepository } from "../../DB/repositories/post.repository";
import { userRepository } from "../../DB/repositories/user.repository";
import userModel from "../../DB/model/user.model";
import { appErr } from "../../utilts/classError";
import { deleteFiles, uploadFiles } from "../../utilts/s3.config";
import { v4 as uuidv4 } from 'uuid';
import { Action, likePostQuery, likePostSchemaType } from "./post.validtion";
import { UpdateQuery } from "mongoose";
import { readonly, unknown } from "zod";







export const postAvailability = (req: Request) => {
  return [
    { availability: AvailabilityEnum.public },
    { availability: AvailabilityEnum.private, createdBy: req.user?._id },
    { availability: AvailabilityEnum.friends, createdBy: { $in: [...(req.user?.friends || []), req.user?._id] } },
    { availability: { $ne: AvailabilityEnum.private }, tags: { $in: req.user?._id } }
  ]
}





class PostService {
  private _userModel = new userRepository(userModel)
  private _postModel = new PostRepository(postModel)

  constructor() { }

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    if (req?.body?.tags?.length
      &&
      (await this._userModel.find({ _id: { $in: req?.body?.tags } })).length !== req?.body?.tags?.length
    ) {
      throw new appErr("invalid userr id", 400)
    }

    const assetFolderId = uuidv4()
    let attachments: string[] = []
    if (req?.files?.length) {
      attachments = await uploadFiles({
        files: req.files as unknown as Express.Multer.File[],
        path: `users/${req?.user?._id}/posts/${assetFolderId}`
      })
    }

    const post = await this._postModel.create({
      ...req.body,
      attachments,
      assetFolderId,
      createdBy: req.user?._id
    })
    if (!post) {
      await deleteFiles({ urls: attachments || [] })
      throw new appErr('Faild to create post', 500)
    }


    return res.status(201).json({ message: "Post created successfully", post })
  }
  likePost = async (req: Request, res: Response, next: NextFunction) => {

    const { postId }: likePostSchemaType = req.params as likePostSchemaType
    const { action }: likePostQuery = req.query as likePostQuery

    let updateQuery: UpdateQuery<Ipost> = { $addToSet: { likes: req?.user?._id } }

    if (action === Action.unLike) {
      updateQuery = { $pull: { likes: req?.user?._id } }
    }

    const post = await this._postModel.findOneAndUpdate(
      {
        _id: postId,
        $or: [
          { availability: AvailabilityEnum.public },
          { availability: AvailabilityEnum.private, createdBy: req?.user?._id },
          { availability: AvailabilityEnum.friends, createdBy: { $in: [...req.user?.friends || [], req.user?._id] } },
        ]
      }
      , updateQuery,
      { new: true })
    if (!post) {
      throw new appErr("Faild to like post", 404)
    }

    return res.status(201).json({ message: "like successfully", post })
  }








  updatePost = async (req: Request, res: Response, next: NextFunction) => {

    const { postId }: likePostSchemaType = req.params as likePostSchemaType



    const post = await this._postModel.findOne(
      {
        _id: postId,
        createdBy: req.user?._id,
        // paranoid:false
      })


    if (!post) {
      throw new appErr("Faild to update post or unAuthorized", 404)
    }

    if (req?.body?.content) {
      post.content = req?.body?.content
    }
    if (req?.body?.allowComment) {
      post.allowComment = req?.body?.allowComment
    }
    if (req?.body?.availability) {
      post.availability = req?.body?.availability
    }
    if (req?.files?.length) {
      await deleteFiles({ urls: post.attachments || [] })
      post.attachments = await uploadFiles({
        files: req?.files as unknown as Express.Multer.File[],
        path: `users/${req?.user?._id}/posts/${post.assetFolderId}`
      })
    }

    if (req?.body?.tags?.length) {
      if (req?.body?.tags?.length &&
        (await this._userModel.find({ _id: { $in: req?.body?.tags } })).length !== req?.body?.tags?.length
      ) {
        throw new appErr("inValid user iid", 400)
      }
      post.tags = req.body.tags
    }

    await post.save()


    return res.status(201).json({ message: "updated successful", post })
  }


  getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    let { page = 1, limit = 5 } = req.query as unknown as { page: number, limit: number }


    const {docs,currentPage,count,numderOfPage} = await this._postModel.paginate(
      { filter: {}, query: { page, limit } }
    )
    return res.status(200).json({ message: "success",  page:currentPage,DocumentCount:count,numderOfPage,posts:docs})
  }
  getAllPostsWithComments = async (req: Request, res: Response, next: NextFunction) => {
   

    const posts = await this._postModel.find(
      { filter: {}, 
      options: {
         populate:[{
          path:"Comments",
          match:{
            commentId:{$exists:false}
          },
          populate:{
            path:"replies",
 
          }

         }] }
        
        }
    )
    return res.status(200).json({ message: "success", posts})
  }





}

export default new PostService()