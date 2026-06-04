import { Request, Response } from 'express';
import { AnswersService } from './answers.service';
import { success, error } from '../../utils/apiResponse';

export class AnswersController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }
      const questionId = req.params.id; // from nested router definition
      const answer = await AnswersService.createAnswer(req.user.id, questionId, req.body);
      res.status(201).json(success(answer));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }

  static async upvote(req: Request, res: Response) {
    try {
      const upvotes = await AnswersService.upvoteAnswer(req.params.id);
      res.status(200).json(success({ upvotes }));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }

  static async accept(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }
      await AnswersService.acceptAnswer(req.params.id, req.user.id);
      res.status(200).json(success({ message: 'Answer accepted successfully' }));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }
}
export default AnswersController;
