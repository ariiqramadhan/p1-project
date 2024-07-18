const formatPrice = require('../helpers/helper');
const { User, Product } = require('../models/index');
const bcrypt = require('bcryptjs');

class Controller {
    static async redirectLogin(req, res) {
        try {
            res.redirect('/login');
        } catch (err) {
            res.send(err);
        }
    }

    static async renderRegister(req, res) {
        try {
            const { error } = req.query;
            res.render('register', { error });
        } catch (err) {
            res.send(err);
        }
    }
    
    static async handlerRegister(req, res) {
        try {
            const { email, password } = req.body;
            await User.create({
                email,
                password
            });
            return res.redirect('login');
        } catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const errors = err.errors.map(error => error.message);
                res.redirect(`/register?error=${errors}`);
            } else if (err.name === 'SequelizeUniqueConstraintError') {
                const errors = err.errors.map(error => error.message);
                res.redirect(`/register?error=${errors}`);
            }
        }
    }

    static async renderLogin(req, res) {
        try {
            const { error } = req.query;
            res.render('login', { error });
        } catch (err) {
            res.send(err);
        }
    }

    static async handlerLogin(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.redirect('/login?error=Invalid Email/Password');
            }

            const data = await User.findOne({
                where: {
                    email
                }
            });

            if (!data) {
                return res.redirect(`/login?error=Invlaid Email/Password`);
            }

            if (bcrypt.compareSync(password, data.password)) {
                req.session.user = {
                    id: data.id,
                    role: data.role
                };
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}`);
            } else {
                return res.redirect('/login?error=Invalid Email/Password');
            }
        } catch (err) {
            res.send(err);
        }
    }

    static async userAuth(req, res, next) {
        try {
            if (!req.session.user) {
                return res.redirect('/login?error=You must login first!');
            }
        
            if (!req.session.user.id) {
                return res.redirect('/login?error=You must login first!');
            } else {
                next();
            }
        } catch (err) {
            res.send(err);
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy();
            res.redirect('/login?error=Logout Success');
        } catch (err) {
            res.send(err);
        }
    }

    static async isAdmin(req, res, next) {
        try {
            if (req.session.user.role !== 'admin') {
                req.session.destroy();
                return res.redirect('/login?error=You have no access!');
            } else {
                next();
            }
        } catch (err) {
            res.send(err);
        }
    }

    static async isUser(req, res, next) {
        try {
            if (req.session.user.role !== 'user') {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}`)
            } else {
                next();
            }
        } catch (err) {
            res.send(err);
        }
    }
}

module.exports = Controller;