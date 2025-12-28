import pool from '../config/database';
import { SearchResult } from '../types';

export const searchService = {
  async search(query: string): Promise<SearchResult> {
    const searchQuery = query.trim().replace(/\s+/g, ' & ');

    // Search sections
    const sectionsResult = await pool.query(
      `SELECT * FROM sections
       WHERE to_tsvector('english', title || ' ' || COALESCE(description, '')) @@ to_tsquery('english', $1)
       ORDER BY display_order ASC
       LIMIT 50`,
      [searchQuery]
    );

    // Search code blocks with their sections
    const codeBlocksResult = await pool.query(
      `SELECT cb.*,
              row_to_json(s.*) as section
       FROM code_blocks cb
       JOIN sections s ON cb.section_id = s.id
       WHERE to_tsvector('english', cb.content) @@ to_tsquery('english', $1)
       ORDER BY cb.display_order ASC
       LIMIT 50`,
      [searchQuery]
    );

    return {
      sections: sectionsResult.rows,
      codeBlocks: codeBlocksResult.rows,
    };
  },
};
