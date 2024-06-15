import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { randomUUID } from "crypto";
import type { ResJSON } from "src/type";
import { enumFile } from "@helper/enum";
import type { CountStorage, FileStorage, ListSlider } from "@usecase/fileStorage/fileStorage.type";
import type { Attributes } from "@database/fileStorage/fileStorage.model";
import fileStorageUsecase from "@usecase/fileStorage/fileStorage.usecase";

export default {
  createFolder: async (req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> => {
    try {
      const { body } = req;

      await fileStorageUsecase.create({
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

      await fileStorageUsecase.create(payload);

      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  findAndCountAll: async (req: Request, res: Response<ResJSON<FileStorage[]>>, next: NextFunction): Promise<void> => {
    try {
      const data = await fileStorageUsecase.findAndCountAll(req.query);

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

      const file = await fileStorageUsecase.findOneView(id);
      res.end(file);
    } catch (error) {
      next(error);
    }
  },
  countStorage: async (_req: Request, res: Response<ResJSON<CountStorage>>, next: NextFunction): Promise<void> => {
    try {
      const count = await fileStorageUsecase.countStorage(Object.keys(enumFile).map((item) => item as enumFile));
      res.send({
        status: 200,
        data: count,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  listSlider: async (_req: Request, res: Response<ResJSON<ListSlider>>, next: NextFunction): Promise<void> => {
    try {
      const { folder, document } = await fileStorageUsecase.listSlider();

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
  update: async (req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      let { folder } = req.query;
      folder = (folder as string) ?? undefined;

      await fileStorageUsecase.update(id, req.body, folder);
      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  remove: async (req: Request, res: Response<ResJSON>, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await fileStorageUsecase.remove(id);
      res.send({
        status: 200,
        data: null,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
  sumFile: async (req: Request, res: Response<ResJSON<number>>, next: NextFunction): Promise<void> => {
    try {
      const data = await fileStorageUsecase.sumFile();
      res.send({
        status: 200,
        data: data,
        message: "success",
      });
    } catch (error) {
      next(error);
    }
  },
};
