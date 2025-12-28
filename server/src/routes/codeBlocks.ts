import { Router } from 'express';
import { body } from 'express-validator';
import { codeBlockController } from '../controllers/codeBlockController';

const router = Router();

// Validation middleware
const createValidation = [
  body('subsection_id').isInt({ min: 1 }).withMessage('Subsection ID is required'),
  body('content').isString().trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('language').optional().isString().isLength({ max: 50 }),
  body('display_order').optional().isInt({ min: 0 }),
  body('is_clickable').optional().isBoolean(),
];

const updateValidation = [
  body('content').optional().isString().trim().isLength({ min: 1 }),
  body('language').optional().isString().isLength({ max: 50 }),
  body('display_order').optional().isInt({ min: 0 }),
  body('is_clickable').optional().isBoolean(),
];

// Routes
router.get('/subsection/:subsectionId', codeBlockController.getBySubsectionId);
router.post('/', createValidation, codeBlockController.create);
router.put('/:id', updateValidation, codeBlockController.update);
router.delete('/:id', codeBlockController.delete);

export default router;
