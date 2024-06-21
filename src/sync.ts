import "dotenv/config";

import db from "@driver/index";

import { DataTypes } from "sequelize";

const queryInterface = db.sequelize.getQueryInterface();

const addColumn = async () => {
  try {
    // add column
  } catch (error) {
    return Promise.reject(error);
  }
};

db.sequelize
  .sync()
  .then(async () => {
    console.log("Synced db.");
    // await addColumn();
    await db.user.sync();
    await db.fileStorage.sync();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
    process.exit(-1);
  });
