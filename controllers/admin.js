const Product = require('../models/product');
const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
const fileHelper = require('../utils/file');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/add-edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/add-edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        });
    }

    const imageUrl = image.path;

    const product = new Product({
        /* //This is just for produce an Error (some testing)     
        _id: mongoose.Types.ObjectId("5fe8ab8ca5e3f72248502e1a"),
         */
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save().then((result) => {
        console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products')
    })
    .catch(err => {
        // return res.status(500).render('admin/add-edit-product', {
        //     pageTitle: 'Add Product',
        //     path: '/admin/add-edit-product',
        //     editing: false,
        //     hasError: true,
        //     product: {
        //         title: title,
        //         imageUrl: imageUrl,
        //         price: price,
        //         description: description
        //     },
        //     errorMessage: 'Database operation failed, please try again',
        //     validationErrors: []
        // });
        // res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            // throw new Error('Dummy');
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/add-edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImage = req.file;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/add-edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/add-edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if (updatedImage) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = updatedImage.path;
            }
            return product.save().then(result => {
                console.log('UPDATED PRODUCT!');
                res.redirect('/admin/products');
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, nex) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// I'm not using postDeleteProduct anymore!
exports.postDeleteProduct = (req, res, next) => {
    productId = req.body.productId;
    Product.findById(productId).then(
        product => {
            if (!product) {
                return next(new Error('Product Not Found!'))
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: productId, userId: req.user._id })
        }
    ).then(() => {
            console.log('PRODUCT DELETED');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
    });
};

// This is the new implementation of deleting products
exports.deleteProduct = (req, res, next) => {
    productId = req.params.productId;
    Product.findById(productId).then(
        product => {
            if (!product) {
                return next(new Error('Product Not Found!'))
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: productId, userId: req.user._id })
        }
    ).then(() => {
            console.log('PRODUCT DELETED');
            res.status(200).json({message: 'Success!'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Deleting product failed.'});
    });
};