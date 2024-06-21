"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    model: (sequelize) => {
        return sequelize.define("storage", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.STRING,
            },
            file: {
                type: sequelize_1.DataTypes.BLOB("long"),
            },
            name: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
            },
            size: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            folder: {
                type: sequelize_1.DataTypes.STRING,
            },
            archived: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            star: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            email: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
        }, {
            freezeTableName: true,
        });
    },
};
//# sourceMappingURL=fileStorage.model.js.map