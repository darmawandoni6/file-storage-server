import bcrypt from "@helper/bcrypt";
import type { User } from "@usecase/user/user.type";
import Usecases from "@usecase/user/user.usecase";
import type { NextFunction, Request, Response } from "express";
import type { ResJSON } from "src/type";

class Controllers {
  uc = new Usecases();

  async register(req: Request, res: Response<ResJSON<unknown>>, next: NextFunction): Promise<void> {
    try {
      req.body.password = bcrypt.encrypt(req.body.password);
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
  async logout(req: Request, res: Response<ResJSON<null>>, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("token");
      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async profile(req: Request, res: Response<ResJSON<User | undefined>>, next: NextFunction): Promise<void> {
    try {
      this.uc.where = { email: res.locals.email };
      const data = await this.uc.profile();

      if (data) data.password = "";

      res.send({
        status: 200,
        data: data,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> {
    try {
      this.uc.where = { email: res.locals.email };
      this.uc.attributes = req.body;
      await this.uc.update();

      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default Controllers;
