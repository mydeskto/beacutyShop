import { Router } from 'express';
import { productController } from '../controllers/productController.js';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/:idOrSlug', productController.getProductBySlugOrId);
router.post('/', productController.createOrUpdateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/categories/all', productController.getCategories);
router.get('/collections/all', productController.getCollections);

export default router;
