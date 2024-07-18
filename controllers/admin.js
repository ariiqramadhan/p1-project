const formatPrice = require('../helpers/helper');
const { Product, Category, ProductCategory } = require('../models/index');

class Controller {
    static async manageProducts(req, res) {
        try {
            const { userId, userRole } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts`)
            }
            const products = await Product.findAll();
            res.render('manageproducts', { products, user: req.session.user, formatPrice });
        } catch (err) {
            res.send(err);
        }
    }
    
    static async deleteProduct(req, res) {
        try {
            const { productId } = req.params;
            await Product.destroy({
                where: {
                    id: productId
                }
            });
            await ProductCategory.destroy({
                where: {
                    ProductId: productId
                }
            });
            res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts`);
        } catch (err) {
            res.send(err);
        }
    }
    
    static async renderAddProduct(req, res) {
        try {
            const { userId, userRole } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts/product/add`);
            }
            const categories = await Category.findAll();
            res.render('addproduct', { user: req.session.user, categories });
        } catch (err) {
            res.send(err);
        }
    }
    
    static async handlerAddProduct(req, res) {
        try {
            const { name, stock, description, price, imageUrl, category } = req.body;
            const { id } = await Product.create({
                name,
                stock,
                description,
                price,
                imageUrl
            });
            const categories = category.map(val => {
                return {
                    CategoryId: val,
                    ProductId: id
                }
            });
            await ProductCategory.bulkCreate(categories);
            res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts`);
        } catch (err) {
            res.send(err);
        }
    }
    
    static async renderEditProduct(req, res) {
        try {
            const { userId, userRole, productId } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/product/${productId}/edit`);
            }
            const product = await Product.findByPk(productId, {
                include: {
                    model: Category
                }
            });
            const categories = await Category.findAll();
            res.render('editproduct', { product, user: req.session.user, categories });
        } catch (err) {
            res.send(err);
        }
    }
    
    static async handlerEditProduct(req, res) {
        try {
            const { productId } = req.params;
            const { name, stock, description, price, imageUrl, category } = req.body;
            await Product.update({
                name,
                stock,
                description,
                price,
                imageUrl
            },
            {
                where: {
                    id: productId
                }
            });
            await ProductCategory.destroy({
                where: {
                    ProductId: productId
                }
            });
            const categories = category.map(val => {
                return {
                    CategoryId: val,
                    ProductId: productId
                }
            });
            await ProductCategory.bulkCreate(categories);
            res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts`)
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }
    
    // static async renderRegister(req, res) {
    //     try {

    //     } catch (err) {
    //         res.send(err);
    //     }
    // }
}

module.exports = Controller;