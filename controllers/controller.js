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
            res.redirect('login');
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
                const error = 'Invlaid Email/Password'
                return res.redirect(`/login?error=${error}`);
            }

            if (bcrypt.compareSync(password, data.password)) {
                return res.redirect('/');
            } else {
                return res.redirect('/login?error=Invalid Email/Password');
            }
        } catch (err) {
            res.send(err);
        }
    }

    static async test(req, res) {
        try {
            res.render('home');
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

    // static async renderRegister(req, res) {
    //     try {

    //     } catch (err) {
    //         res.send(err);
    //     }
    // }
}

module.exports = Controller;