import { Router } from 'express';
import { body } from 'express-validator';
import { sectionController } from '../controllers/sectionController';

const router = Router();

// Validation middleware
const createValidation = [
  body('title').isString().trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be 1-255 characters'),
  body('description').optional().isString(),
  body('category').optional().isString().isLength({ max: 100 }),
  body('display_order').optional().isInt({ min: 0 }),
  body('grid_column_span').optional().isInt({ min: 1, max: 3 }),
  body('style_variant').optional().isIn(['default', 'warning', 'best-practices']),
  body('border_color').optional().isString().isLength({ max: 20 }),
  body('background_color').optional().isString().isLength({ max: 20 }),
];

const updateValidation = [
  body('title').optional().isString().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().isString(),
  body('category').optional().isString().isLength({ max: 100 }),
  body('display_order').optional().isInt({ min: 0 }),
  body('grid_column_span').optional().isInt({ min: 1, max: 3 }),
  body('style_variant').optional().isIn(['default', 'warning', 'best-practices']),
  body('border_color').optional().isString().isLength({ max: 20 }),
  body('background_color').optional().isString().isLength({ max: 20 }),
];

const reorderValidation = [
  body('updates').isArray().withMessage('Updates must be an array'),
  body('updates.*.id').isInt(),
  body('updates.*.display_order').isInt({ min: 0 }),
];

// Routes
router.get('/', sectionController.getAll);
router.get('/:id', sectionController.getById);
router.post('/', createValidation, sectionController.create);
router.put('/:id', updateValidation, sectionController.update);
router.delete('/:id', sectionController.delete);
router.patch('/reorder', reorderValidation, sectionController.reorder);

export default router;
