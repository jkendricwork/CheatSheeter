import pool from '../config/database';
import { CodeBlock, CreateCodeBlockDTO, UpdateCodeBlockDTO } from '../types';

export const codeBlockService = {
  async getBySubsectionId(subsectionId: number): Promise<CodeBlock[]> {
    const result = await pool.query(
      'SELECT * FROM code_blocks WHERE subsection_id = $1 ORDER BY display_order ASC',
      [subsectionId]
    );
    return result.rows;
  },

  async getById(id: number): Promise<CodeBlock | null> {
    const result = await pool.query('SELECT * FROM code_blocks WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  async create(data: CreateCodeBlockDTO & { subsection_id: number }): Promise<CodeBlock> {
    // Get max display_order for this subsection
    const maxOrderResult = await pool.query(
      'SELECT COALESCE(MAX(display_order), -1) as max_order FROM code_blocks WHERE subsection_id = $1',
      [data.subsection_id]
    );
    const nextOrder = maxOrderResult.rows[0].max_order + 1;

    const result = await pool.query(
      `INSERT INTO code_blocks (subsection_id, content, display_order, language, is_clickable)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.subsection_id,
        data.content,
        data.display_order !== undefined ? data.display_order : nextOrder,
        data.language || 'bash',
        data.is_clickable !== undefined ? data.is_clickable : true,
      ]
    );
    return result.rows[0];
  },

  async update(id: number, data: UpdateCodeBlockDTO): Promise<CodeBlock | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(data.content);
    }
    if (data.language !== undefined) {
      fields.push(`language = $${paramCount++}`);
      values.push(data.language);
    }
    if (data.display_order !== undefined) {
      fields.push(`display_order = $${paramCount++}`);
      values.push(data.display_order);
    }
    if (data.is_clickable !== undefined) {
      fields.push(`is_clickable = $${paramCount++}`);
      values.push(data.is_clickable);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE code_blocks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM code_blocks WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },
};
