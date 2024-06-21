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
const user_repository_1 = __importDefault(require("../../repository/databases/user/user.repository"));
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt_1 = __importDefault(require("../../helpers/bcrypt"));
const jwt_1 = __importDefault(require("../../helpers/jwt"));
class Usecases {
    constructor() {
        this.repository = new user_repository_1.default();
        this.where = {};
        this.attributes = {};
    }
    generateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this.attributes;
                data.password = "";
                const token = jwt_1.default.signToken(data);
                const expired = new Date(); // Now
                expired.setDate(expired.getDate() + parseInt(process.env.EXP_TOKEN, 10));
                return { token, expired };
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.create(this.attributes);
                const generate = this.generateToken();
                return generate;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = this.attributes;
                const data = yield this.repository.findOne({ email });
                if (!data) {
                    throw http_errors_1.default.BadRequest("Email not found");
                }
                const match = bcrypt_1.default.compare(password, data.password);
                if (!match) {
                    throw http_errors_1.default.BadRequest("Email not found");
                }
                this.attributes = data;
                const generate = this.generateToken();
                return generate;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    profile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.repository.findOne(this.where);
                return data;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.attributes.password)
                    this.attributes.password = undefined;
                yield this.repository.update(this.attributes, this.where);
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Usecases;
//# sourceMappingURL=user.usecase.js.map