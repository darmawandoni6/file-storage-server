import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { randomUUID } from "crypto";
import type { Attributes } from "../db/models/fileStorage";
import type { ResJSON } from "../type";
import fileStorage from "../db/usecases/fileStorage";
import type { CountStorage, Row } from "../db/type";
import { enumFile } from "../helpers/enum";

export default {
  createFolder: async (req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> => {
    try {
      const { body } = req;

      await fileStorage.create({
        id: randomUUID(),
        name: body.folder,
        folder: body.sub,
      });

      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  createFile: async (req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) throw createHttpError.NotFound("Error file");

      let name = Date.now() + "-" + Math.round(Math.random() * 1e9);
      name = req.file.fieldname + "-" + name;

      const { file, body } = req;

      const payload: Attributes = {
        id: name,
        file: file.buffer,
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        folder: body.folder,
      };

      await fileStorage.create(payload);

      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  findAndCountAll: async (req: Request, res: Response<ResJSON<Row[]>>, next: NextFunction): Promise<void> => {
    try {
      const data = await fileStorage.findAndCountAll(req.query);

      res.send({
        status: 200,
        data: data.rows,
        meta: data.meta,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  findOneView: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const file = await fileStorage.findOneView(id);
      res.end(file);
    } catch (error) {
      next(error);
    }
  },
  countStorage: async (_req: Request, res: Response<ResJSON<CountStorage>>, next: NextFunction): Promise<void> => {
    try {
      const count = await fileStorage.countStorage(Object.keys(enumFile).map((item) => item as enumFile));
      res.send({
        status: 200,
        data: count,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  listSlider: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { folder, document } = await fileStorage.listSlider();

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
  },
  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      let { folder } = req.query;
      folder = (folder as string) ?? undefined;

      await fileStorage.update(id, req.body, folder);
      res.send({
        status: 200,
        data: null,
        message: "",
      });
    } catch (error) {
      next(error);
    }
  },
  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await fileStorage.remove(id);
      res.send({
        status: 200,
        data: null,
        message: "",
      });
    } catch (error) {
      next(error);
    }
  },
};
