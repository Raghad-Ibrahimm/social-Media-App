import { EventEmitter } from "events";
import { sendEmail } from "../service/sendEmail.js";
import { emailTemplate } from "../service/email.templ.js";
export const eventEmitter = new EventEmitter();
eventEmitter.on("confirmEmail", async (data) => {
    const { email, otp } = data;
    await sendEmail({ to: email, subject: "confirm Email", html: `${emailTemplate(otp, "Email confirmation")}` });
});
