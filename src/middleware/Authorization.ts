import { NextFunction, Request, Response } from "express";
import { RoleType } from "../DB/model/user.model";
import { appErr } from "../utilts/classError";


export const Authorization = ({accessRoles =[]}:{accessRoles:RoleType[]})=>{
return (req: Request, res: Response, next: NextFunction) =>{
if (!accessRoles.includes(req.user?.role!)) {
            throw new appErr(" Unauthorized", 401)

}
next()
}
}