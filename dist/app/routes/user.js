"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../controllers/user"));
const jwt_1 = __importDefault(require("../../helpers/jwt"));
const express_1 = require("express");
class Routes {
    constructor() {
        this.c = new user_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post("/login", this.c.login.bind(this.c));
        this.router.post("/logout", this.c.logout.bind(this.c));
        this.router.post("/register", this.c.register.bind(this.c));
        this.router.get("/profile", jwt_1.default.verifyAccessToken, this.c.profile.bind(this.c));
        this.router.put("/profile", jwt_1.default.verifyAccessToken, this.c.update.bind(this.c));
    }
}
exports.default = { router: new Routes().router };
//# sourceMappingURL=user.js.map