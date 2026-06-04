import { Request, Response } from 'express';
import { PdfService } from './pdf.service';
import { success, error } from '../../utils/apiResponse';

export class PdfController {
  static async upload(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json(error('Not authenticated'));
        return;
      }

      if (!req.file) {
        res.status(400).json(error('No PDF file uploaded'));
        return;
      }

      const { noteId, guideId } = req.body;
      const resource = await PdfService.uploadPdf(
        req.user.id,
        req.file,
        noteId,
        guideId
      );

      res.status(201).json(success(resource));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const resource = await PdfService.getPdfById(req.params.id);
      if (!resource) {
        res.status(404).json(error('PDF resource not found'));
        return;
      }
      res.status(200).json(success(resource));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }

  static async listForResource(req: Request, res: Response) {
    try {
      const { noteId, guideId } = req.query as { noteId?: string; guideId?: string };
      const resources = await PdfService.getPdfsForResource(noteId, guideId);
      res.status(200).json(success(resources));
    } catch (err: any) {
      res.status(500).json(error(err.message));
    }
  }
}
export default PdfController;
