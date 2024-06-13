import "dotenv/config";

import { app, message, port } from "./app";
import db from "./db/driver/sqlite";

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
