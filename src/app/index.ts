import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import createHttpError from "http-errors";
import logger from "morgan";
import { errorHandler } from "./middleware/errorHandler";
import fileStorage from "./routes/fileStorage";

const app = express();

const port = process.env.PORT || 4000;
const message = `[Server]: I am running mode ${process.env.ENV} at http://localhost:${port}`;

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message });
});

app.use("/api-v1", fileStorage.router);

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use(errorHandler);

export { app, port, message };
