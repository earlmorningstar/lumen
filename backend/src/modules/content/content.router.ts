import { Router, type Router as RouterType } from 'express';
import { validate } from '../../middleware/validate';
import { contentQuerySchema, contentIdSchema, searchQuerySchema, genreParamSchema } from './content.schemas';
import * as contentController from './content.controller';
import { authenticate, authenticateOptional } from '../../middleware/auth';

const router: RouterType = Router();

router.get('/', authenticateOptional, validate(contentQuerySchema, 'query'), contentController.list);
router.get('/featured', contentController.getFeatured);
router.get('/trending', contentController.getTrending);
router.get('/genres', contentController.getGenres);
router.get('/search', validate(searchQuerySchema, 'query'), contentController.search);
router.get('/by-genre/:genre', validate(genreParamSchema, 'params'), validate(contentQuerySchema, 'query'), contentController.getByGenre);
router.get('/:id', validate(contentIdSchema, 'params'), contentController.getById);
router.get('/:id/related', validate(contentIdSchema, 'params'), contentController.getRelated);
router.post('/:id/view', authenticate, validate(contentIdSchema, 'params'), contentController.incrementView);

export default router;