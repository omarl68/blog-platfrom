import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../../core/utils/errorHandler';
import { HttpCode } from '../../core/utils/httpCode';
import roleService from '../role/role.service';
import { RolesEnum } from '../../constants/constants';
import userRepository from './user.repository';

class UserService {
  static async login(email: string, password: string) {
    const user = await userRepository.getOneByQuery({ email }, '+password','role');
    if (!user) {
      throw new ErrorHandler('Invalid credentials', HttpCode.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorHandler('Invalid credentials', HttpCode.UNAUTHORIZED);
    }

    if (user.mfaEnabled) {
      return { mfaRequired: true };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME,
    });

    return { token, refreshToken, user, mfaRequired: false };
  }

  static async completeProfile(user: any, profileData: any) {
    const updatedUser = await userRepository.edit(user.id, {
      ...profileData,
      isProfileCompleted: true,
    });

    if (!updatedUser) {
      throw new ErrorHandler('User not found', HttpCode.NOT_FOUND);
    }

    return updatedUser;
  }

  static async register(firstName: string, lastName: string, email: string, password: string) {
    const userExists = await userRepository.getOneByQuery({ email });
    if (userExists) {
      throw new ErrorHandler('Email already registered', HttpCode.BAD_REQUEST);
    }
    const role = await roleService.getByObj({ code: RolesEnum.READER });

    const user = await userRepository.create({
      firstName,
      lastName,
      email,
      password,
      isEmailVerified: false,
      role: role._id,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationToken = otp;
    user.emailVerificationExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    return { user };
  }

  static async verifyAccount(email: string, otp: string) {
    const user = await userRepository.getOneByQuery({
      email,
      emailVerificationToken: otp,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorHandler('Invalid or expired OTP', HttpCode.BAD_REQUEST);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME,
    });

    return { token, refreshToken, user };
  }

  static async refreshToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
      id: string;
    };
    const token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
    return { token };
  }

  static async forgotPassword(email: string) {
    const user = await userRepository.getOneByQuery({ email });
    if (!user) {
      throw new ErrorHandler('User not found', HttpCode.NOT_FOUND);
    }

    const resetToken = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    return { resetToken };
  }

  static async resetPassword(token: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new ErrorHandler('Passwords do not match', HttpCode.BAD_REQUEST);
    }

    const user = await userRepository.getOneByQuery({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorHandler('Invalid or expired reset token', HttpCode.BAD_REQUEST);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }

  static async getUserProfile(userId: string) {
    return await userRepository.getById(new mongoose.Types.ObjectId(userId),'','role');
  }

  static async updateProfile(userId: string, data: any) {
    return await userRepository.edit(new mongoose.Types.ObjectId(userId), data);
  }

  static async updateUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new ErrorHandler('Passwords do not match', HttpCode.BAD_REQUEST);
    }

    const user = await userRepository.getById(new mongoose.Types.ObjectId(userId), '+password');
    if (!user) {
      throw new ErrorHandler('User not found', HttpCode.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new ErrorHandler('Current password is incorrect', HttpCode.BAD_REQUEST);
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  static async avatarUpload(userId: string, filename: string) {
    return await userRepository.edit(new mongoose.Types.ObjectId(userId), { avatar: filename });
  }

  static async getAllUsers(name: string, page: number, pageSize: number) {
    const options = {
      page: page,
      limit: pageSize,
    };
    return await userRepository.getAll({}, options, name ? { name } : {});
  }

  static async getUserById(id: Types.ObjectId) {
    return await userRepository.getById(id);
  }

  static async createUser(userData: any) {
    return await userRepository.create(userData);
  }

  static async updateUser(id: Types.ObjectId, data: any) {
    return await userRepository.edit(id, data);
  }

  static async deleteUser(id: Types.ObjectId) {
    return await userRepository.remove(id);
  }

  static async setupMFA(email: string) {
    const user = await userRepository.getOneByQuery({ email });
    if (!user) {
      throw new ErrorHandler('User not found', HttpCode.NOT_FOUND);
    }
    // TODO: Implement MFA setup logic
    return { secret: 'MFA_SECRET' };
  }

  static async verifyMFA(email: string, token: string) {
    const user = await userRepository.getOneByQuery({ email });
    if (!user) {
      throw new ErrorHandler('User not found', HttpCode.NOT_FOUND);
    }
    // TODO: Implement MFA verification logic
    return 'MFA_TOKEN';
  }
}

export default UserService;
