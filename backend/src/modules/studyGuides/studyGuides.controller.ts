import { Request, Response } from 'express';
import { StudyGuidesService } from './studyGuides.service';
import { success, error } from '../../utils/apiResponse';
import { getPagination, buildPaginationMeta } from '../../utils/pagination';

export class StudyGuidesController {
  static async list(req: Request, res: Response) {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const subject = req.query.subject as string;
      const search = req.query.search as string;
      const currentUserId = req.user?.id; // optionalAuth

      const { guides, total } = await StudyGuidesService.getGuides(currentUserId, subject, search, limit, offset);
      const meta = buildPaginationMeta(total, page, limit);

      res.status(200).json(success(guides, meta));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const currentUserId = req.user?.id;
      const guide = await StudyGuidesService.getGuideById(req.params.id, currentUserId);
      if (!guide) {
        res.status(404).json(error('Study guide not found'));
        return;
      }
      res.status(200).json(success(guide));
    } catch (err: any) {
      res.status(403).json(error(err.message));
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }
      const guide = await StudyGuidesService.createGuide(req.user.id, req.body);
      res.status(201).json(success(guide));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }

  static async update(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }
      const guide = await StudyGuidesService.updateGuide(req.params.id, req.user.id, req.body);
      res.status(200).json(success(guide));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }
      await StudyGuidesService.deleteGuide(req.params.id, req.user.id);
      res.status(200).json(success({ message: 'Study guide deleted successfully' }));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }
}
export default StudyGuidesController;
