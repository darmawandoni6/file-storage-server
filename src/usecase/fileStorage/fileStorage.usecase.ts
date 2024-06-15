import { Op } from "sequelize";
import type { Request } from "express";
import { enumFile } from "@helper/enum";

import type { Attributes } from "@database/fileStorage/fileStorage.model";
import type { CountStorage, FindAndCountAll, List, ListSlider } from "./fileStorage.type";
import Repository from "@database/fileStorage/fileStorage.repository";

class Usecases {
  private repository = new Repository();
  attributes: Attributes = {
    id: "",
    name: "",
  };
  query: Request["query"] = {};
  list: List = {
    where: {},
    limit: 0,
    offset: 0,
    recent: false,
  };

  async create(): Promise<void> {
    try {
      await this.repository.create(this.attributes);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  pagination(): { page: number; perPage: number; limit: number; offset: number } {
    let { page, perPage } = this.query;
    if (!page) page = "1";
    if (!perPage) perPage = "10";

    const limit = Number(perPage);
    return {
      page: Number(page),
      perPage: Number(page),
      limit,
      offset: (Number(page) - 1) * limit,
    };
  }

  switchFilter() {
    let where: List["where"] = {};
    switch (this.query.filter) {
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
        where = {
          folder: {
            [Op.is]: undefined,
          },
        };
        break;
    }

    this.list.where = where;
  }
  otherFilter() {
    const { open, archived, recent, star } = this.query;
    let where: List["where"] = this.list.where;

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
    this.list.where = Object.assign(where, { archived: archived === "true" });
  }
  async findAndCountAll(): Promise<FindAndCountAll> {
    try {
      const { page, perPage, limit, offset } = this.pagination();
      this.switchFilter();
      this.otherFilter();
      const { recent } = this.query;

      const { count, rows } = await this.repository.findAndCountAll({
        recent: !!recent,
        where: this.list.where,
        limit,
        offset,
      });
      return {
        rows,
        count,
        meta: {
          page,
          perPage,
          lastPage: Math.ceil(count / perPage),
          count,
        },
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findOneView(id: string): Promise<Buffer | null> {
    try {
      const res = await this.repository.findOneView(id);
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async countStorage(types: enumFile[]): Promise<CountStorage> {
    try {
      const payload: CountStorage = {
        folder: 0,
        document: 0,
        image: 0,
        video: 0,
        audio: 0,
      };

      for (const type of types) {
        this.switchFilter();
        let where = this.list.where;
        where = Object.assign(where, {
          archived: false,
        });
        const r = await this.repository.count(where);
        payload[type] = r;
      }

      return payload;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async listSlider(): Promise<ListSlider> {
    try {
      let where = this.list.where;

      where = {
        file: {
          [Op.is]: undefined,
        },
        archived: false,
      };
      const vFolder = await this.repository.listSlider(where);

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
        archived: false,
      };
      const vDocument = await this.repository.listSlider(where);

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
  }
  async update(id: string, folder?: string): Promise<void> {
    try {
      if (folder) {
        this.list.where = { folder };
      } else {
        this.list.where = { id };
      }
      await this.repository.update(this.attributes, this.list.where);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async remove(id: string): Promise<void> {
    try {
      await this.repository.remove(id);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async sumFile(): Promise<number> {
    try {
      const res = await this.repository.sumFile();
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default Usecases;
