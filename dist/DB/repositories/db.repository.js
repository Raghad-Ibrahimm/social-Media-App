export class DbRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findOne(filter, select) {
        return this.model.findOne(filter);
    }
    async updateOne(filter, update) {
        return this.model.updateOne(filter, update);
    }
}
