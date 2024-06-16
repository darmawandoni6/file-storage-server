import Usecases from "@usecase/user/user.usecase";
import type { NextFunction, Request, Response } from "express";
import type { ResJSON } from "src/type";

class Controllers {
  uc = new Usecases();

  async register(req: Request, res: Response<ResJSON<unknown>>, next: NextFunction): Promise<void> {
    try {
      this.uc.attributes = req.body;
      const access = await this.uc.register();
      res.cookie("token", access.token, { httpOnly: true, expires: access.expired });
      res.send({
        status: 200,
        data: access,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response<ResJSON<unknown>>, next: NextFunction): Promise<void> {
    try {
      this.uc.attributes = req.body;
      const access = await this.uc.login();

      res.cookie("token", access.token, { httpOnly: true, expires: access.expired });

      res.send({
        status: 200,
        data: access,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default Controllers;
