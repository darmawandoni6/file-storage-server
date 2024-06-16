import Controllers from "@controller/user";
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
    this.router.post("/register", this.c.register.bind(this.c));
  }
}

export default { router: new Routes().router };
