
import mongoose from "mongoose";
import {  model, models, Schema, Types } from "mongoose";




export interface IFriend{
  
    createdBy:Types.ObjectId,
    sendTo:Types.ObjectId,

    acceptedAt?:Date,



}






export const friendReqSchema =new Schema<IFriend>({


    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
   sendTo:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
   
    acceptedAt:{type:Date},


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



friendReqSchema.pre(["findOne","find","findOneAndDelete","findOneAndUpdate"],function (next){
    const query = this.getQuery()
    const {paranoid,...rest}=query
    if (paranoid===false) {
        this.setQuery({...rest})
    }else{
        this.setQuery({...rest,deletedAt:{$exists:false}})
    }
    next()
})








const friendRequestModel = models.friendRequest || model("friendRequest",friendReqSchema)
export default friendRequestModel
