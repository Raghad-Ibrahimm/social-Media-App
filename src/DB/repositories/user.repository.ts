import { HydratedDocument, Model } from "mongoose";
import { Iuser } from "../model/user.model.js";
import { DbRepository } from "./db.repository.js";
import { appErr } from "../../utilts/classError.js";


export class userRepository extends DbRepository<Iuser> {
constructor(protected override  readonly model:Model<Iuser>){
    super(model)
}
    async createOneUser(data:Partial<Iuser>):Promise<HydratedDocument<Iuser>>{
         const user:HydratedDocument<Iuser> =  await this.model.create(data)
    if (!user) {
      throw new appErr("fail to create user")
    }
    return user
}
}