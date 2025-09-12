import { UpdateQuery } from "mongoose";
import { HydratedDocument, Model, ProjectionType, RootFilterQuery, UpdateWriteOpResult } from "mongoose";

export abstract class DbRepository <Tdecoment>{
    constructor(protected readonly model:Model<Tdecoment>){}

    async create (data:Partial<Tdecoment>):Promise<HydratedDocument<Tdecoment>>{
        return this.model.create(data)
    }

    async findOne (filter:RootFilterQuery<Tdecoment>,select?:ProjectionType<Tdecoment>):Promise<HydratedDocument<Tdecoment>|null>{
        return this.model.findOne(filter)
    }
    async updateOne (filter:RootFilterQuery<Tdecoment>,update:UpdateQuery<Tdecoment>):Promise<UpdateWriteOpResult>{
        return this.model.updateOne(filter,update)
    }


}