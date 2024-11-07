import { Router } from "express";
import LevelController from "../../controllers/level.controller";

const router = Router();

router.post('/create', LevelController.createLevel);
router.get('/', LevelController.getListLevel);
router.get('/:id', LevelController.getLevelById);
router.put('/:id', LevelController.updateLevel);
router.delete('/:id', LevelController.deleteLevel);


export default router;