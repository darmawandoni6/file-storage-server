import Controllers from "@controller/user";
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
    this.router.post("/login", this.c.login.bind(this.c));
    this.router.post("/logout", this.c.logout.bind(this.c));
    this.router.post("/register", this.c.register.bind(this.c));

    this.router.get("/profile", jwt.verifyAccessToken, this.c.profile.bind(this.c));
    this.router.put("/profile", jwt.verifyAccessToken, this.c.update.bind(this.c));
  }
}

export default { router: new Routes().router };
