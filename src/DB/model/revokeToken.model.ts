import mongoose, { Types } from "mongoose";


export interface IRevokeToken {
    userId: Types.ObjectId,
    tokenId: string,
    expireAt: Date
}

const RevokeTokenSchema = new mongoose.Schema<IRevokeToken>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    expireAt: { type: Date, required: true },
    tokenId: { type: String, required: true },

}, {
    timestamps: true,
    toObject: { virtuals: true },//to show virtuals in log js
    toJSON: { virtuals: true }//to show virtuals in postman and anothr env
})


const RevokeTokenModel = mongoose.models.RevokeToken || mongoose.model<IRevokeToken>("RevokeToken", RevokeTokenSchema)
export default RevokeTokenModel