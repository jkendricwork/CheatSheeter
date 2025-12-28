import { Router } from 'express';
import { body } from 'express-validator';
import { subsectionController } from '../controllers/subsectionController';

const router = Router();

// Validation middleware
const createValidation = [
  body('section_id').isInt({ min: 1 }).withMessage('Section ID is required'),
  body('title').isString().trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be 1-255 characters'),
  body('description').optional().isString(),
  body('display_order').optional().isInt({ min: 0 }),
];

const updateValidation = [
  body('title').optional().isString().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().isString(),
  body('display_order').optional().isInt({ min: 0 }),
];

// Routes
router.get('/section/:sectionId', subsectionController.getBySectionId);
router.post('/', createValidation, subsectionController.create);
router.put('/:id', updateValidation, subsectionController.update);
router.delete('/:id', subsectionController.delete);

export default router;
