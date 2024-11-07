import { NextFunction, Request, Response } from "express";
import { CREATED, SuccessResponse } from "../core/success.response";
import { asyncHandler } from "../helpers/asyncHandler";
import LevelService from "../services/level.service";

class LevelController {
    createLevel = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Create new level successfully',
            metadata: await LevelService.createLevel(req.body),
        }).send(res);
    });

    getListLevel = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get list level successfully',
            metadata: await LevelService.getListLevel(),
        }).send(res);
    });
  
    getLevelById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Get level by id successfully',
            metadata: await LevelService.getLevelById(req.params.id),
        }).send(res);
    });

    updateLevel = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Update level successfully',
            metadata: await LevelService.updateLevel(req.params.id, req.body),
        }).send(res);
    });

    deleteLevel = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Delete level successfully',
            metadata: await LevelService.deleteLevel(req.params.id),
        }).send(res);
    });
}

export default new LevelController();