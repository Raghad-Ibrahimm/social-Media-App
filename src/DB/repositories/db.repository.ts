import { DeleteResult, QueryOptions, UpdateQuery } from "mongoose";
import { HydratedDocument, Model, ProjectionType, RootFilterQuery, UpdateWriteOpResult } from "mongoose";

export abstract class DbRepository <Tdecoment>{
    constructor(protected readonly model:Model<Tdecoment>){}

    async create (data:Partial<Tdecoment>):Promise<HydratedDocument<Tdecoment> | null>{
        return await this.model.create(data)
    }

    async findOne (filter:RootFilterQuery<Tdecoment>,select?:ProjectionType<Tdecoment>):Promise<HydratedDocument<Tdecoment>|null>{
        return await this.model.findOne(filter)
    }
    async updateOne (filter:RootFilterQuery<Tdecoment>,update:UpdateQuery<Tdecoment>):Promise<UpdateWriteOpResult>{
        return await this.model.updateOne(filter,update)
    }
    async findOneAndUpdate (filter:RootFilterQuery<Tdecoment>,update:UpdateQuery<Tdecoment>,options:QueryOptions<Tdecoment> | null = {new:true} ):Promise<HydratedDocument<Tdecoment> | null>{
        return await this.model.findOneAndUpdate(filter,update,options)
    }
    async deleteOne (filter:RootFilterQuery<Tdecoment>):Promise<DeleteResult>{
        return await this.model.deleteOne(filter)
    }


}