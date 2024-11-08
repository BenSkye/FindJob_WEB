import { userModel } from '../models/user.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createTokenPair, verifyJWT } from '../auth/authUtils';
import { getInfoData } from '../utils';
import { AuthFailureError, BadRequestError, ForbiddenError, NotFoundError } from '../core/error.response';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
//import service
import KeyTokenService from './keyToken.service';
import { findByEmail } from './user.service';
import { createKey, findByUserId } from './apiKey.service';
import { companyModel } from '../models/company.model';
import SubscriptionService from './subscription.service';
const RoleUser = {
  ADMIN: 'admin',
  EMPLOYER: 'employer',
  CANDIDATE: 'candidate',
};

class AccessService {
  static handlerRefreshToken = async (user: any, keyStore: any, refreshToken: string) => {
    const { userId, email, roles } = user;
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
    const tokens = await createTokenPair({ userId, email, roles }, keyStore.publicKey, keyStore.privateKey) as any
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
      user: getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: foundUser }),
      tokens,
      apiKey: apiKey.key
    }
  }



  static signup = async ({ name, email, password, role, phone, address }: { name: string, email: string, password: string, role: string, phone: string, address: string }) => {
    //step1: check email exist
    const holderUser = await userModel.findOne({ email }).lean();

    console.log('exist', holderUser)
    if (holderUser) {
      throw new BadRequestError('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    if (!role) {
      role = RoleUser.CANDIDATE;
    }
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [role],
      verify: true,
      phone,
      address,
    });

    console.log("newuser", newUser)

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log({ privateKey, publicKey }); //save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken(newUser._id, publicKey.toString(), privateKey.toString(), '');
      if (!keyStore) {
        throw new BadRequestError('keyStore not found');
      }
      const tokens = await createTokenPair({ userId: newUser._id, email, roles: newUser.roles }, publicKey.toString(), privateKey.toString());

      console.log('Create Token Success', tokens);
      console.log('role', newUser.roles);
      const apiKey = await createKey(newUser.roles, newUser._id);
      console.log("apikey", apiKey)
      if (!apiKey) {
        throw new BadRequestError('Create API Key Fail');
      }
      // const verificationToken = crypto.randomBytes(32).toString('hex');
      // const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
      // const verificationTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes

      // newUser.verificationToken = verificationTokenHash;
      // newUser.verificationTokenExpire = verificationTokenExpire;
      // await newUser.save();

      // // Step 8: Send verification email
      // const verificationUrl = `http://localhost:2709/verify-email?token=${verificationToken}`;
      // const transporter = nodemailer.createTransport({
      //   service: 'Gmail',
      //   auth: {
      //     user: 'khanhhgse173474@fpt.edu.vn',
      //     pass: 'zkoawauogcjlccfg',
      //   },
      // });

      // const mailOptions = {
      //   from: 'khanhhgse173474@fpt.edu.vn',
      //   to: email,
      //   subject: 'Email Verification',
      //   html: `
      //     <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
      //     <a href="${verificationUrl}" target="_blank">Verify Email</a>
      //     <p>This link will expire in 10 minutes.</p>
      //   `,
      // };

      // await transporter.sendMail(mailOptions);
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

  static googleSignup = async (credential: string) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new BadRequestError('Invalid Google token payload');
      }

      const { email, name, picture, sub: googleId } = payload;

      // Check if user already exists
      let user = await userModel.findOne({ email }).lean();

      if (user) {
        // If user exists, create new tokens
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair(
          { userId: user._id, email },
          publicKey,
          privateKey
        );

        await KeyTokenService.createKeyToken(
          user._id,
          publicKey,
          privateKey,
          (tokens as { refreshToken: string }).refreshToken
        );

        return {
          user: getInfoData({
            fields: ['_id', 'name', 'email', 'roles', 'avatar'],
            object: user
          }),
          tokens
        };
      }

      // Create new user if not exists
      const newUser = await userModel.create({
        name: name || email.split('@')[0],
        email,
        password: crypto.randomBytes(20).toString('hex'),
        roles: ['candidate'],
        verify: true,
        avatar: picture || '',
        authType: 'google',
        googleId,
        status: 'active'
      });

      // Create tokens for new user
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      await KeyTokenService.createKeyToken(
        newUser._id,
        publicKey,
        privateKey,
        (tokens as { refreshToken: string }).refreshToken
      );

      // Create API key for new user
      const apiKey = await createKey(newUser.roles, newUser._id);

      return {
        user: getInfoData({
          fields: ['_id', 'name', 'email', 'roles', 'avatar'],
          object: newUser
        }),
        tokens,
        apiKey: apiKey.key
      };

    } catch (error) {
      console.error('Google Sign Up Error:', error);
      throw new BadRequestError('Failed to authenticate with Google');
    }
  }

  static signupEmployer = async ({ name, email, password, companyName, phone, address }: { name: string, email: string, password: string, companyName: string, phone: string, address: string }) => {
    //step1: check email exist
    const holderUser = await userModel.findOne({ email }).lean();
    console.log('exist', holderUser)
    if (holderUser) {
      throw new BadRequestError('Email already exists');
    }

    // 1. Kiểm tra xem company đã tồn tại chưa
    let company = await companyModel.findOne({
      name: { $regex: new RegExp(`^${companyName}$`, 'i') }
    });

    const passwordHash = await bcrypt.hash(password, 10);
    const role = RoleUser.EMPLOYER;
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [role],
      companyId: company?._id || null,
      verify: true,
      phone,
      address,
    });

    if (newUser) {
      if (!company) {
        company = await companyModel.create({
          name: companyName,
          description: '',
        });

        // Cập nhật lại companyId cho user
        await userModel.findByIdAndUpdate(newUser._id, {
          companyId: company._id
        });
      }
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log({ privateKey, publicKey }); //save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken(newUser._id, publicKey.toString(), privateKey.toString(), '');
      if (!keyStore) {
        throw new BadRequestError('keyStore not found');
      }
      const tokens = await createTokenPair({ userId: newUser._id, email, roles: newUser.roles }, publicKey.toString(), privateKey.toString());

      console.log('Create Token Success', tokens);
      console.log('role', newUser.roles);
      const apiKey = await createKey(newUser.roles, newUser._id);
      if (!apiKey) {
        throw new BadRequestError('Create API Key Fail');
      }

      //create subscription
      await SubscriptionService.createSubscription(newUser._id.toString());
      // const verificationToken = crypto.randomBytes(32).toString('hex');
      // const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
      // const verificationTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes

      // newUser.verificationToken = verificationTokenHash;
      // newUser.verificationTokenExpire = verificationTokenExpire;
      // await newUser.save();

      // // Step 8: Send verification email
      // const verificationUrl = `http://localhost:2709/verify-email?token=${verificationToken}`;
      // const transporter = nodemailer.createTransport({
      //   service: 'Gmail',
      //   auth: {
      //     user: 'khanhhgse173474@fpt.edu.vn',
      //     pass: 'zkoawauogcjlccfg',
      //   },
      // });

      // const mailOptions = {
      //   from: 'khanhhgse173474@fpt.edu.vn',
      //   to: email,
      //   subject: 'Email Verification',
      //   html: `
      //       <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
      //       <a href="${verificationUrl}" target="_blank">Verify Email</a>
      //       <p>This link will expire in 10 minutes.</p>
      //     `,
      // };

      // await transporter.sendMail(mailOptions);
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

  }

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
