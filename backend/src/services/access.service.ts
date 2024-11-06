import { userModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createTokenPair, verifyJWT } from '../auth/authUtils';
import { getInfoData } from '../utils';
import { AuthFailureError, BadRequestError, ForbiddenError, NotFoundError } from '../core/error.response';
import nodemailer from 'nodemailer';

//import service
import KeyTokenService from './keyToken.service';
import { findByEmail } from './user.service';
import { createKey, findByUserId } from './apiKey.service';
import CartService from './cart.service';
const RoleUser = {
  MEMBER: 'member',
  ADMIN: 'admin',
  SHOP: 'shop',
};

class AccessService {
  static handlerRefreshToken = async (user: any, keyStore: any, refreshToken: string) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenError(' Something wrong happend !! Pls relogin')
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError(' User not registered')
    }
    const foundShop = await findByEmail(email)

    if (!foundShop) throw new AuthFailureError(' User not registeted')
    // create 1 cap moi
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey) as any
    //update token
    await KeyTokenService.updateRefreshTokensUsed(tokens.refreshToken, refreshToken)

    return {
      user,
      tokens
    }

  }


  static logout = async (keyStore: any) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log('delKey', delKey);
    return delKey;
  }

  
  static login = async (email: string, password: string, refreshToken = null) => {
    //1 check email in dbs
    const foundUser = await findByEmail(email);
    if (!foundUser) {
      throw new BadRequestError('User not Registered');
    }
    //2- match password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new AuthFailureError('Password not match');
    }
    //3- create AT vs RT and save
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    //4 generate tokens
    const tokens = await createTokenPair({ userId: foundUser._id, email, name: foundUser.name }, publicKey.toString(), privateKey.toString());

    if (!tokens) {
      throw new BadRequestError('Create Token Fail');
    }

    await KeyTokenService.createKeyToken(foundUser._id, publicKey.toString(), privateKey.toString(), (tokens as { refreshToken: string }).refreshToken);
    const apiKey = await findByUserId(foundUser._id);
    if (!apiKey) {
      throw new NotFoundError('API Key not found');
    }
    return {
      user: getInfoData({ fields: ['_id', 'name', 'email','roles'], object: foundUser }),
      tokens,
      apiKey: apiKey.key
    }
  }

  static signup = async ({ name, email, password, role }: { name: string, email: string, password: string, role: string }) => {
    //step1: check email exist
    const holderUser = await userModel.findOne({ email }).lean();
    console.log('exist', holderUser)
    if (holderUser) {
      throw new BadRequestError('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    if (!role) {
      role = RoleUser.MEMBER;
    }
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [role],
      verify: false,
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log({ privateKey, publicKey }); //save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken(newUser._id, publicKey.toString(), privateKey.toString(), '');
      if (!keyStore) {
        throw new BadRequestError('keyStore not found');
      }
      const tokens = await createTokenPair({ userId: newUser._id, email }, publicKey.toString(), privateKey.toString());

      console.log('Create Token Success', tokens);
      console.log('role', newUser.roles);
      const apiKey = await createKey(newUser.roles, newUser._id);
      if (!apiKey) {
        throw new BadRequestError('Create API Key Fail');
      }
      if (newUser.roles.includes(RoleUser.MEMBER)) {
        const userCart = await CartService.createCart(newUser._id.toString());//create cart for new user when signup
      }


      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
      const verificationTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes

      newUser.verificationToken = verificationTokenHash;
      newUser.verificationTokenExpire = verificationTokenExpire;
      await newUser.save();

      // Step 8: Send verification email
      const verificationUrl = `http://localhost:2709/verify-email?token=${verificationToken}`;
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'khanhhgse173474@fpt.edu.vn',
          pass: 'zkoawauogcjlccfg',
        },
      });

      const mailOptions = {
        from: 'khanhhgse173474@fpt.edu.vn',
        to: email,
        subject: 'Email Verification',
        html: `
          <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}" target="_blank">Verify Email</a>
          <p>This link will expire in 10 minutes.</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      return {
        user: getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newUser }),
        tokens,
        apiKey: apiKey.key
      }
    }
    return {
      code: 200,
      metadata: null
    }

  };


  static verifyEmail = async (token: string) => {
    try {
      const verificationTokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const user = await userModel.findOne({
        verificationToken: verificationTokenHash,
        verificationTokenExpire: { $gt: Date.now() },
      });

      if (!user) {
        throw new BadRequestError('Invalid or expired verification token');
      } else {
        user.verify = true;
        user.verificationToken = '';
        user.verificationTokenExpire = undefined;
        await user.save();
      }

      return {
        message: 'Email verified successfully',
        status: 200,
      };
    } catch (error) {
      // Handle different types of errors accordingly
      if (error instanceof BadRequestError) {
        return {
          message: error.message,
          status: 400,
        };
      } else {
        // Log the error or handle unexpected errors
        console.error(error);
        return {
          message: 'An error occurred while verifying the email',
          status: 500,
        };
      }
    }
  };




  static forgotPassword = async (email: string) => {
    console.log('forgotPassword', email);

    const foundUser = await userModel.findOne({ email });
    if (!foundUser) {
      throw new NotFoundError('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');


    const resetPasswordTokenHash = crypto.createHash('sha256').update(token).digest('hex');


    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);


    await userModel.findOneAndUpdate(
      { email },
      {
        passwordResetToken: resetPasswordTokenHash,
        passwordResetExpire: resetPasswordExpire
      },
      { new: true }
    );


    const resetUrl = `http://localhost:2709/reset-password?token=${token}`;
    console.log('resetUrllllll', resetUrl);
    try {

      const transporter = nodemailer.createTransport({


        service: 'Gmail',
        auth: {
          user: 'khanhhgse173474@fpt.edu.vn',
          pass: 'zkoawauogcjlccfg',
        },
      });
      console.log('transporter', transporter);

      const mailOptions = {
        from: 'khanhhgse173474@fpt.edu.vn',
        to: email,
        subject: 'Password Reset Request',
        html: `
                <p>You requested to reset your password. Click the link below to reset your password:</p>
                <a href="${resetUrl}" target="_blank">Reset Password</a>
                <p>This link will expire in 10 minutes.</p>
            `
      };
      console.log('mailOptions', mailOptions);
      // Send the email
      await transporter.sendMail(mailOptions);

      return {
        message: "Forgot password email sent successfully",
        status: 200,
        metadata: {
          resetPasswordToken: token,
          resetPasswordExpire
        }
      };
    } catch (error) {
      console.error('Error sending reset email:', error);
      throw new Error('Error sending the reset email');
    }
  }

  static resetPassword = async (token: string, newPassword: string) => {

    const resetPasswordTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      passwordResetToken: resetPasswordTokenHash,
      passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }


    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = '';
    user.passwordResetExpire = undefined;
    await user.save();

    return {
      message: 'Password reset successfully',
      status: 200
    };
  }



  static getUser = async (query: any) => {
    return await userModel.find(query);
  }


}
export default AccessService;
