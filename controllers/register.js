require('dotenv').config()
const bcrypt = require('bcrypt');
const { createConnection } = require('../configs/database');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
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
