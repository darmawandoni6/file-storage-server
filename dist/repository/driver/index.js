"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileStorage_model_1 = __importDefault(require("../databases/fileStorage/fileStorage.model"));
const supabase_1 = require("./supabase");
const user_model_1 = __importDefault(require("../databases/user/user.model"));
const db = {
    sequelize: supabase_1.sequelize,
    user: user_model_1.default.model(supabase_1.sequelize),
    fileStorage: fileStorage_model_1.default.model(supabase_1.sequelize),
};
db.user.hasMany(db.fileStorage, {
    foreignKey: "email",
});
db.fileStorage.belongsTo(db.user, {
    foreignKey: "email",
});
exports.default = db;
//# sourceMappingURL=index.js.map