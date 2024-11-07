import { Router } from "express";
import TemplateController from "../../controllers/template.controller";
// import authMiddleware from "../../middlewares/auth.middleware";

const router = Router();


router.get("/get-all", TemplateController.findAllTemplates);
router.get("/:templateId", TemplateController.findTemplateById);
router.post("/create", TemplateController.createTemplate);
router.put("/:templateId", TemplateController.updateTemplate);
router.delete("/:templateId", TemplateController.deleteTemplate);

export default router;