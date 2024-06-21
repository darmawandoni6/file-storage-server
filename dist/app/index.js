"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = exports.port = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const fileStorage_1 = __importDefault(require("./routes/fileStorage"));
const errorHandler_1 = require("./middleware/errorHandler");
const user_1 = __importDefault(require("./routes/user"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const app = (0, express_1.default)();
exports.app = app;
const port = Number(process.env.PORT) || 4000;
exports.port = port;
const message = `[Server]: I am running mode ${process.env.NODE_ENV} at http://localhost:${port}`;
exports.message = message;
app.use((0, cors_1.default)({
    credentials: true,
    origin: "*",
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send({ message });
});
app.use("/api-v1", user_1.default.router);
app.use("/api-v1", jwt_1.default.verifyAccessToken, fileStorage_1.default.router);
app.use((req, res, next) => {
    next(http_errors_1.default.NotFound());
});
app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=index.js.map