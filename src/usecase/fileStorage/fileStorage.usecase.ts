import type { WhereOptions } from "sequelize";
import { Op } from "sequelize";
import type { Request } from "express";
import { enumFile } from "@helper/enum";
import fileStorageRepository from "@database/fileStorage/fileStorage.repository";
import type { Attributes } from "@database/fileStorage/fileStorage.model";
import type { CountStorage, FileStorage, FindAndCountAll, ListSlider } from "./fileStorage.type";

export default {
  create: async (payload: Attributes): Promise<void> => {
    try {
      await fileStorageRepository.create(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  findAndCountAll: async (request: Request["query"]): Promise<FindAndCountAll> => {
    try {
      let { page, perPage } = request;
      const { filter, open, archived, recent, star } = request;

      if (!page) page = "1";
      if (!perPage) perPage = "10";

      let where: WhereOptions<FileStorage> = {
        folder: {
          [Op.is]: undefined,
        },
      };

      switch (filter) {
        case enumFile.folder:
          where = {
            folder: {
              [Op.is]: undefined,
            },
            file: {
              [Op.is]: undefined,
            },
          };

          break;
        case enumFile.document:
          where = {
            [Op.or]: [
              {
                type: {
                  [Op.startsWith]: "application/",
                },
              },
              {
                type: {
                  [Op.startsWith]: "text/",
                },
              },
            ],
          };
          break;
        case enumFile.image:
          where = {
            type: {
              [Op.startsWith]: "image/",
            },
          };
          break;
        case enumFile.video:
          where = {
            type: {
              [Op.startsWith]: "video/",
            },
          };
          break;
        case enumFile.audio:
          where = {
            type: {
              [Op.startsWith]: "audio/",
            },
          };
          break;
        default:
          break;
      }

      if (open) {
        where = {
          folder: open as string,
        };
      }

      if (recent) {
        where = {
          file: {
            [Op.ne]: "",
          },
        };
      }

      if (star) {
        where = Object.assign(where, { star: star === "true" });
      }

      where = Object.assign(where, { archived: archived === "true" });

      const { count, rows } = await fileStorageRepository.findAndCountAll({
        recent: !!recent,
        where,
        limit: parseInt(perPage as string, 10),
        offset: (parseInt(page as string, 10) - 1) * parseInt(perPage as string, 10),
      });
      return {
        rows,
        count,
        meta: {
          page: parseInt(page as string, 10),
          perPage: parseInt(perPage as string, 10),
          lastPage: Math.ceil(count / parseInt(perPage as string, 10)),
          count,
        },
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },
  findOneView: async (id: string): Promise<Buffer | null> => {
    try {
      const res = await fileStorageRepository.findOneView(id);
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  countStorage: async (types: enumFile[]): Promise<CountStorage> => {
    try {
      const payload: CountStorage = {
        folder: 0,
        document: 0,
        image: 0,
        video: 0,
        audio: 0,
      };

      const defWhere: WhereOptions<FileStorage> = {
        archived: false,
      };
      let where: WhereOptions<FileStorage> = {};

      for (const type of types) {
        switch (type) {
          case enumFile.folder:
            where = {
              file: {
                [Op.is]: undefined,
              },
              folder: {
                [Op.is]: undefined,
              },
            };
            break;
          case enumFile.document:
            where = {
              [Op.or]: [
                {
                  type: {
                    [Op.startsWith]: "application/",
                  },
                },
                {
                  type: {
                    [Op.startsWith]: "text/",
                  },
                },
              ],
            };
            break;
          case enumFile.image:
            where = {
              type: {
                [Op.startsWith]: "image/",
              },
            };
            break;
          case enumFile.audio:
            where = {
              type: {
                [Op.startsWith]: "audio/",
              },
            };
            break;
          case enumFile.video:
            where = {
              type: {
                [Op.startsWith]: "video/",
              },
            };
            break;
          default:
            break;
        }
        where = Object.assign(where, defWhere);
        const r = await fileStorageRepository.count(where);
        payload[type] = r;
      }

      return payload;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  listSlider: async (): Promise<ListSlider> => {
    try {
      const wFolder: WhereOptions<FileStorage> = {
        file: {
          [Op.is]: undefined,
        },
        archived: false,
      };
      const wDocument: WhereOptions<FileStorage> = {
        [Op.or]: [
          {
            type: {
              [Op.startsWith]: "application/",
            },
          },
          {
            type: {
              [Op.startsWith]: "text/",
            },
          },
        ],
        archived: false,
      };

      const vFolder = await fileStorageRepository.listSlider(wFolder);

      const vDocument = await fileStorageRepository.listSlider(wDocument);

      return {
        folder: vFolder.map((item) => ({
          id: item.id,
          name: item.name,
          star: item.star,
          count: item.count ?? 0,
        })),
        document: vDocument,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },
  update: async (id: string, payload: Partial<Attributes>, folder?: string): Promise<void> => {
    try {
      if (folder) {
        await fileStorageRepository.update({ folder }, payload);
      }

      await fileStorageRepository.update({ id }, payload);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  remove: async (id: string): Promise<void> => {
    try {
      await fileStorageRepository.remove(id);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  sumFile: async (): Promise<number> => {
    try {
      const res = await fileStorageRepository.sumFile();
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
