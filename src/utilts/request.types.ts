import { HydratedDocument } from "mongoose";
import { Iuser } from "../DB/model/user.model.js";
import { JwtPayload } from "jsonwebtoken";


declare module "express-serve-static-core"{
    interface Request {
         user?: HydratedDocument<Iuser>,
           decoded?: JwtPayload
    }
}