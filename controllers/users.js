require('dotenv').config()
const bcrypt = require('bcrypt');
const { createConnection } = require('../configs/database');
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    const { name, email, phone_number, password } = req.body;
    try {
        console.log('din nou')
        let client = createConnection();
        const data = await client.query(`SELECT * FROM users WHERE email = ($1);`, [email]);
        client.end();
        const arr = data.rows;
        if (arr.length != 0) {
            //console.log('Email already there, No need to register again.')
            req.flash('flMess', 'This email address is already being used!');
            res.redirect('/');
            /*return res.status(400).json({
                error: "Email already there, No need to register again.",
            });*/
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    //console.log(err)
                    req.flash('flMess', 'Server error!');
                    res.redirect('/');
                    /*res.status(err).json({
                        error: "Server error",
                    });*/
                }
                const user = {
                    name,
                    email,
                    phone_number,
                    password: hash
                };
                let flag = 1;
                let client = createConnection();
                client.query(`INSERT INTO users(name, email, phonenumber, password) VALUES($1, $2, $3, $4);`, [user.name, user.email, user.phone_number, user.password], (err) => {
                    if (err) {
                        flag = 0;
                        //console.log(err);
                        req.flash('flMess', 'This phone number is already being used!');
                        res.redirect('/')
                        /*return res.status(500).json({
                            error: "Database error"
                        })*/
                    } else {
                        flag = 1;
                        //console.log('User added to database, not verified!')
                        req.flash('flMess', "Your account has been registered successfully!")
                        res.redirect('/');
                        //res.status(200).send({ message: "User added to database, not verified!" });
                    }
                    client.end();
                });
                if (flag) {
                    const token = jwt.sign(
                        {
                            email: user.email
                        },
                        process.env.SECRET_KEY
                    )
                }
            })
        }
    } catch (err) {
        //console.log(err);
        res.status(500).json({
            error: "Database error while registering user!"
        });
    }
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let client = createConnection();
        const data = await client.query(`SELECT * FROM users WHERE email = ($1);`, [email]);
        client.end();
        //console.log(data);
        const user = data.rows;
        if (user.length === 0) {
            req.flash('flMess', 'You are not registered! Sign up first!');
            res.redirect('/');
            /*res.status(400).json({
                error: "User is not registered, Sign up first",
            });*/
        } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    req.flash('flMess', 'Server error!')
                    /*res.status(500).json({
                        error: "Server error",
                    });*/
                } else if (result === true) {
                    console.log('assign token')
                    const token = jwt.sign(
                        {
                            email: email,
                        },
                        process.env.SECRET_KEY
                    );
                    //console.log(token);
                    return res.cookie('token', token, {maxAge: 1800000}).redirect('/pages/welcome');
                    //console.log(req.body.token)
                    /*res.status(200).json({
                        message: "User signed in",
                        token: token,
                    });*/
                } else if (result != true) {
                    req.flash('flMess', 'Enter correct password!');
                    res.redirect('/pages/login');
                    /*res.status(400).json({
                        error: "Enter correct password!"
                    });*/
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Database error occurred while singing in!",
        });
    }
}

module.exports.accessHomepage = (req, res, next) => {
    //console.log(req.jwt)
    //console.log(req.cookies);
    const token = req.cookies['token'];
    try {
        console.log(token)
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.email;
        //console.log(req.user);
        //req.userEmail = decoded.email;
        process.env.USER = req.user;
        //console.log(process.env.USER);
        next();
    } catch (err) {
        req.flash('flMess', 'Log in again!')
        res.redirect('/pages/login')
    }
}

module.exports.accessLoginpage = (req, res, next) => {
    const token = req.cookies['token'];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        //console.log(req.user)
        res.redirect('/pages/welcome')
    } catch (err) {
        //req.flash('flMess', ' ')
        //res.redirect('/pages/login')
        next();
    }
}