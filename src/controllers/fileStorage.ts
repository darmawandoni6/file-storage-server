import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { randomUUID } from "crypto";
import { enumFile } from "@helper/enum";
import type { CountStorage, FileStorage, ListSlider } from "@usecase/fileStorage/fileStorage.type";
import type { ResJSON } from "src/type";
import Usecases from "@usecase/fileStorage/fileStorage.usecase";

class Controllers {
  private uc = new Usecases();

  async createFolder(req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> {
    try {
      const { body } = req;

      this.uc.attributes = {
        id: randomUUID(),
        name: body.folder,
        folder: body.sub,
      };
      await this.uc.create();

      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async createFile(req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw createHttpError.NotFound("Error file");

      let name = Date.now() + "-" + Math.round(Math.random() * 1e9);
      name = req.file.fieldname + "-" + name;

      const { file, body } = req;

      this.uc.attributes = {
        id: name,
        file: file.buffer,
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        folder: body.folder,
      };

      await this.uc.create();

      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async findAndCountAll(req: Request, res: Response<ResJSON<FileStorage[]>>, next: NextFunction): Promise<void> {
    try {
      this.uc.query = req.query;
      const data = await this.uc.findAndCountAll();

      res.send({
        status: 200,
        data: data.rows,
        meta: data.meta,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async findOneView(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const file = await this.uc.findOneView(id);
      res.end(file);
    } catch (error) {
      next(error);
    }
  }
  async countStorage(_req: Request, res: Response<ResJSON<CountStorage>>, next: NextFunction): Promise<void> {
    try {
      const count = await this.uc.countStorage(Object.keys(enumFile).map((item) => item as enumFile));
      res.send({
        status: 200,
        data: count,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async listSlider(_req: Request, res: Response<ResJSON<ListSlider>>, next: NextFunction): Promise<void> {
    try {
      const { folder, document } = await this.uc.listSlider();

      res.send({
        status: 200,
        data: {
          folder,
          document,
        },
        message: "",
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      let { folder } = req.query;
      folder = (folder as string) ?? undefined;

      this.uc.attributes = req.body;
      await this.uc.update(id, folder);
      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async remove(req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.uc.remove(id);
      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
  async sumFile(req: Request, res: Response<ResJSON<number>>, next: NextFunction): Promise<void> {
    try {
      const data = await this.uc.sumFile();
      res.send({
        status: 200,
        data: data,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default Controllers;
