import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client, ServiceInputTypes } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid"
import { StorageEnum } from "../middleware/multer.cloud";
import { createReadStream } from "node:fs"
import { appErr } from "./classError";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const s3config = () => {
    return new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
            accessKeyId: process.env.AWA_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }

    })
};


export const uploadFile = async ({
    storeType = StorageEnum.cloud,
    Bucket = process.env.AWS_BUKET_NAME!,
    path = "general",
    ACL = "private" as ObjectCannedACL,
    file
}: {
    storeType?: StorageEnum
    Bucket?: string,
    ACL?: ObjectCannedACL,
    path?: string,
    file: Express.Multer.File,


}): Promise<string> => {


    const command = new PutObjectCommand({
        Bucket,
        ACL,
        Key: `${process.env.APPLICATION_APP_NAME}/${path}/${uuidv4()}_${file.originalname}`,
        Body: storeType === StorageEnum.cloud ? file.buffer : createReadStream(file.path),
        ContentType: file.mimetype
    })

    await s3config().send(command)
    if (!command?.input?.Key) {
        throw new appErr("faild to upload file to s3..............😮😮", 500)
    }
    return command.input.Key
};


export const uploadLargeFile = async (
    {
        storeType = StorageEnum.cloud,
        Bucket = process.env.AWS_BUKET_NAME!,
        path = "general",
        ACL = "private" as ObjectCannedACL,
        file
    }: {
        storeType?: StorageEnum
        Bucket?: string,
        ACL?: ObjectCannedACL,
        path?: string,
        file: Express.Multer.File,


    }
): Promise<string> => {
    const upload = new Upload({
        client: s3config(),
        params: {
            Bucket,
            ACL,
            Key: `${process.env.APPLICATION_APP_NAME}/${path}/${uuidv4()}_${file.originalname}`,
            Body: storeType === StorageEnum.cloud ? file.buffer : createReadStream(file.path),
            ContentType: file.mimetype
        }
    })

    upload.on("httpUploadProgress", (progress) => {
        console.log(progress);

    })

    const { Key } = await upload.done();
    if (!Key) {
        throw new appErr("Faild to upload file to s3", 500)
    }
    return Key
};
export const uploadFiles = async ({
    storeType = StorageEnum.cloud,
    Bucket = process.env.AWS_BUKET_NAME!,
    path = "general",
    ACL = "private" as ObjectCannedACL,
    files,
    useLarge = false
}: {
    storeType?: StorageEnum
    Bucket?: string,
    ACL?: ObjectCannedACL,
    path?: string,
    files: Express.Multer.File[],
    useLarge?: boolean


}) => {
    let urls: string[] = []
    if (useLarge == true) {
        urls = await Promise.all(files.map(file => uploadLargeFile({ storeType, Bucket, ACL, path, file })))
    } else {
        urls = await Promise.all(files.map(file => uploadFile({ storeType, Bucket, ACL, path, file })))
    }
    return urls
}





export const createUploadFilePerSignedUrl = async ({
    originalname,
    ContentType,
    path ='general',
     Key=`${process.env.APPLICATION_APP_NAME}/${path}/${uuidv4()}_${originalname}`,
    Bucket = process.env.AWS_BUKET_NAME!,
    expiresIn=60
}:{
    Key?:string,
     originalname:string,
    ContentType:string,
    path?:string,
    Bucket ?: string,
    expiresIn?:number
}) => {
    const command = new PutObjectCommand({
        ContentType,
        Key: `${process.env.APPLICATION_APP_NAME}/${path}/${uuidv4()}_${originalname}`,
        Bucket,

    })
    const url = await getSignedUrl(s3config(), command, { expiresIn })
    return {url,Key}
}












//get file
export const getFile =async({
    Key,
    Bucket =process.env.AWS_BUKET_NAME!
}:{
    Key:string,
    Bucket?:string

})=>{
const command = new GetObjectCommand({
    Bucket,
    Key
})
return await s3config().send(command)
}















// createGetFilePerSignesUrl
export const createGetFilePerSignesUrl =async({
    Key,
    Bucket =process.env.AWS_BUKET_NAME!,
      expiresIn=60*60,
      downloadName
}:{
    Key:string,
    Bucket?:string,
     expiresIn?:number,
     downloadName?:string |undefined

})=>{
    const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition:downloadName?`attachment; filename="${downloadName}"`:undefined
})
    const url = await getSignedUrl(s3config(),command,{expiresIn})
 
    return url
}


//delete file

export const deleteFile =async({
    Key,
    Bucket =process.env.AWS_BUKET_NAME!,
   
      
}:{
    Key:string,
    Bucket?:string,


})=>{
        const command = new DeleteObjectCommand({
    Bucket,
    Key,
})

return await s3config().send(command)

}
// delete filllesssss
export const deleteFiles = async(
    {
    urls,
    Bucket =process.env.AWS_BUKET_NAME!,
   Quiet =false
      
}:{
    urls:string[],
    Bucket?:string,
Quiet?:boolean

}
)=>{

const command = new DeleteObjectsCommand({
    Bucket,
    Delete:{
        Objects: urls.map(url=>({Key:url})),
        Quiet
    },

})
return await s3config().send(command)



}
// listFiles
export const listFiles =async (
  {

    Bucket =process.env.AWS_BUKET_NAME!,
     path
}:{
    Bucket?:string,
    path?:string
}
)=>{
    const  command= new ListObjectsV2Command({
        Bucket,
        Prefix:`${process.env.APPLICATION_APP_NAME}/${path}`
    })
    return await s3config().send(command)
}

//deletefiles dy prefix

// export const deletefolder_perfix =async(
//     {path}:{path:string}
// )=>{
//     const command = new DeleteObje({
//          path
//     })
  
//      return await getSignedUrl(s3config(),command)
// }