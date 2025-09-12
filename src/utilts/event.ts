import {EventEmitter} from "events"
import { generateOTP, sendEmail } from "../service/sendEmail.js"
import { emailTemplate } from "../service/email.templ.js"

 export const eventEmitter = new EventEmitter()
eventEmitter.on("confirmEmail",async(data)=>{
    const {email ,otp}=data
await sendEmail({to:email,subject:"confirm Email",html:`${emailTemplate(otp as unknown as string,"Email confirmation")}`})

})