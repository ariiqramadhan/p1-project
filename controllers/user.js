const { Product, Category, UserDetail, City, User } = require('../models/index');
const formatPrice = require('../helpers/helper');
const { writeFile } = require('fs').promises;
const easyinvoice = require('easyinvoice');

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
            const data = {
                apiKey: "free", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
                mode: "development", // Production or development, defaults to production   
                images: {
                    // The logo on top of your invoice
                    logo: "https://public.budgetinvoice.com/img/logo_en_original.png",
                },
                // Your own data
                sender: {
                    company: "Toko Kocak",
                    address: "Jl. Jalan Sampai Kelar",
                    zip: "SBY-06",
                    city: "Surabaya",
                    country: "Indonesia"
                },
                client: {
                    company: user.UserDetail.name,
                    phoneNumber: user.UserDetail.phoneNumber,
                    address: user.UserDetail.address,
                    zip: 'SBY-06',
                    city: user.UserDetail.City.name,
                    country: "Indonesia"
                },
                information: {
                    // Invoice number
                    number: "2021.0001",
                    // Invoice data
                    date: "12-12-2021",
                    // Invoice due date
                    dueDate: "31-12-2021"
                },
                products: [
                    {
                        quantity: 1,
                        description: product.name,
                        price: product.price
                    }
                ],
                settings: {
                    currency: "IDR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                    locale: "id-ID", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')        
                },
            };
            const result = await easyinvoice.createInvoice(data);
            await writeFile(`./invoices/invoice-${req.session.user.id}-${new Date().getTime()}.pdf`, result.pdf, 'base64');
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