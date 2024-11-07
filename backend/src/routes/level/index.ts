import { Router } from "express";
import LevelController from "../../controllers/level.controller";

const levelRouter = Router();

levelRouter.post('/create', LevelController.createLevel);
levelRouter.get('/list', LevelController.getListLevel);
levelRouter.get('/get-level-by-id/:id', LevelController.getLevelById);
levelRouter.put('/update/:id', LevelController.updateLevel);
levelRouter.delete('/delete/:id', LevelController.deleteLevel);


export default levelRouter;