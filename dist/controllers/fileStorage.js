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
const http_errors_1 = __importDefault(require("http-errors"));
const crypto_1 = require("crypto");
const enum_1 = require("../helpers/enum");
const fileStorage_usecase_1 = __importDefault(require("../usecase/fileStorage/fileStorage.usecase"));
class Controllers {
    constructor() {
        this.uc = new fileStorage_usecase_1.default();
    }
    setEmail(res) {
        const { email } = res.locals;
        this.uc.email = email;
    }
    createFolder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const { email } = res.locals;
                this.uc.attributes = {
                    id: (0, crypto_1.randomUUID)(),
                    name: body.folder,
                    folder: body.sub,
                    email: email,
                };
                yield this.uc.create();
                res.send({
                    status: 200,
                    data: null,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file)
                    throw http_errors_1.default.NotFound("Error file");
                let name = Date.now() + "-" + Math.round(Math.random() * 1e9);
                name = req.file.fieldname + "-" + name;
                const { file, body } = req;
                const { email } = res.locals;
                this.uc.attributes = {
                    id: name,
                    file: file.buffer,
                    name: file.originalname,
                    type: file.mimetype,
                    size: file.size,
                    folder: body.folder,
                    email: email,
                };
                yield this.uc.create();
                res.send({
                    status: 200,
                    data: null,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    findAndCountAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setEmail(res);
                this.uc.query = req.query;
                const data = yield this.uc.findAndCountAll();
                res.send({
                    status: 200,
                    data: data.rows,
                    meta: data.meta,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    findOneView(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setEmail(res);
                const { id } = req.params;
                const file = yield this.uc.findOneView(id);
                res.end(file);
            }
            catch (error) {
                next(error);
            }
        });
    }
    countStorage(_req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setEmail(res);
                const count = yield this.uc.countStorage(Object.keys(enum_1.enumFile).map((item) => item));
                res.send({
                    status: 200,
                    data: count,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    listSlider(_req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setEmail(res);
                const { folder, document } = yield this.uc.listSlider();
                res.send({
                    status: 200,
                    data: {
                        folder,
                        document,
                    },
                    message: "",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setEmail(res);
                const { id } = req.params;
                this.uc.query = req.query;
                this.uc.attributes = req.body;
                yield this.uc.update(id);
                res.send({
                    status: 200,
                    data: null,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    remove(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setEmail(res);
                const { id } = req.params;
                yield this.uc.remove(id);
                res.send({
                    status: 200,
                    data: null,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    sumFile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setEmail(res);
                const data = yield this.uc.sumFile();
                res.send({
                    status: 200,
                    data: data,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = Controllers;
//# sourceMappingURL=fileStorage.js.map