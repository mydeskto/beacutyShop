import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController.js';

const router = Router();

router.get('/:userId', wishlistController.getWishlist);
router.post('/', wishlistController.updateWishlist);

export default router;
