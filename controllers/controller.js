const { User } = require('../models/index');
const bcrypt = require('bcryptjs');

class Controller {
    static async renderRegister(req, res) {
        try {
            res.render('register');
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
            res.send(err);
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

    static async home(req, res) {
        try {
            const { userId } = req.params;
            if (req.session.user.id !== +userId) {
                return res.redirect(`/${req.session.user.id}/${req.session.user.role}`)
            }
            switch (req.session.user.role) {
                case 'admin':
                    res.render('admin', { user: req.session.user });
                    break;
                case 'user':
                    res.render('user', { user: req.session.user });
                    break;
            }
        } catch (err) {
            res.send(err);
        }
    }

    static async userAuth(req, res, next) {
        try {
            console.log(req.session);
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

    static async redirectLogin(req, res) {
        try {
            res.redirect('/login');
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