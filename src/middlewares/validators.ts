import { check } from 'express-validator';
import { validateRequest } from './validateRequest';
import { validationMessages } from '../utils/validationMessages';

export const registerUserValidation = [
  check('name').isLength({ min: 3 }).withMessage(validationMessages.name.minLength).notEmpty().withMessage(validationMessages.name.required),
  check('email').isEmail().withMessage(validationMessages.email.invalid).notEmpty().withMessage(validationMessages.email.required),
  check('password').isLength({ min: 6 }).withMessage(validationMessages.password.minLength).notEmpty().withMessage(validationMessages.password.required),
  check('confirm_password').isLength({ min: 6 }).withMessage(validationMessages.confirmPassword.minLength).notEmpty().withMessage(validationMessages.confirmPassword.required),
  validateRequest,
];

export const loginUserValidation = [
  check('email').isEmail().withMessage(validationMessages.email.invalid).notEmpty().withMessage(validationMessages.email.required),
  check('password').isLength({ min: 6 }).withMessage(validationMessages.password.minLength).notEmpty().withMessage(validationMessages.password.required),
  validateRequest,
];
