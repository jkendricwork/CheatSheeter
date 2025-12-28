import { Request, Response } from 'express';
import { searchService } from '../services/searchService';

export const searchController = {
  async search(req: Request, res: Response) {
    try {
      const query = req.query.q as string;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters' });
      }

      const results = await searchService.search(query);
      res.json(results);
    } catch (error) {
      console.error('Error searching:', error);
      res.status(500).json({ error: 'Failed to perform search' });
    }
  },
};
