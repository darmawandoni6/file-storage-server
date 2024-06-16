import db from "@driver/index";
import type { Attributes } from "./user.model";
import type { WhereOptions } from "sequelize";

class Repository {
  private db = db.user;

  async create(payload: Attributes) {
    try {
      await this.db.create(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findOne(where: WhereOptions<Attributes>) {
    try {
      const data = await this.db.findOne({ where });
      return data?.toJSON();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default Repository;
