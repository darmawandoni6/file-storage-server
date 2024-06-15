import type { WhereOptions } from "sequelize";
import type { Pagination } from "src/type";

export type FileStorage = {
  id: string;
  file: Buffer | string;
  name: string;
  type: string;
  size: number;
  folder: string;
  archived: boolean;
  star: boolean;
};

export type List = {
  recent?: boolean;
  where: WhereOptions<FileStorage>;
  limit: number;
  offset: number;
};

export type FindAndCountAll = {
  rows: FileStorage[];
  count: number;
  meta?: Pagination;
};

export type Slider = FileStorage & {
  createdAt: Date;
  count?: number;
};

export type ListSlider = {
  folder: (Pick<FileStorage, "id" | "name" | "star"> & {
    count?: number;
  })[];
  document: (FileStorage & {
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
