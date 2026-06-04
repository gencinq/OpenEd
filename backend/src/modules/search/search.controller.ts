import { Request, Response } from 'express';
import { SearchService } from './search.service';
import { success, error } from '../../utils/apiResponse';

export class SearchController {
  static async search(req: Request, res: Response) {
    try {
      const q = req.query.q as string;
      const subject = req.query.subject as string;
      
      if (!q) {
        res.status(200).json(success({
          notes: [],
          guides: [],
          questions: [],
          users: []
        }));
        return;
      }

      const results = await SearchService.searchAll(q, subject);
      res.status(200).json(success(results));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }
}
export default SearchController;
