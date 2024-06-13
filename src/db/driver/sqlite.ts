import { Sequelize } from "sequelize";
import fileStorage from "../models/fileStorage";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `./${process.env.ENV}.sqlite3`,
});

const db = {
  sequelize,
  fileStorage: fileStorage.model(sequelize),
};

export default db;
