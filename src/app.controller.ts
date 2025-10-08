import cors from "cors"
import { config } from "dotenv"
import express, { NextFunction, Request, Response } from "express"
import { rateLimit } from "express-rate-limit"
import helmet from "helmet"
import { resolve } from "path"
import connectionDB from "./DB/connectionDB"
import userController from "./modules/users/user.controller"
import { appErr } from "./utilts/classError"
import { pipeline } from "node:stream"
import { promisify } from "node:util"
import { createGetFilePerSignesUrl, deleteFile, deleteFiles, getFile, listFiles } from "./utilts/s3.config"
import { ListObjectsCommandOutput } from "@aws-sdk/client-s3"
import postRouter from "./modules/post/post.controller"
config({ path: resolve("./config/.env") })
const writePipeLine = promisify(pipeline)
const app: express.Application = express()
const port: string | number = process.env.PORT || 5000

const limiter = rateLimit({
    windowMs: 4 * 60 * 1000,
    limit: 10,
    message: {
        error: "game Over ..😂😂"

    },
    statusCode: 429,
    legacyHeaders: false
})



const bootstrap = async () => {
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    // app.use(limiter)
    await connectionDB()

    app.get("/upload/listfiles", async (req: Request, res: Response, next: NextFunction) => {

        // const { path } = req.params as unknown as { path: string[] }
       
        // const Key = path.join("/")
        
        let result = await listFiles({
            path:"users",

        })
        if (!result?.Contents) {
            throw new appErr("not found",404)
        }
        result = result?.Contents?.map(item => item.Key) as unknown as ListObjectsCommandOutput
        await deleteFiles({
        urls:result as unknown as string[],
        Quiet:true
          })
          


        return res.json({ message: "success", result })
    })
    //====================

    app.get("/upload/delete/*path", async (req: Request, res: Response, next: NextFunction) => {

        const { path } = req.params as unknown as { path: string[] }
       
        const Key = path.join("/")
        
        const result = await deleteFile({
            Key,

        })
        return res.status(204).json({ message: "success", result })
    })
    //====================
    app.get("/upload/deletefiles", async (req: Request, res: Response, next: NextFunction) => {

        // const { path } = req.params as unknown as { path: string[] }
       
        // const Key = path.join("/")
        
        const result = await deleteFiles({
          urls:[
            "socialMediaApp/users/68d4be14d4c82ce53edc6b12/af65fc7e-6f4c-4c94-a1aa-74c9f06db086_Screenshot 2025-08-30 002955.png",
            "socialMediaApp/users/68d4be14d4c82ce53edc6b12/c95a3b42-8c7e-4b67-8315-6ccb7d2f1f85_Screenshot 2025-09-24 234126.png"
          ]

        })
        return res.json({ message: "successful", result })
    })
//==================================
    app.get("/upload/pre-signed/*path", async (req: Request, res: Response, next: NextFunction) => {

        const { path } = req.params as unknown as { path: string[] }
       
const {downloadName}= req.query as {downloadName:string}
        const Key = path.join("/")
        
        const url = await createGetFilePerSignesUrl({
            Key,
            downloadName:downloadName||undefined
        })
        return res.json({ message: "success", url })
    })











    app.get("/upload/getfile/*path", async (req: Request, res: Response, next: NextFunction) => {

        const { path } = req.params as unknown as { path: string[] }
        const { downloadName } = req.query as  { downloadName: string }
        const Key = path.join("/")

        const reslut = await getFile({
            Key
        })

        const stream = reslut.Body as NodeJS.ReadableStream
        res.setHeader("content-Type", reslut?.ContentType!)
        if (downloadName) {
                    res.setHeader("Content-Disposition", `attachment; filename="${downloadName || Key.split("/").pop()}"`); // only apply it for  download

        }
        await writePipeLine(stream, res)



    })












    app.get("", (req: Request, res: Response, next: NextFunction) => {
        return res.status(200).json({ message: "Welcome on my social media app .......❤️❤️❤️❤️" })
    })



    app.use("/users", userController)
    app.use("/posts", postRouter)












    app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
        throw new appErr(`404 page not found Invalid Url (${req.originalUrl}).......🤷‍♂️🤦🤦‍♂️`, 404)


    })



    app.use((err: appErr, req: Request, res: Response, next: NextFunction) => {
        return res.status(err.statusCode as unknown as number || 500).json({ message: err.message, Stack: err.stack, Error: err })

    })

    app.listen((port), () => {
        console.log(`server is running on port ${port}.........👌👌`);

    })
}

export default bootstrap