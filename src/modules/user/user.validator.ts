import Joi from 'joi';


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
});


const updateProfile = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().email().required(),
  bio: Joi.string(),
  phone: Joi.string(),
});

const updateProfilePassword = Joi.object({
  oldPassword: Joi.string().min(8).max(20).required(),
  password: Joi.string().min(8).max(20).required(),
  confirmPassword: Joi.ref('password'),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(20).required(),
  confirmPassword: Joi.ref('password'),
  token: Joi.string().required(),
});



const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  bio: Joi.string().allow(''),
  avatar: Joi.string().allow(''),
  country: Joi.string().allow(''),
});


export default {
  loginSchema,
  registerSchema,
  updateProfile,
  updateProfilePassword,
  forgotPasswordSchema,
  resetPasswordSchema,
};
