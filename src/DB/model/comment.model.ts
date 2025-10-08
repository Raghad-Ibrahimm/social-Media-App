
import {  model, models, Schema } from "mongoose";


export enum onModelEnum {
    Post = "Post",
    Comment ="Comment"
}
 


export interface Icomment{
    content?: string,
    attachments?:string[],
    assetFolderId?:string,
    createdBy:Schema.Types.ObjectId,
    tags:Schema.Types.ObjectId[],
    likes:Schema.Types.ObjectId[],

    deletedAt?:Date,
    deletedBy?:Schema.Types.ObjectId,
    refId:Schema.Types.ObjectId,
  onModel:onModelEnum,
    restoreAt?:Date,
    restoreBy?:Schema.Types.ObjectId,


}






export const commentSchema =new Schema<Icomment>({
    content: {type: String,minLength:5,maxLength:10000,required:function(){return this.attachments?.length === 0}},
    attachments:[String],
    assetFolderId:String,

    createdBy:{type:Schema.Types.ObjectId,ref:"User",required:true},
   
    tags:[{type:Schema.Types.ObjectId,ref:"User"}],
    likes:[{type:Schema.Types.ObjectId,ref:"User"}],

   
    deletedAt:{type:Date},
    deletedBy:{type:Schema.Types.ObjectId,ref:"User"},
    refId:{type:Schema.Types.ObjectId,refPath:"onModel",required:true},
    // commentId:{type:Schema.Types.ObjectId,ref:"Comment"},
    onModel:{type:String,enum:onModelEnum  , require:true},
    restoreAt:{type:Date},
    restoreBy:{type:Schema.Types.ObjectId,ref:"User"},
    

},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    strictQuery:true
});



commentSchema.pre(["findOne","find","findOneAndDelete","findOneAndUpdate"],function (next){
    const query = this.getQuery()
    const {paranoid,...rest}=query
    if (paranoid===false) {
        this.setQuery({...rest})
    }else{
        this.setQuery({...rest,deletedAt:{$exists:false}})
    }
    next()
})










commentSchema.virtual("replies",{
    ref:"Comment",
    localField:"_id",
    foreignField:"postId"
})








const commentModel = models.Comment || model("Comment",commentSchema)
export default commentModel
