import db from "@driver/index";
import type { Attributes } from "./fileStorage.model";
import type { FindAndCountAll, List, Slider } from "@usecase/fileStorage/fileStorage.type";

class Repository {
  private db = db.fileStorage;

  async create(payload: Attributes): Promise<void> {
    try {
      await this.db.create(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findAndCountAll(list: List): Promise<FindAndCountAll> {
    try {
      const { recent, where, limit, offset } = list;

      const { count, rows } = await this.db.findAndCountAll({
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
  }
  async findOneView(where: List["where"]): Promise<Buffer | null> {
    try {
      const res = await this.db.findOne({
        where,
      });
      return res ? (res.file as Buffer) : null;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async count(where: List["where"]): Promise<number> {
    try {
      const res = await this.db.count({ where });
      return res;
    } catch (error) {
      return Promise.resolve(0);
    }
  }
  async listSlider(where: List["where"]): Promise<Slider[]> {
    try {
      const res = await this.db.findAll({
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
  }
  async update(payload: Partial<Attributes>, where: List["where"]): Promise<void> {
    try {
      await this.db.update(payload, { where });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async remove(where: List["where"]): Promise<void> {
    try {
      await this.db.destroy({ where });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async sumFile(email: string): Promise<number> {
    try {
      const res = await this.db.sum("size", { where: { email } });
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default Repository;
