"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = {
    signToken: (data) => {
        const { ACCESS_TOKEN, EXP_TOKEN } = process.env;
        const token = jsonwebtoken_1.default.sign(data, ACCESS_TOKEN, {
            expiresIn: `${EXP_TOKEN}d`,
        });
        return token;
    },
    verifyAccessToken: (req, res, next) => {
        let { token } = req.cookies;
        if (!token) {
            const { authorization } = req.headers;
            token = authorization;
        }
        console.log({ req });
        if (!token) {
            next(http_errors_1.default.Unauthorized());
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, (error, payload) => {
            if (error) {
                const err = error;
                const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                next(http_errors_1.default.Unauthorized(message));
                return;
            }
            res.locals = payload;
            next();
        });
    },
};
//# sourceMappingURL=jwt.js.map