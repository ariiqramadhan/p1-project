const { Product, Category, UserDetail, City, User } = require('../models/index');
const { formatPrice, generateInvoice } = require('../helpers/helper');
const { Op } = require('sequelize');

class Controller {
    static async home(req, res) {
        try {
            const { userId, userRole } = req.params;
            if (req.session.user.id !== +userId || req.session.user.role !== userRole) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}`)
            }
            const options = {
                order: [
                    ['id']
                ],
                where: {
                    stock: {
                        [Op.gt]: 0
                    }
                }
            };
            const { search, sortPrice } = req.query;
            if (search) {
                options.where.name = {
                    [Op.iLike]: `%${search}%`
                }
            }
            if (sortPrice) {
                options.order = [
                    ['price', sortPrice]
                ]
            }
            const products = await Product.findAll(options);
            res.render('home', { user: req.session.user, products, formatPrice, search });
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
            const { error } = req.query;
            const cities = await City.findAll();
            res.render('userdetails', { profile, user: req.session.user, cities, error });
        } catch (err) {
            res.send(err);
        }
    }
     
    static async handlerProfile(req, res) {
        try {
            const { name, phoneNumber, gender, address, CityId } = req.body;
            const [profile, created] = await UserDetail.findOrCreate({
                where: {
                    UserId: req.session.user.id
                },
                defaults: {
                    name,
                    phoneNumber,
                    gender,
                    address,
                    CityId,
                    UserId: req.session.user.id
                }
            });
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
     
    static async buyProduct(req, res) {
        try {
            const { productId } = req.params;
            const product = await Product.findByPk(productId);
            const user = await User.findByPk(req.session.user.id, {
                include: {
                    model: UserDetail,
                    include: {
                        model: City
                    }
                }
            });
            if (user.UserDetail === null) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}/profile?error=Please fill in your user details first!`);
            }
            await generateInvoice(user.UserDetail.formatName, user.UserDetail.phoneNumber, 
                user.UserDetail.address, user.UserDetail.City.name, 
                product.name, product.price, req.session.user.id
            );

            await Product.decrement({
                stock: 1
            },
            {
                where: {
                    id: {
                        [Op.eq]: productId
                    }
                }
            });
            res.redirect(`/${req.session.user.id}/${req.session.user.role}`)
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