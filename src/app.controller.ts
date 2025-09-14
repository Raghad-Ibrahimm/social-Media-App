import cors from "cors"
import { config } from "dotenv"
import express, { NextFunction, Request, Response } from "express"
import { rateLimit } from "express-rate-limit"
import helmet from "helmet"
import { resolve } from "path"
import connectionDB from "./DB/connectionDB.js"
import userController from "./modules/users/user.controller.js"
import { appErr } from "./utilts/classError.js"
config({path:resolve("./config/.env")})
const app:express.Application = express()
const port:string | number =process.env.PORT || 5000

const limiter = rateLimit({
    windowMs :4*60*1000,
    limit:10,
    message:{
        error:"game Over ..😂😂"
        
    },
    statusCode:429,
    legacyHeaders:false
})



const bootstrap =async()=>{
app.use(express.json())
app.use(cors())
app.use(helmet())
// app.use(limiter)
await connectionDB()

app.use("/users",userController)


app.get("",(req:Request,res:Response,next:NextFunction)=>{
    return res.status(200).json({message:"Welcome on my social media app .......❤️❤️❤️❤️"})
})










app.use("{/*demo}",(req:Request,res:Response,next:NextFunction)=>{
    throw new appErr (`404 page not found Invalid Url (${req.originalUrl}).......🤷‍♂️🤦🤦‍♂️`,404)
   

})



app.use((err:appErr,req:Request,res:Response,next:NextFunction)=>{
    return res.status(err.statusCode as unknown as number || 500).json({message:err.message,Stack:err.stack,Error:err})

})

app.listen((port),()=>{
    console.log(`server is running on port ${port}.........👌👌`);
    
})
}

export default bootstrap