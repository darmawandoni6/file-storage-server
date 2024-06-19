import Repository from "@database/user/user.repository";
import type { WhereOptions } from "sequelize";
import type { Attributes } from "@database/user/user.model";
import createHttpError from "http-errors";
import bcrypt from "@helper/bcrypt";
import jwt from "@helper/jwt";

class Usecases {
  private repository = new Repository();
  where: WhereOptions<Attributes> = {};
  attributes: Partial<Attributes> = {};

  private async generateToken() {
    try {
      const data = this.attributes as Attributes;

      data.password = "";
      const token = jwt.signToken(data);

      const expired = new Date(); // Now
      expired.setDate(expired.getDate() + parseInt(process.env.EXP_TOKEN, 10));

      return { token, expired };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async register() {
    try {
      await this.repository.create(this.attributes as Attributes);
      const generate = this.generateToken();

      return generate;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async login() {
    try {
      const { email, password } = this.attributes;
      const data = await this.repository.findOne({ email });

      if (!data) {
        throw createHttpError.BadRequest("Email not found");
      }

      const match = bcrypt.compare(password as string, data.password);

      if (!match) {
        throw createHttpError.BadRequest("Email not found");
      }

      this.attributes = data;
      const generate = this.generateToken();

      return generate;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async profile() {
    try {
      const data = await this.repository.findOne(this.where);
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update() {
    try {
      if (!this.attributes.password) this.attributes.password = undefined;
      await this.repository.update(this.attributes, this.where);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default Usecases;
