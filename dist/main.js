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
require("dotenv/config");
const app_1 = require("./app");
const index_1 = __importDefault(require("./repository/driver/index"));
const conection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_1.default.sequelize.sync();
    }
    catch (error) {
        return Promise.reject(error);
    }
});
app_1.app.listen(app_1.port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield conection();
        console.log(app_1.message);
    }
    catch (error) {
        console.log(error.message);
        process.exit(-1);
    }
}));
//# sourceMappingURL=main.js.map