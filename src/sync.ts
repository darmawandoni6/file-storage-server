import "dotenv/config";

import db from "./db/driver/sqlite";
import { DataTypes } from "sequelize";

const queryInterface = db.sequelize.getQueryInterface();

const addColumn = async () => {
  try {
    await queryInterface.addColumn("storage", "star", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

db.sequelize
  .sync()
  .then(async () => {
    console.log("Synced db.");
    await addColumn();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
    process.exit(-1);
  });
