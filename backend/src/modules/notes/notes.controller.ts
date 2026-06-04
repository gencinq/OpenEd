import { Request, Response } from 'express';
import { NotesService } from './notes.service';
import { success, error } from '../../utils/apiResponse';
import { getPagination, buildPaginationMeta } from '../../utils/pagination';

export class NotesController {
  static async list(req: Request, res: Response) {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const subject = req.query.subject as string;
      const search = req.query.search as string;
      const currentUserId = req.user?.id; // from optionalAuth

      const { notes, total } = await NotesService.getNotes(currentUserId, subject, search, limit, offset);
      const meta = buildPaginationMeta(total, page, limit);

      res.status(200).json(success(notes, meta));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const currentUserId = req.user?.id;
      const note = await NotesService.getNoteById(req.params.id, currentUserId);
      if (!note) {
        res.status(404).json(error('Note not found'));
        return;
      }
      res.status(200).json(success(note));
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
      const note = await NotesService.createNote(req.user.id, req.body);
      res.status(201).json(success(note));
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
      const note = await NotesService.updateNote(req.params.id, req.user.id, req.body);
      res.status(200).json(success(note));
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
      await NotesService.deleteNote(req.params.id, req.user.id);
      res.status(200).json(success({ message: 'Note deleted successfully' }));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }
}
export default NotesController;
