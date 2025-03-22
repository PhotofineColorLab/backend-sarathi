import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} from '../controllers/productController';

const router = express.Router();

// Get all products
router.get('/', getProducts);

// Get products by category - this must come before the :id route
router.get('/category/:category', getProductsByCategory);

// Get product by ID
router.get('/:id', getProduct);

// Create new product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

export default router; 