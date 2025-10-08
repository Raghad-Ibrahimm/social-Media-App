import { NextFunction, Request, Response } from "express";
import postModel, { allowCommentEnum, AvailabilityEnum, Ipost } from "../../DB/model/post.model";
import { PostRepository } from "../../DB/repositories/post.repository";
import { userRepository } from "../../DB/repositories/user.repository";
import userModel from "../../DB/model/user.model";
import { appErr } from "../../utilts/classError";
import { deleteFiles, uploadFiles } from "../../utilts/s3.config";
import { v4 as uuidv4 } from 'uuid';
import commentModel, { Icomment, onModelEnum } from "../../DB/model/comment.model";
import { CommentRepository } from "../../DB/repositories/comment.repository";
import { postAvailability } from "../post/post.service";
import { HydratedDocument, Schema, Types } from "mongoose";


class CommentService {
  private _userModel = new userRepository(userModel)
  private _postModel = new PostRepository(postModel)
  private _commentModel = new CommentRepository(commentModel)


  constructor() { }

  createComment = async (req: Request, res: Response, next: NextFunction) => {

    const { postId, commentId } = req.params
    let { content, tags, attachments, onModel } = req.body


    let doc: HydratedDocument<Ipost | Icomment> | null =null




    if (commentId || onModel == onModelEnum.Comment) {

      const comment = await this._commentModel.findOne({
        _id: commentId,
        refId: postId
      }, undefined, {
        papulate: {
          path: "refId",
          match: {
            allowComment: allowCommentEnum.allow,
            $or: postAvailability(req)
          }
        }
      })

      if (!comment?.refId) {
        throw new appErr("comment not found or you are not authorized", 404)

      }

      doc =comment
    } else if (onModel == onModelEnum.Post) {
      const post = await this._postModel.findOne({
        _id: postId,
        allowComment: allowCommentEnum.allow,
        $or: postAvailability(req)
      })
      if (!post) {
        throw new appErr("post not found or you are not authorized", 404)
      }
doc =post
    }

    if (tags?.length
      &&
      (await this._userModel.find({ filter: { $_id: { $in: tags } } })).length !== tags?.length
    ) {
      throw new appErr("some tags are not valid", 400)
    }

    const assetFolderId = uuidv4()

    if (attachments?.length) {
      attachments = await uploadFiles({
        files: req.files as unknown as Express.Multer.File[],
        path: `users/${doc?.createdBy}/posts/${doc?.assetFolderId}/comments/${assetFolderId}`
      })
    }

    const comment = await this._commentModel.create({
      content,
      attachments,
      tags,
      assetFolderId,
      onModel,
      refId: doc?._id as unknown as Schema.Types.ObjectId,
      createdBy: req?.user?._id as unknown as Schema.Types.ObjectId
    });
    if (!comment) {
      await deleteFiles({
        urls: attachments || []
      })
      return new appErr("faild to create comment", 400)
    }



    return res.status(201).json({ message: "successfully", comment })
  }












}

export default new CommentService()