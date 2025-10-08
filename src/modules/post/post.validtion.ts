import * as z from "zod"
import { allowCommentEnum, AvailabilityEnum } from "../../DB/model/post.model"
import { generalRules } from "../../utilts/generalRules"

export enum Action {
  like="like",
  unLike="unLike",
}



export const createPostSchema ={
    body:z.strictObject({
      content :z.string().min(5).max(10000).optional(),
      attachments:z.array(generalRules.file).max(2).optional(),
      assetFolderId:z.string().optional(),
      
      allowComment:z.enum(allowCommentEnum).default(allowCommentEnum.allow).optional(),
      availability:z.enum(AvailabilityEnum).default(AvailabilityEnum.public).optional(),
     
      tags:z.array(generalRules.id).refine((value)=>{
        return new Set(value).size === value?.length
        
      },{
        message:"Duplicate tags"
      }).optional()

    }).superRefine((data,ctx)=>{
        if (!data?.content && !data.attachments?.length) {
            ctx.addIssue({
                code:"custom",
                path:["content"],
                message:"content or attachment is empty you must enter content at least"
            })
        }
    })
}












export const updatePostSchema ={
    body:z.strictObject({
      content :z.string().min(5).max(10000).optional(),
      attachments:z.array(generalRules.file).max(2).optional(),
      assetFolderId:z.string().optional(),
      
      allowComment:z.enum(allowCommentEnum).default(allowCommentEnum.allow).optional(),
      availability:z.enum(AvailabilityEnum).default(AvailabilityEnum.public).optional(),
     
      tags:z.array(generalRules.id).refine((value)=>{
        return new Set(value).size === value?.length
        
      },{
        message:"Duplicate tags"
      }).optional()

    }).superRefine((data,ctx)=>{
        if (!Object.values(data).length) {
            ctx.addIssue({
                code:"custom",
              
                message:"At least on field is required"
            })
        }
    })
}










export const likePostSchema ={
  params:z.strictObject({
    postId:generalRules.id
  }).required(),
  query:z.strictObject({
    action:z.enum(Action).default(Action.like)
  })
}

export type createPostSchemaType = z.infer<typeof createPostSchema.body>
export type likePostSchemaType = z.infer<typeof likePostSchema.params>
export type likePostQuery = z.infer<typeof likePostSchema.query>
