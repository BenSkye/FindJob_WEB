import { NextFunction, Request, Response } from 'express';
import AccessService from '../services/access.service';
import { CREATED, SuccessResponse } from '../core/success.response';
import { asyncHandler } from '../helpers/asyncHandler';

class AccessController {

  handleRefreshToken = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Refresh token successfully',
      metadata: await AccessService.handlerRefreshToken(req.user, req.keyStore, req.refreshToken),
    }).send(res);
  });

  logout = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  });

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Login successfully',
      metadata: await AccessService.login(req.body.email, req.body.password),
    }).send(res);
  });


  //asyncHandler so do not need to use try catch
  signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: 'Create new user successfully',
      metadata: await AccessService.signup(req.body),
    }).send(res);
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { token } = req.query;
    const result = await AccessService.verifyEmail(token as string);
    return new SuccessResponse({
      message: 'Verify email successfully',
      metadata: result,
    }).send(res);
  }
  );

  forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Forgot password successfully',
      metadata: await AccessService.forgotPassword(req.body.email),
    }).send(res);
  });

  resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const result = await AccessService.resetPassword(token, newPassword);
    return new SuccessResponse({
      message: 'Reset password successfully',
      metadata: result,
    }).send(res);
  });

  getUser = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get user successfully',
      metadata: await AccessService.getUser(req.query),
    }).send(res);
  });

}
export default new AccessController();
