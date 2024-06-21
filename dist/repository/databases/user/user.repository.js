"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../driver/index"));
class Repository {
    constructor() {
        this.db = index_1.default.user;
    }
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.create(payload);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    findOne(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.db.findOne({ where });
                return data === null || data === void 0 ? void 0 : data.toJSON();
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    update(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.update(payload, { where });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Repository;
//# sourceMappingURL=user.repository.js.map