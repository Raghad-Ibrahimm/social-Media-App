import { Schema } from "mongoose";


export enum allowCommentEnum{
    allow ="allow",
  deny="deny"
}
export enum AvailabilityEnum{
    public ="public",
  private ="private",
  friends ="friends"
}



export interface Ipost{
    content?: string,
    attachments?:string[],
    assetFolderId?:string,
    createdBy:Schema.Types.ObjectId,
    tags:Schema.Types.ObjectId[],
    likes:Schema.Types.ObjectId[],

    allowComment:allowCommentEnum,
    availability:AvailabilityEnum,

    deletedAt?:Date,
    deletedBy?:Schema.Types.ObjectId,

    restoreAt?:Date,
    restoreBy?:Schema.Types.ObjectId,


}





// export const postSchema =new Schema<Ipost>({
//     content: {type: String,minLength:5,maxLength:10000,required:function(){return this.attachments?.length === 0}},

//     attachments?:string[],
//     assetFolderId?:string,
//     createdBy:Schema.Types.ObjectId,
//     tags:Schema.Types.ObjectId[],
//     likes:Schema.Types.ObjectId[],

//     allowComment:allowCommentEnum,
//     availability:AvailabilityEnum,

//     deletedAt?:Date,
//     deletedBy?:Schema.Types.ObjectId,

//     restoreAt?:Date,
//     restoreBy?:Schema.Types.ObjectId,


// })