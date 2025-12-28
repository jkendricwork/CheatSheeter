import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { sectionService } from '../services/sectionService';

export const sectionController = {
  async getAll(req: Request, res: Response) {
    try {
      const sections = await sectionService.getAll();
      res.json(sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
      res.status(500).json({ error: 'Failed to fetch sections' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const section = await sectionService.getById(id);

      if (!section) {
        return res.status(404).json({ error: 'Section not found' });
      }

      res.json(section);
    } catch (error) {
      console.error('Error fetching section:', error);
      res.status(500).json({ error: 'Failed to fetch section' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const section = await sectionService.create(req.body);
      res.status(201).json(section);
    } catch (error: any) {
      console.error('Error creating section:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Section with this title already exists' });
      }
      res.status(500).json({ error: 'Failed to create section' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const section = await sectionService.update(id, req.body);

      if (!section) {
        return res.status(404).json({ error: 'Section not found' });
      }

      res.json(section);
    } catch (error: any) {
      console.error('Error updating section:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Section with this title already exists' });
      }
      res.status(500).json({ error: 'Failed to update section' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await sectionService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Section not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting section:', error);
      res.status(500).json({ error: 'Failed to delete section' });
    }
  },

  async reorder(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      await sectionService.reorder(req.body.updates);
      res.json({ success: true });
    } catch (error) {
      console.error('Error reordering sections:', error);
      res.status(500).json({ error: 'Failed to reorder sections' });
    }
  },
};
