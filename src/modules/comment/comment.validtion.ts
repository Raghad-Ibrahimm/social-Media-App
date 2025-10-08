import * as z from "zod"
import { generalRules } from "../../utilts/generalRules"
import { onModelEnum } from "../../DB/model/comment.model"




export const createCommentSchema ={
  params:z.strictObject({
  postId:generalRules.id.optional(),
  commentId:generalRules.id.optional()
  }),
    body:z.strictObject({
      content :z.string().min(1).max(10000).optional(),
      attachments:z.array(generalRules.file).optional(),
      tags:z.array(generalRules.id).refine((value)=>{
        return new Set(value).size === value?.length
        
      },{
        message:"Duplicate tags"
      }).optional(),
      onModel:z.enum(onModelEnum)
    }).superRefine((data,ctx)=>{
        if (!data?.attachments?.length && !data.content) {
            ctx.addIssue({
                code:"custom",
                path:["content"],
                message:"content or attachment is empty you must enter content at least"
            })
        }
    })
}























export type createCommentSchemaType = z.infer<typeof createCommentSchema.body>

