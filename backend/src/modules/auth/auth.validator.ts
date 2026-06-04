import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().withMessage('Provide a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('displayName')
    .trim()
    .notEmpty()
    .withMessage('Display name is required')
    .isLength({ max: 100 })
    .withMessage('Display name cannot exceed 100 characters'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];
