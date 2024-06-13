import fileStorage from "@model/fileStorage";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `./${process.env.DATABASE}.sqlite3`,
});

const db = {
  sequelize,
  fileStorage: fileStorage.model(sequelize),
};

export default db;
