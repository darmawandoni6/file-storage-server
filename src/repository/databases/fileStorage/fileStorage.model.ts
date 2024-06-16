import type { FileStorage } from "@usecase/fileStorage/fileStorage.type";
import type { Model, Optional, Sequelize } from "sequelize";
import { DataTypes } from "sequelize";

type Attributes = Optional<FileStorage, "file" | "type" | "size" | "folder" | "archived" | "star">;

type Instances = {
  count?: number;
  createdAt?: Date;
  updatedAt?: Date;
} & Model<FileStorage, Attributes> &
  FileStorage;

export type { Attributes };
export default {
  model: (sequelize: Sequelize) => {
    return sequelize.define<Instances>(
      "storage",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.STRING,
        },
        file: {
          type: DataTypes.BLOB("long"),
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        type: {
          type: DataTypes.STRING,
        },
        size: {
          type: DataTypes.INTEGER,
        },
        folder: {
          type: DataTypes.STRING,
        },
        archived: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        star: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING,
        },
      },
      {
        freezeTableName: true,
      },
    );
  },
};
