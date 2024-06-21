"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const code = err.status || 500;
    res.status(code);
    res.send({
        status: code,
        message: err.message || err,
        data: null,
    });
    next();
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map