"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    model: (sequelize) => {
        return sequelize.define("user", {
            email: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.STRING,
            },
            name: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
            password: {
                allowNull: false,
                type: sequelize_1.DataTypes.STRING,
            },
        }, {
            freezeTableName: true,
        });
    },
};
//# sourceMappingURL=user.model.js.map