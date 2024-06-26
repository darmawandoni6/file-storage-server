import "dotenv/config";

import { app, message, port } from "./app";
import db from "@driver/index";

const conection = async () => {
  try {
    await db.sequelize.sync();
  } catch (error) {
    return Promise.reject(error);
  }
};

app.listen(port, async () => {
  try {
    await conection();
    console.log(message);
  } catch (error) {
    console.log((error as Error).message);
    process.exit(-1);
  }
});
