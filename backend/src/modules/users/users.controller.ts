import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { success, error } from '../../utils/apiResponse';
import { getPagination, buildPaginationMeta } from '../../utils/pagination';

export class UsersController {
  static async getProfile(req: Request, res: Response) {
    try {
      const user = await UsersService.getUserProfile(req.params.id);
      if (!user) {
        res.status(404).json(error('User not found'));
        return;
      }
      res.status(200).json(success(user));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user || req.user.id !== req.params.id) {
        res.status(403).json(error('You can only update your own profile'));
        return;
      }
      const updated = await UsersService.updateUserProfile(req.user.id, req.body);
      res.status(200).json(success(updated));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }

  // Admin Actions
  static async listAllUsers(req: Request, res: Response) {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const { users, total } = await UsersService.getAllUsers(limit, offset);
      const meta = buildPaginationMeta(total, page, limit);
      res.status(200).json(success(users, meta));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async moderateDelete(req: Request, res: Response) {
    try {
      const { type, id } = req.params;
      const deleted = await UsersService.deleteContent(type, id);
      if (!deleted) {
        res.status(404).json(error('Content not found or already deleted'));
        return;
      }
      res.status(200).json(success({ message: `Successfully deleted ${type}` }));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }
}
export default UsersController;
