import mongoose, { Document, Schema, Types } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import IRole from '../role/role.model';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: IRole;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  mfaEnabled?: boolean;
  isProfileCompleted?: boolean;
  avatar?: string;
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    mfaEnabled: { type: Boolean, default: false },
    isProfileCompleted: { type: Boolean, default: false },
    avatar: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('email')) this.email = this.email?.toLowerCase();
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.plugin(mongoosePagination);

export const User = mongoose.model<IUser, mongoose.Model<IUser> & Pagination<IUser>>(
  'User',
  userSchema,
);
