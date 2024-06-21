"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = {
    encrypt: (password) => {
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(password, salt);
        return hash;
    },
    compare: (password, encrypt) => {
        return bcrypt_1.default.compareSync(password, encrypt);
    },
};
//# sourceMappingURL=bcrypt.js.map