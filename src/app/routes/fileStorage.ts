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
    this.router.post("/folder", this.c.createFolder.bind(this.c));

    this.router.put("/file/:id", this.c.update.bind(this.c));

    this.router.delete("/file/:id", this.c.remove.bind(this.c));

    this.router.get("/count", this.c.countStorage.bind(this.c));
    this.router.get("/list", this.c.findAndCountAll.bind(this.c));
    this.router.get("/file/:id", this.c.findOneView.bind(this.c));
    this.router.get("/list/slider", this.c.listSlider.bind(this.c));
    this.router.get("/sum-file", this.c.sumFile.bind(this.c));
  }
}

export default { router: new Routes().router };
