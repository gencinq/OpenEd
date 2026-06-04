import { Request, Response } from 'express';
import { QuestionsService } from './questions.service';
import { AnswersService } from '../answers/answers.service';
import { success, error } from '../../utils/apiResponse';
import { getPagination, buildPaginationMeta } from '../../utils/pagination';

export class QuestionsController {
  static async list(req: Request, res: Response) {
    try {
      const { limit, offset, page } = getPagination(req.query);
      const subject = req.query.subject as string;
      const search = req.query.search as string;

      const { questions, total } = await QuestionsService.getQuestions(subject, search, limit, offset);
      const meta = buildPaginationMeta(total, page, limit);

      res.status(200).json(success(questions, meta));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const question = await QuestionsService.getQuestionById(req.params.id);
      if (!question) {
        res.status(404).json(error('Question not found'));
        return;
      }
      
      // Also fetch answers
      const answers = await AnswersService.getAnswersForQuestion(req.params.id, question.acceptedAnswerId);

      res.status(200).json(success({ question, answers }));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }
      const question = await QuestionsService.createQuestion(req.user.id, req.body);
      res.status(201).json(success(question));
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
      await QuestionsService.deleteQuestion(req.params.id, req.user.id);
      res.status(200).json(success({ message: 'Question deleted successfully' }));
    } catch (err: any) {
      res.status(400).json(error(err.message));
    }
  }
}
export default QuestionsController;
