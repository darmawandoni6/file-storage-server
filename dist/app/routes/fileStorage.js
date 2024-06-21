"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("../middleware/multer");
const fileStorage_1 = __importDefault(require("../../controllers/fileStorage"));
const jwt_1 = __importDefault(require("../../helpers/jwt"));
const express_1 = require("express");
class Routes {
    constructor() {
        this.c = new fileStorage_1.default();
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post("/file", multer_1.upload.single("file"), this.c.createFile.bind(this.c));
        this.router.post("/folder", jwt_1.default.verifyAccessToken, this.c.createFolder.bind(this.c));
        this.router.put("/file/:id", jwt_1.default.verifyAccessToken, this.c.update.bind(this.c));
        this.router.delete("/file/:id", jwt_1.default.verifyAccessToken, this.c.remove.bind(this.c));
        this.router.get("/count", jwt_1.default.verifyAccessToken, this.c.countStorage.bind(this.c));
        this.router.get("/list", jwt_1.default.verifyAccessToken, this.c.findAndCountAll.bind(this.c));
        this.router.get("/file/:id", jwt_1.default.verifyAccessToken, this.c.findOneView.bind(this.c));
        this.router.get("/list/slider", jwt_1.default.verifyAccessToken, this.c.listSlider.bind(this.c));
        this.router.get("/sum-file", jwt_1.default.verifyAccessToken, this.c.sumFile.bind(this.c));
    }
}
exports.default = { router: new Routes().router };
//# sourceMappingURL=fileStorage.js.map