import { supabase } from '../../config/supabase';
import { db } from '../../config/database';
import { env } from '../../config/env';
import { PdfResource } from '@shared/types';
import { v4 as uuidv4 } from 'uuid';

export class PdfService {
  static async uploadPdf(
    userId: string,
    file: Express.Multer.File,
    noteId?: string,
    guideId?: string
  ): Promise<PdfResource> {
    const fileExt = file.originalname.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExt}`;
    const storagePath = `pdfs/${userId}/${uniqueFilename}`;

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(env.SUPABASE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error details:', uploadError);
      throw new Error(`Failed to upload file to storage: ${uploadError.message}`);
    }

    // Insert record in postgres
    const result = await db.query(
      `INSERT INTO pdf_resources (user_id, filename, storage_path, file_size, note_id, guide_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, filename, storage_path, file_size, note_id, guide_id, created_at`,
      [
        userId,
        file.originalname,
        storagePath,
        file.size,
        noteId || null,
        guideId || null
      ]
    );

    const row = result.rows[0];

    // Generate public/signed URL
    const { data: urlData } = await supabase.storage
      .from(env.SUPABASE_BUCKET)
      .createSignedUrl(storagePath, 60 * 60 * 24); // 24 hours link

    return {
      id: row.id,
      userId: row.user_id,
      filename: row.filename,
      storagePath: row.storage_path,
      fileSize: row.file_size || undefined,
      noteId: row.note_id || undefined,
      guideId: row.guide_id || undefined,
      url: urlData?.signedUrl || undefined,
      createdAt: row.created_at
    };
  }

  static async getPdfById(id: string): Promise<PdfResource | null> {
    const result = await db.query(
      `SELECT id, user_id, filename, storage_path, file_size, note_id, guide_id, created_at
       FROM pdf_resources
       WHERE id = $1`,
      [id]
    );

    const row = result.rows[0];
    if (!row) return null;

    // Generate signed URL
    const { data: urlData } = await supabase.storage
      .from(env.SUPABASE_BUCKET)
      .createSignedUrl(row.storage_path, 60 * 60 * 24);

    return {
      id: row.id,
      userId: row.user_id,
      filename: row.filename,
      storagePath: row.storage_path,
      fileSize: row.file_size || undefined,
      noteId: row.note_id || undefined,
      guideId: row.guide_id || undefined,
      url: urlData?.signedUrl || undefined,
      createdAt: row.created_at
    };
  }

  static async getPdfsForResource(noteId?: string, guideId?: string): Promise<PdfResource[]> {
    let result;
    if (noteId) {
      result = await db.query(
        `SELECT id, user_id, filename, storage_path, file_size, note_id, guide_id, created_at
         FROM pdf_resources WHERE note_id = $1`,
        [noteId]
      );
    } else if (guideId) {
      result = await db.query(
        `SELECT id, user_id, filename, storage_path, file_size, note_id, guide_id, created_at
         FROM pdf_resources WHERE guide_id = $1`,
        [guideId]
      );
    } else {
      return [];
    }

    const resources: PdfResource[] = [];
    for (const row of result.rows) {
      const { data: urlData } = await supabase.storage
        .from(env.SUPABASE_BUCKET)
        .createSignedUrl(row.storage_path, 60 * 60 * 24);

      resources.push({
        id: row.id,
        userId: row.user_id,
        filename: row.filename,
        storagePath: row.storage_path,
        fileSize: row.file_size || undefined,
        noteId: row.note_id || undefined,
        guideId: row.guide_id || undefined,
        url: urlData?.signedUrl || undefined,
        createdAt: row.created_at
      });
    }

    return resources;
  }
}
export default PdfService;
