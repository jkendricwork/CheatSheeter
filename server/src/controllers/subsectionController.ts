import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { subsectionService } from '../services/subsectionService';

export const subsectionController = {
  async getBySectionId(req: Request, res: Response) {
    try {
      const sectionId = parseInt(req.params.sectionId);
      const subsections = await subsectionService.getBySectionId(sectionId);
      res.json(subsections);
    } catch (error) {
      console.error('Error fetching subsections:', error);
      res.status(500).json({ error: 'Failed to fetch subsections' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const subsection = await subsectionService.create(req.body);
      res.status(201).json(subsection);
    } catch (error) {
      console.error('Error creating subsection:', error);
      res.status(500).json({ error: 'Failed to create subsection' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const subsection = await subsectionService.update(id, req.body);

      if (!subsection) {
        return res.status(404).json({ error: 'Subsection not found' });
      }

      res.json(subsection);
    } catch (error) {
      console.error('Error updating subsection:', error);
      res.status(500).json({ error: 'Failed to update subsection' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await subsectionService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Subsection not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting subsection:', error);
      res.status(500).json({ error: 'Failed to delete subsection' });
    }
  },
};
