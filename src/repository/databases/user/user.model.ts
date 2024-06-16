import type { User } from "@usecase/user/user.type";
import type { Model, Sequelize } from "sequelize";
import { DataTypes } from "sequelize";

type Attributes = User;

type Instances = {
  createdAt?: Date;
  updatedAt?: Date;
} & Model<User> &
  User;

export type { Attributes };
export default {
  model: (sequelize: Sequelize) => {
    return sequelize.define<Instances>(
      "user",
      {
        email: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.STRING,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        password: {
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
