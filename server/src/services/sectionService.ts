import pool from '../config/database';
import { Section, CreateSectionDTO, UpdateSectionDTO } from '../types';

export const sectionService = {
  async getAll(): Promise<Section[]> {
    const sectionsResult = await pool.query(
      'SELECT * FROM sections ORDER BY display_order ASC'
    );

    const sections = sectionsResult.rows;

    // Fetch subsections and code blocks for each section
    for (const section of sections) {
      const subsectionsResult = await pool.query(
        'SELECT * FROM subsections WHERE section_id = $1 ORDER BY display_order ASC',
        [section.id]
      );

      section.subsections = subsectionsResult.rows;

      // Fetch code blocks for each subsection
      for (const subsection of section.subsections) {
        const codeBlocksResult = await pool.query(
          'SELECT * FROM code_blocks WHERE subsection_id = $1 ORDER BY display_order ASC',
          [subsection.id]
        );
        subsection.code_blocks = codeBlocksResult.rows;
      }
    }

    return sections;
  },

  async getById(id: number): Promise<Section | null> {
    const sectionResult = await pool.query(
      'SELECT * FROM sections WHERE id = $1',
      [id]
    );

    if (sectionResult.rows.length === 0) {
      return null;
    }

    const section = sectionResult.rows[0];

    // Fetch subsections
    const subsectionsResult = await pool.query(
      'SELECT * FROM subsections WHERE section_id = $1 ORDER BY display_order ASC',
      [id]
    );

    section.subsections = subsectionsResult.rows;

    // Fetch code blocks for each subsection
    for (const subsection of section.subsections) {
      const codeBlocksResult = await pool.query(
        'SELECT * FROM code_blocks WHERE subsection_id = $1 ORDER BY display_order ASC',
        [subsection.id]
      );
      subsection.code_blocks = codeBlocksResult.rows;
    }

    return section;
  },

  async create(data: CreateSectionDTO): Promise<Section> {
    const result = await pool.query(
      `INSERT INTO sections (title, description, category, display_order, grid_column_span, style_variant, border_color, background_color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.title,
        data.description || null,
        data.category || null,
        data.display_order || 0,
        data.grid_column_span || 1,
        data.style_variant || 'default',
        data.border_color || null,
        data.background_color || null,
      ]
    );
    return result.rows[0];
  },

  async update(id: number, data: UpdateSectionDTO): Promise<Section | null> {
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
    if (data.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(data.category);
    }
    if (data.display_order !== undefined) {
      fields.push(`display_order = $${paramCount++}`);
      values.push(data.display_order);
    }
    if (data.grid_column_span !== undefined) {
      fields.push(`grid_column_span = $${paramCount++}`);
      values.push(data.grid_column_span);
    }
    if (data.style_variant !== undefined) {
      fields.push(`style_variant = $${paramCount++}`);
      values.push(data.style_variant);
    }
    if (data.border_color !== undefined) {
      fields.push(`border_color = $${paramCount++}`);
      values.push(data.border_color);
    }
    if (data.background_color !== undefined) {
      fields.push(`background_color = $${paramCount++}`);
      values.push(data.background_color);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE sections SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM sections WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },

  async reorder(updates: Array<{ id: number; display_order: number }>): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const update of updates) {
        await client.query(
          'UPDATE sections SET display_order = $1 WHERE id = $2',
          [update.display_order, update.id]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
};
