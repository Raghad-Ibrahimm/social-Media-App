import { Request } from "express";
import multer, { FileFilterCallback, Multer } from "multer";
import { appErr } from "../utilts/classError";
import os from "node:os";
import { v4 as uuidv4 } from "uuid";
export const fileValidation = {
    image: ["image/png", "image/jpg", "image/jpeg"],
    audio: ["audio/mpeg", "audio/mp3"],
    video: ["video/mp3"],
    file: ["application/pdf", "application/msword"]
}
export enum StorageEnum{
    disk ="disk",
    cloud ="cloud"

}




export const multerCloud = ({
    fileTypes = fileValidation.image,
    storagtype = StorageEnum.cloud,
    maxSize = 5 //5 mb
}:
    {
        fileTypes?: string[],
        storagtype?: StorageEnum,
        maxSize?: number
    }):multer.Multer=> {
    const storage = storagtype=== StorageEnum.cloud? multer.memoryStorage() :multer.diskStorage({
        destination:os.tmpdir(),
        filename:function(req: Request, file: Express.Multer.File, cb){
         cb(null,`${uuidv4()}_${file.originalname}`)
        }
    })
    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (fileTypes.includes(file.mimetype)) {
          return  cb(null, true)
        } else {
            return cb(new appErr("invalid file type multer", 400))
        }
    

    }

    const upload = multer({ storage,limits:{fieldSize:1024*1024*maxSize}, fileFilter })
    return upload
}