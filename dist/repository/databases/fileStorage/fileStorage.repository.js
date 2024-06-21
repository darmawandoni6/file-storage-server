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
        this.db = index_1.default.fileStorage;
        this.dbUser = index_1.default.user;
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
    findAndCountAll(list) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { recent, where, limit, offset } = list;
                const { count, rows } = yield this.db.findAndCountAll({
                    include: [
                        {
                            model: this.dbUser,
                        },
                    ],
                    where,
                    order: recent
                        ? [["updatedAt", "DESC"]]
                        : [
                            ["id", "ASC"],
                            ["updatedAt", "DESC"],
                        ],
                    attributes: {
                        exclude: ["file"],
                    },
                    limit,
                    offset,
                });
                return {
                    count,
                    rows: rows.map((item) => (Object.assign(Object.assign({}, item.toJSON()), { file: item.size ? "http://localhost:4000/api-v1/file/" + item.id : "" }))),
                };
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    findOneView(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.db.findOne({
                    where,
                });
                return res ? res.file : null;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    count(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.db.count({ where });
                return res;
            }
            catch (error) {
                return Promise.resolve(0);
            }
        });
    }
    listSlider(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.db.findAll({
                    where,
                    attributes: [
                        "id",
                        "name",
                        "size",
                        "type",
                        "size",
                        "createdAt",
                        "archived",
                        "star",
                        [
                            index_1.default.sequelize.literal(`(
                        SELECT COUNT(id)
                        FROM storage s
                        WHERE s.folder = storage.name
                    )`),
                            "count",
                        ],
                    ],
                    order: [
                        ["count", "desc"],
                        ["createdAt", "desc"],
                    ],
                });
                return res.map((item) => (Object.assign(Object.assign({}, item.toJSON()), { file: item.size ? "http://localhost:4000/api-v1/file/" + item.id : "xx", createdAt: item.createdAt })));
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
    remove(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.destroy({ where });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    sumFile(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.db.sum("size", { where: { email } });
                return res;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Repository;
//# sourceMappingURL=fileStorage.repository.js.map