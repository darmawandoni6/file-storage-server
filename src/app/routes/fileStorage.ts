import express from "express";
import { upload } from "../middleware/multer";
import fileStorage from "@controller/fileStorage";

const router = express.Router();
router.post("/file", upload.single("file"), fileStorage.createFile);
router.post("/folder", fileStorage.createFolder);

router.put("/file/:id", fileStorage.update);

router.delete("/file/:id", fileStorage.remove);

router.get("/count", fileStorage.countStorage);
router.get("/list", fileStorage.findAndCountAll);
router.get("/file/:id", fileStorage.findOneView);
router.get("/list/slider", fileStorage.listSlider);
router.get("/sum-file", fileStorage.sumFile);

export default { router };
