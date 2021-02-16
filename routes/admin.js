const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', 
    [   
        body('title')
            .isString()
            .isLength({ min: 3 })
            .withMessage('The title length must be 3 characters or more')
            .trim(),
        body('imageUrl')
            .isURL()
            .withMessage('Enter a valid image URL please'),
        body('price')
            .isFloat()
            .withMessage('Price must be with "." and not ","'),
        body('description')
            .isLength({ min: 10 })
            .withMessage('The length description must be 10 or more.')
            .trim()
    ],
    isAuth,
    adminController.postAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/edit-product/productID => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/products => POST
router.post('/edit-product',
    [   
        body('title')
            .isString()
            .isLength({ min: 3 })
            .withMessage('The title length must be 3 characters or more')
            .trim(),
        body('imageUrl')
            .isURL()
            .withMessage('Enter a valid image URL please'),
        body('price')
            .isFloat()
            .withMessage('Price must be with "." and not ","'),
        body('description')
            .isLength({ min: 10 })
            .withMessage('The length description must be 10 or more.')
            .trim()
    ],
    isAuth,
    adminController.postEditProduct
);

// /admin/delete-product/productID
router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router;