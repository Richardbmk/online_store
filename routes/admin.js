const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/edit-product/productID => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/products => POST
router.post('/edit-product', isAuth, adminController.postEditProduct);

// /admin/delete-product/productID
router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router;