import pool from '../config/database';
import { Subsection } from '../types';

interface CreateSubsectionDTO {
  section_id: number;
  title: string;
  description?: string;
  display_order?: number;
}

interface UpdateSubsectionDTO {
  title?: string;
  description?: string;
  display_order?: number;
}

export const subsectionService = {
  async getBySectionId(sectionId: number): Promise<Subsection[]> {
    const result = await pool.query(
      'SELECT * FROM subsections WHERE section_id = $1 ORDER BY display_order ASC',
      [sectionId]
    );
    return result.rows;
  },

  async getById(id: number): Promise<Subsection | null> {
    const result = await pool.query('SELECT * FROM subsections WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  async create(data: CreateSubsectionDTO): Promise<Subsection> {
    // Get max display_order for this section
    const maxOrderResult = await pool.query(
      'SELECT COALESCE(MAX(display_order), -1) as max_order FROM subsections WHERE section_id = $1',
      [data.section_id]
    );
    const nextOrder = maxOrderResult.rows[0].max_order + 1;

    const result = await pool.query(
      `INSERT INTO subsections (section_id, title, description, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.section_id,
        data.title,
        data.description || null,
        data.display_order !== undefined ? data.display_order : nextOrder,
      ]
    );
    return result.rows[0];
  },

  async update(id: number, data: UpdateSubsectionDTO): Promise<Subsection | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.display_order !== undefined) {
      fields.push(`display_order = $${paramCount++}`);
      values.push(data.display_order);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE subsections SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM subsections WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },
};
