import { upload } from "@app/middleware/multer";
import Controllers from "@controller/fileStorage";
import jwt from "@helper/jwt";
import { Router } from "express";

class Routes {
  router: Router;
  c = new Controllers();

  constructor() {
    this.router = Router();

    this.routes();
  }

  routes() {
    this.router.post("/file", upload.single("file"), this.c.createFile.bind(this.c));
    this.router.post("/folder", jwt.verifyAccessToken, this.c.createFolder.bind(this.c));

    this.router.put("/file/:id", jwt.verifyAccessToken, this.c.update.bind(this.c));

    this.router.delete("/file/:id", jwt.verifyAccessToken, this.c.remove.bind(this.c));

    this.router.get("/count", jwt.verifyAccessToken, this.c.countStorage.bind(this.c));
    this.router.get("/list", jwt.verifyAccessToken, this.c.findAndCountAll.bind(this.c));
    this.router.get("/file/:id", jwt.verifyAccessToken, this.c.findOneView.bind(this.c));
    this.router.get("/list/slider", jwt.verifyAccessToken, this.c.listSlider.bind(this.c));
    this.router.get("/sum-file", jwt.verifyAccessToken, this.c.sumFile.bind(this.c));
  }
}

export default { router: new Routes().router };
