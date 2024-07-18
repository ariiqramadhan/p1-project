const { Product, Category, UserDetail, City } = require('../models/index');
const formatPrice = require('../helpers/helper');
class Controller {
    static async home(req, res) {
        try {
            const { userId, userRole } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}`)
            }
            const products = await Product.findAll();
            // switch (req.session.user.role) {
            //     case 'admin':
            //         res.render('admin', { user: req.session.user, products, formatPrice });
            //         break;
            //     case 'user':
            //         res.render('user', { user: req.session.user });
            //         break;
            // }
            res.render('home', { user: req.session.user, products, formatPrice });
        } catch (err) {
            res.send(err);
        }
    }
     
    static async productDetails(req, res) {
        try {
            const { userId, userRole, productId } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/product/${productId}`)
            }
            const product = await Product.findByPk(productId, {
                include: {
                    model: Category
                }
            });
            res.render('productdetails', { product, user: req.session.user, formatPrice });
        } catch (err) {
            res.send(err);
        }
    }
     
    static async renderProfile(req, res) {
        try {
            const { userId, userRole } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/profile`)
            }
            const profile = await UserDetail.findOne({
                where: {
                    UserId: req.session.user.id
                }
            });
            const cities = await City.findAll();
            res.render('userdetails', { profile, user: req.session.user, cities });
        } catch (err) {
            res.send(err);
        }
    }
     
    static async handlerProfile(req, res) {
        try {
            const { phoneNumber, gender, address, CityId } = req.body;
            const [profile, created] = await UserDetail.findOrCreate({
                where: {
                    UserId: req.session.user.id
                },
                defaults: {
                    phoneNumber,
                    gender,
                    address,
                    CityId,
                    UserId: req.session.user.id
                }
            });
            console.log(created);
            if (created) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/profile`);
            } else {
                await UserDetail.update({
                    phoneNumber,
                    gender,
                    address,
                    CityId
                },
                {
                    where: {
                        UserId: req.session.user.id
                    }
                });
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/profile`);
            }
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