import "dotenv/config";

import db from "@driver/sqlite";
import { app, message, port } from "./app";

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
    app.listen(port, () => {
      console.log(message);
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
    process.exit(-1);
  });
