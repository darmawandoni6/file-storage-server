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
const sequelize_1 = require("sequelize");
const enum_1 = require("../../helpers/enum");
const fileStorage_repository_1 = __importDefault(require("../../repository/databases/fileStorage/fileStorage.repository"));
class Usecases {
    constructor() {
        this.repository = new fileStorage_repository_1.default();
        this.attributes = {
            id: "",
            name: "",
            email: "",
        };
        this.query = {};
        this.list = {
            where: {},
            limit: 0,
            offset: 0,
            recent: false,
        };
        this.email = "";
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.create(this.attributes);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    pagination() {
        let { page, perPage } = this.query;
        if (!page)
            page = "1";
        if (!perPage)
            perPage = "10";
        const limit = Number(perPage);
        return {
            page: Number(page),
            perPage: Number(perPage),
            limit,
            offset: (Number(page) - 1) * limit,
        };
    }
    switchFilter(filter) {
        let where = {};
        switch (filter) {
            case enum_1.enumFile.folder:
                where = {
                    folder: {
                        [sequelize_1.Op.is]: undefined,
                    },
                    file: {
                        [sequelize_1.Op.is]: undefined,
                    },
                };
                break;
            case enum_1.enumFile.document:
                where = {
                    [sequelize_1.Op.or]: [
                        {
                            type: {
                                [sequelize_1.Op.startsWith]: "application/",
                            },
                        },
                        {
                            type: {
                                [sequelize_1.Op.startsWith]: "text/",
                            },
                        },
                    ],
                };
                break;
            case enum_1.enumFile.image:
                where = {
                    type: {
                        [sequelize_1.Op.startsWith]: "image/",
                    },
                };
                break;
            case enum_1.enumFile.video:
                where = {
                    type: {
                        [sequelize_1.Op.startsWith]: "video/",
                    },
                };
                break;
            case enum_1.enumFile.audio:
                where = {
                    type: {
                        [sequelize_1.Op.startsWith]: "audio/",
                    },
                };
                break;
            default:
                where = {
                    folder: {
                        [sequelize_1.Op.is]: undefined,
                    },
                };
                break;
        }
        this.list.where = where;
    }
    otherFilter() {
        const { open, archived, recent, star, search } = this.query;
        let where = this.list.where;
        if (open) {
            where = {
                folder: open,
            };
        }
        if (recent) {
            where = {
                file: {
                    [sequelize_1.Op.ne]: "",
                },
            };
        }
        if (search) {
            where = {
                file: {
                    [sequelize_1.Op.not]: "",
                },
                name: {
                    [sequelize_1.Op.substring]: search,
                },
            };
        }
        if (star) {
            where = Object.assign(where, { star: star === "true" });
        }
        this.list.where = Object.assign(where, { archived: archived === "true" });
    }
    findAndCountAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, perPage, limit, offset } = this.pagination();
                const { recent, filter } = this.query;
                this.switchFilter(filter);
                this.otherFilter();
                const { count, rows } = yield this.repository.findAndCountAll({
                    recent: !!recent,
                    where: Object.assign(this.list.where, { email: this.email }),
                    limit,
                    offset,
                });
                return {
                    rows,
                    count,
                    meta: {
                        page,
                        perPage,
                        lastPage: Math.ceil(count / perPage),
                        count,
                    },
                };
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    findOneView(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.repository.findOneView({ id, email: this.email });
                return res;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    countStorage(types) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = {
                    folder: 0,
                    document: 0,
                    image: 0,
                    video: 0,
                    audio: 0,
                };
                for (const type of types) {
                    this.switchFilter(type);
                    let where = this.list.where;
                    where = Object.assign(where, {
                        archived: false,
                        email: this.email,
                    });
                    const r = yield this.repository.count(where);
                    payload[type] = r;
                }
                return payload;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    listSlider() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let where = this.list.where;
                where = {
                    file: {
                        [sequelize_1.Op.is]: undefined,
                    },
                    archived: false,
                    email: this.email,
                };
                const vFolder = yield this.repository.listSlider(where);
                where = {
                    [sequelize_1.Op.or]: [
                        {
                            type: {
                                [sequelize_1.Op.startsWith]: "application/",
                            },
                        },
                        {
                            type: {
                                [sequelize_1.Op.startsWith]: "text/",
                            },
                        },
                    ],
                    archived: false,
                    email: this.email,
                };
                const vDocument = yield this.repository.listSlider(where);
                return {
                    folder: vFolder.map((item) => {
                        var _a;
                        return ({
                            id: item.id,
                            name: item.name,
                            star: item.star,
                            count: (_a = item.count) !== null && _a !== void 0 ? _a : 0,
                        });
                    }),
                    document: vDocument,
                };
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    update(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldName } = this.query;
                if (oldName) {
                    yield this.repository.update({ folder: this.attributes.name }, { email: this.email, folder: oldName });
                }
                yield this.repository.update(this.attributes, { id, email: this.email });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.remove({ id, email: this.email });
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    sumFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.repository.sumFile(this.email);
                return res;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Usecases;
//# sourceMappingURL=fileStorage.usecase.js.map