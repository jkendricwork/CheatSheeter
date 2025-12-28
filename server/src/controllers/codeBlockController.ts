import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { codeBlockService } from '../services/codeBlockService';

export const codeBlockController = {
  async getBySubsectionId(req: Request, res: Response) {
    try {
      const subsectionId = parseInt(req.params.subsectionId);
      const codeBlocks = await codeBlockService.getBySubsectionId(subsectionId);
      res.json(codeBlocks);
    } catch (error) {
      console.error('Error fetching code blocks:', error);
      res.status(500).json({ error: 'Failed to fetch code blocks' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const codeBlock = await codeBlockService.create(req.body);
      res.status(201).json(codeBlock);
    } catch (error) {
      console.error('Error creating code block:', error);
      res.status(500).json({ error: 'Failed to create code block' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      const codeBlock = await codeBlockService.update(id, req.body);

      if (!codeBlock) {
        return res.status(404).json({ error: 'Code block not found' });
      }

      res.json(codeBlock);
    } catch (error) {
      console.error('Error updating code block:', error);
      res.status(500).json({ error: 'Failed to update code block' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const deleted = await codeBlockService.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Code block not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting code block:', error);
      res.status(500).json({ error: 'Failed to delete code block' });
    }
  },

};
