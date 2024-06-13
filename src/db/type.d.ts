import type { WhereOptions } from "sequelize";
import type { Pagination } from "../type";

export type FileStorage = {
  id: string;
  file: Buffer;
  name: string;
  type: string;
  size: number;
  folder: string;
  archived: boolean;
  star: boolean;
};

export type FileStorageFolder = {
  id: string;
  name: string;
  folder?: string;
};

type List = {
  recent?: boolean;
  where: WhereOptions<FileStorage>;
  limit: number;
  offset: number;
};
type Row = Omit<FileStorage, "file"> & { file: string };

export type FindAndCountAll = {
  rows: Row[];
  count: number;
  meta?: Pagination;
};

type Slider = Row & {
  createdAt: Date;
  count?: number;
};

type ListSlider = {
  folder: {
    id: string;
    name: string;
    star: boolean;
    count?: number;
  }[];
  document: (Row & {
    createdAt: Date;
    count?: number;
  })[];
};

export type CountStorage = {
  folder: number;
  document: number;
  image: number;
  video: number;
  audio: number;
};
