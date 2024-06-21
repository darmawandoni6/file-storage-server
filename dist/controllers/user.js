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
const bcrypt_1 = __importDefault(require("../helpers/bcrypt"));
const user_usecase_1 = __importDefault(require("../usecase/user/user.usecase"));
class Controllers {
    constructor() {
        this.uc = new user_usecase_1.default();
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.password = bcrypt_1.default.encrypt(req.body.password);
                this.uc.attributes = req.body;
                const access = yield this.uc.register();
                res.cookie("token", access.token, { httpOnly: true, expires: access.expired });
                res.send({
                    status: 200,
                    data: access,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.uc.attributes = req.body;
                const access = yield this.uc.login();
                res.cookie("token", access.token, { httpOnly: true, expires: access.expired });
                res.send({
                    status: 200,
                    data: access,
                    message: "success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("token");
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
    profile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.uc.where = { email: res.locals.email };
                const data = yield this.uc.profile();
                if (data)
                    data.password = "";
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
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.uc.where = { email: res.locals.email };
                this.uc.attributes = req.body;
                yield this.uc.update();
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
}
exports.default = Controllers;
//# sourceMappingURL=user.js.map