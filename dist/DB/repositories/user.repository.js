import { DbRepository } from "./db.repository.js";
import { appErr } from "../../utilts/classError.js";
export class userRepository extends DbRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    async createOneUser(data) {
        const user = await this.model.create(data);
        if (!user) {
            throw new appErr("fail to create user");
        }
        return user;
    }
}
