import fileStorageModel from "@database/fileStorage/fileStorage.model";
import { sequelize } from "./sqlite";
import userModel from "@database/user/user.model";

const db = {
  sequelize,
  user: userModel.model(sequelize),
  fileStorage: fileStorageModel.model(sequelize),
};

db.user.hasMany(db.fileStorage, {
  foreignKey: "email",
});
db.fileStorage.belongsTo(db.user, {
  foreignKey: "email",
});

export default db;
