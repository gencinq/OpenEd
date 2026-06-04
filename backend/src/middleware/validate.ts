import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { error } from '../utils/apiResponse';

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map((err) => `${err.msg}`)
      .join(', ');
    res.status(400).json(error(errorMsg));
    return;
  }
  next();
}
