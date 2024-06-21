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
const index_1 = __importDefault(require("./repository/driver/index"));
const queryInterface = index_1.default.sequelize.getQueryInterface();
const addColumn = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // add column
    }
    catch (error) {
        return Promise.reject(error);
    }
});
index_1.default.sequelize
    .sync()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Synced db.");
    // await addColumn();
    yield index_1.default.user.sync();
    yield index_1.default.fileStorage.sync();
}))
    .catch((err) => {
    console.log("Failed to sync db: " + err.message);
    process.exit(-1);
});
//# sourceMappingURL=sync.js.map