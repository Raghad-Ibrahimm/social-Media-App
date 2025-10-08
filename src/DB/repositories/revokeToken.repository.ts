
import { DbRepository } from "./db.repository.js";
import { IRevokeToken } from "../model/revokeToken.model.js";
import { Model } from "mongoose";


export class RevokeTokenRepository extends DbRepository<IRevokeToken> {
  constructor(protected override  model:Model<IRevokeToken>) {
    super(model)
  }
}