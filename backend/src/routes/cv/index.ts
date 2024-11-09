import { Router } from "express";
import CVController from "../../controllers/cv.controller";

const router = Router();

router.post("/create", CVController.createCV);
router.get("/:cvId", CVController.findCVById);
router.get("/user/:userId", CVController.findCVByUserId);
router.put("/:cvId", CVController.updateCV);
router.delete("/:cvId", CVController.deleteCV);

export default router;

