import db from "@driver/sqlite";
import type { Attributes } from "@model/fileStorage";
import type { FindAndCountAll, List, Slider } from "@type/fileStorage";
import type { Transaction } from "sequelize";

export default {
  create: async (payload: Attributes, transaction?: Transaction): Promise<void> => {
    try {
      await db.fileStorage.create(payload, { transaction });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  findAndCountAll: async ({ recent, where, limit, offset }: List): Promise<FindAndCountAll> => {
    try {
      const { count, rows } = await db.fileStorage.findAndCountAll({
        where,
        order: recent
          ? [["updatedAt", "DESC"]]
          : [
              ["type", "ASC"],
              ["updatedAt", "DESC"],
            ],
        attributes: {
          exclude: ["file"],
        },
        limit,
        offset,
      });
      return {
        count,
        rows: rows.map((item) => ({
          ...item.toJSON(),
          file: item.size ? "http://localhost:4000/api-v1/file/" + item.id : "",
        })),
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },
  findOneView: async (id: string): Promise<Buffer | null> => {
    try {
      const res = await db.fileStorage.findOne({
        where: { id },
      });
      return res ? (res.file as Buffer) : null;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  count: async (where: List["where"]): Promise<number> => {
    try {
      const res = await db.fileStorage.count({
        where,
      });
      return res;
    } catch (error) {
      return Promise.resolve(0);
    }
  },
  listSlider: async (where: List["where"]): Promise<Slider[]> => {
    try {
      const res = await db.fileStorage.findAll({
        where,
        attributes: [
          "id",
          "name",
          "size",
          "type",
          "size",
          "createdAt",
          "archived",
          "star",
          [
            db.sequelize.literal(`(
                        SELECT COUNT(id)
                        FROM storage s
                        WHERE s.folder = storage.name
                    )`),
            "count",
          ],
        ],
        order: [
          ["count", "desc"],
          ["createdAt", "desc"],
        ],
      });

      return res.map((item) => ({
        ...item.toJSON(),
        file: item.size ? "http://localhost:4000/api-v1/file/" + item.id : "xx",
        createdAt: item.createdAt as Date,
      }));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  update: async (where: List["where"], payload: Partial<Attributes>): Promise<void> => {
    try {
      await db.fileStorage.update(payload, { where });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  remove: async (id: string): Promise<void> => {
    try {
      await db.fileStorage.destroy({ where: { id } });
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
