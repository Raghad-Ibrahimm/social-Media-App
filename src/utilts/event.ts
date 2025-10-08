import { EventEmitter } from "events"
import { emailTemplate } from "../service/email.templ"
import { sendEmail } from "../service/sendEmail.js"
import { deleteFile, getFile } from "./s3.config"
import { userRepository } from "../DB/repositories/user.repository"
import userModel from "../DB/model/user.model"

export const eventEmitter = new EventEmitter()
eventEmitter.on("confirmEmail", async (data) => {
    const { email, otp } = data
    await sendEmail({ to: email, subject: "confirm Email", html: `${emailTemplate(otp as unknown as string, "Email confirmation")}` })

})
eventEmitter.on("ForgetPassword", async (data) => {
    const { email, otp } = data
    await sendEmail({ to: email, subject: "ForgetPassword", html: `${emailTemplate(otp as unknown as string, "ForgetPassword")}` })

})
eventEmitter.on("uploadPrfileImage", async (data) => {
    const { userId, oldKey, Key, expiresIn } = data
    console.log({ data });

    const _userModel = new userRepository(userModel)


    setTimeout(async () => {

        try {
            await getFile({ Key })
     await _userModel.findOneAndUpdate({_id: userId }, {  $unset: {tempProfileImage: "" } })
//delete old file
if (oldKey) {
    await deleteFile({Key:oldKey})
}
console.log("succcess");

        } catch (error: any) {
            console.log({ error });
            if (error?.Code == 'NoSuchKey') {
                if (!oldKey) {
                    await _userModel.findOneAndUpdate({_id: userId }, {   $unset: { profileImage: "" } })
                }else{
                   await _userModel.findOneAndUpdate({_id: userId }, {   $set: { profileImage: oldKey },$unset: {tempProfileImage: "" } })

                }
            }

        }


    }, expiresIn * 1000)

})
