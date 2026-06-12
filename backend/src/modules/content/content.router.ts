import { Router, type Router as RouterType } from 'express';
import { validate } from '../../middleware/validate';
import { contentQuerySchema, contentIdSchema } from './content.schemas';
import * as contentController from './content.controller';
import { authenticateOptional } from '../../middleware/auth';

const router: RouterType = Router();

router.get('/', authenticateOptional, validate(contentQuerySchema, 'query'), contentController.list);
router.get('/featured', contentController.getFeatured);
router.get('/trending', contentController.getTrending);
router.get('/:id', validate(contentIdSchema, 'params'), contentController.getById);

export default router;