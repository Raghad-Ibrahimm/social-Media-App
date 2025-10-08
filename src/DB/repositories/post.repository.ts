import {  Model } from "mongoose";

import { DbRepository } from "./db.repository";
import { Ipost } from "../model/post.model";


export class PostRepository extends DbRepository<Ipost> {
constructor(protected override   model:Model<Ipost>){
    super(model)
}

}