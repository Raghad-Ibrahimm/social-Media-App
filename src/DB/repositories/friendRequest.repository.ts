import {  Model } from "mongoose";
import { DbRepository } from "./db.repository";
import { IFriend } from "../model/friendRequest.model";


export class friendRequestRepository extends DbRepository<IFriend> {
constructor(protected override  model:Model<IFriend>){
    super(model)
}

}