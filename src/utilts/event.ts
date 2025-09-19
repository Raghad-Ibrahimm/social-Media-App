import {EventEmitter} from "events"
import { emailTemplate } from "../service/email.templ.js"
import { sendEmail } from "../service/sendEmail.js"

 export const eventEmitter = new EventEmitter()
eventEmitter.on("confirmEmail",async(data)=>{
    const {email ,otp}=data
await sendEmail({to:email,subject:"confirm Email",html:`${emailTemplate(otp as unknown as string,"Email confirmation")}`})

})
eventEmitter.on("ForgetPassword",async(data)=>{
    const {email ,otp}=data
await sendEmail({to:email,subject:"ForgetPassword",html:`${emailTemplate(otp as unknown as string,"ForgetPassword")}`})

})