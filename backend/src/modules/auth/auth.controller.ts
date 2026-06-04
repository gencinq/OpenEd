import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { success, error } from '../../utils/apiResponse';
import { env } from '../../config/env';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(success(result));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(success(result));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }

  static async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }
      const user = await AuthService.findUserById(req.user.id);
      if (!user) {
        res.status(404).json(error('User not found'));
        return;
      }
      res.status(200).json(success(user));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static getGoogleUrl(req: Request, res: Response) {
    try {
      const url = AuthService.getGoogleAuthUrl();
      res.status(200).json(success({ url }));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async handleGoogleCallback(req: Request, res: Response) {
    try {
      const code = req.query.code as string;
      if (!code) {
        res.redirect(`${env.FRONTEND_URL}/auth/callback?error=Missing+Google+auth+code`);
        return;
      }
      const { token } = await AuthService.handleGoogleCallback(code);
      // Redirect to frontend with JWT token in URL query parameter
      res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (err: any) {
      console.error('Google callback error:', err);
      res.redirect(`${env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent(err.message)}`);
    }
  }
}
export default AuthController;
