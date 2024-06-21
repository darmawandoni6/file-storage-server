import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: require("sqlite3"),
  storage: "./development.sqlite3",
});
