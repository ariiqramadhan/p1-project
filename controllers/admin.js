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
            console.log(productId);
            await Product.destroy({
                where: {
                    id: productId
                }
            });
            res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts`)
        } catch (err) {
            res.send(err);
        }
    }
    
    static async renderAddProduct(req, res) {
        try {
            const { userId, userRole } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts/product/add`)
            }
            const categories = await Category.findAll();
            res.render('addproduct', { user: req.session.user, categories });
        } catch (err) {
            res.send(err);
        }
    }
    
    static async handlerAddProduct(req, res) {
        try {
            const { name, stock, description, price, imageUrl, category: category } = req.body;
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
            res.redirect(`/${req.session.user.id}/${req.session.user.role}/manageproducts`)
        } catch (err) {
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