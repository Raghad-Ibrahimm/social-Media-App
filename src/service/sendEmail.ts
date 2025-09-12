 import nodemailer  from "nodemailer"
import Mail from "nodemailer/lib/mailer/index.js";

export const sendEmail =async(mailOpthions:Mail.Options)=>{
const transporter = nodemailer.createTransport({
  service:"gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Wrap in an async IIFE so we can use await.
 
  const info = await transporter.sendMail({
    from: `"socialmediaApp" <${process.env.EMAIL}>`,
   ...mailOpthions
  });

  console.log("Message sent:", info.messageId);
};

export const generateOTP =async()=>{
  return Math.floor(Math.random()* (999999 -100000 +1)+10000)
}