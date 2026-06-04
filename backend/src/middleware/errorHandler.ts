import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/apiResponse';
import { env } from '../config/env';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Unhandled error details:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json(
    error(
      env.NODE_ENV === 'production' && status === 500
        ? 'Something went wrong on the server.'
        : message
    )
  );
}
