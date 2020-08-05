const connection = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.admin_login = (req, res) => {
    const data = req.body;
    email = data.email;
    password = data.password;
    connection.query(`SELECT * from admin where email = ?`, [email], (err, rows) => {
        if (rows != "") {
            bcrypt.compare(password, rows[0].password, (err, result) => {
                if (err) {
                    throw err;
                } if (result) {
                    let data = {
                        "password": rows[0].password,
                        "email": rows[0].email,
                        "id": rows[0].admin_id

                    }
                    var now = Math.floor(Date.now() / 1000),
                        iat = (now - 10),
                        jwtId = Math.random().toString(36).substring(7);
                    var payload = {
                        iat: iat,
                        jwtid: jwtId,
                        audience: 'TEST',
                        data: data
                    }
                    jwt.sign(payload, config.tokenInfo.secreteKey, { algorithm: 'HS256' }, (err, token) => {
                        if (err) {
                            return false;
                        }
                        return res.status(200).json({ status: true, message: "success", token });
                    })
                } else {
                    return res.status(200).json({ status: false, message: 'wrong password!' })
                }
            })

        } else if (rows == false) {
            return res.status(401).json({ status: false, message: 'please check above details' })
        }
    })

}


exports.register_admin = (req, res) => {
    const data = req.body;
    name = data.name;
    type = data.type;
    email = data.email;
    phone = data.phone;
    password = bcrypt.hashSync(data.password, 10);
    connection.query(`select * from admin where email = ?`, [email], (err, admin) => {
        if (err) {
            return res.send(err)
        } if (admin.length != '') {
            return res.status(200).json({ status: false, message: 'email already exist!' })
        } else {
            connection.query(`insert into admin (name, email, phone, type, password) values(?,?,?,?,?)`, [name, email, phone, type, password], (err, result) => {
                if (err) {
                    return res.send(err)
                }
                return res.status(200).json({ status: true, message: 'successfully registered!' })

            })
        }
    })
}