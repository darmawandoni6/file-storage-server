import fileStorageModel from "@database/fileStorage/fileStorage.model";
import { sequelize } from "./sqlite";

const db = {
  sequelize,
  fileStorage: fileStorageModel.model(sequelize),
};

export default db;
