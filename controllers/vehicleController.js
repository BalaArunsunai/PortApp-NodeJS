const connection = require('../database/db');
const config = require('../config');
const jwt = require('jsonwebtoken');

const logger = require('../lib/logger').logger


exports.vehicle_type_auto_complete = (req, res) => {
    vehicle_name = req.query.vehicle_name;
    if (vehicle_name) {
        connection.query("select vehicle_name from vehicle_type where vehicle_name LIKE '%" + vehicle_name + "%'", (err, rows) => {
            if (err) {
                logger.log({ level: "error", message: `Error message: ${err}` });
                return res.status(400).json({ status: false, message: `error processing your request ${err}` });
            }
            return res.status(200).json({ status: true, message: 'successfully fetch details', result: rows })
        })
    } else {
        connection.query("select vehicle_name from vehicle_type", (err, rows) => {
            if (err) {
                logger.log({ level: "error", message: `Error message: ${err}` });
                return res.status(400).json({ status: false, message: `error processing your request ${err}` })
            }
            return res.status(200).json({ status: true, message: 'successfully fetch details', result: rows })
        })
    }
}


exports.upload_vehicle_details = (req, res) => {
    token = jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.body;
    vendor_Name = data.vendor_Name;
    vehicle_number = data.vehicle_number;
    vehicle_type = data.vehicle_type;
    vehicle_Timestamp = new Date();
    device_info = data.device_info;
    connection.query('select * from admin where admin_id = ?', [token.data.id], (err, admin) => {
        if (err) {
            logger.log({ level: "error", message: `Error message: ${err}` });
            return res.status(400).json({ status: false, message: `error processing your request ${err}` });
        } if (admin.length != '') {
            connection.query('select vender_name from vender_list where vender_name = ?', [vendor_Name], (err, vendor) => {
                if (err) {
                    logger.log({ level: "error", message: `Error message: ${err}` });
                    return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                }
                if (vendor.length != 0) {
                    connection.query('INSERT INTO vehicle_details (admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info) VALUES (?,?,?,?,?,?)', [admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info], (err, result) => {
                        if (err) {
                            logger.log({ level: "error", message: `Error message: ${err}` });
                            return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                        }
                        return res.status(200).json({ status: true, message: 'data successfully uploaded' })
                    })
                } else {
                    connection.query('INSERT INTO vender_list (vender_name) VALUES (?)', [vendor_Name], (err, result) => {
                        if (err) {
                            logger.log({ level: "error", message: `Error message: ${err}` });
                            return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                        } if (result) {
                            connection.query('INSERT INTO vehicle_details (admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info) VALUES (?,?,?,?,?,?)', [admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info], (err, result) => {
                                if (err) {
                                    logger.log({ level: "error", message: `Error message: ${err}` });
                                    return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                                }
                                return res.status(200).json({ status: true, message: 'data successfully uploaded' })
                            })
                        }
                    })
                }
            })
        } else {
            logger.log({ level: "error", message: `Error message: ${err}` });
            return res.status(200).json({ status: false, message: 'admin not found' })
        }
    })
}

exports.get_vehicle_details = (req, res) => {
    token = jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.query;
    vehicle_details_id = data.vehicle_details_id;
    connection.query('select * from admin where admin_id = ?', [token.data.id], (err, admin) => {
        if (err) {
            logger.log({ level: "error", message: `Error message: ${err}` });
            return res.status(400).json({ status: false, message: `error processing your request ${err}` });
        } if (admin.length != '') {
            connection.query('select * from vehicle_details where vehicle_details_id = ?', [vehicle_details_id], (err, result) => {
                if (err) {
                    logger.log({ level: "error", message: `Error message: ${err}` });
                    return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                }
                return res.status(200).json({ status: true, message: 'data successfully fetched', result })
            })
        } else {
            return res.status(200).json({ status: false, message: 'admin not found' })
        }
    })
}

/* connection.query('INSERT INTO vehicle_details (admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info) VALUES (?,?,?,?,?,?)', [admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info], (err, result) => {
                if (err) {
                    logger.log({ level: "error", message: `Error message: ${err}` });
                    return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                }
                return res.status(200).json({ status: true, message: 'data successfully uploaded' })
            }) */



/* {
        connection.query('INSERT INTO vender_list (vender_name) VALUES (?)', [vendor_Name], (err, result) => {
            console.log(result);
            if (err) {
                logger.log({ level: "error", message: `Error message: ${err}` });
                return res.status(400).json({ status: false, message: `error processing your request ${err}` });
            } if (result) {
                connection.query('INSERT INTO vehicle_details (admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info) VALUES (?,?,?,?,?,?)', [admin_id, vendor_Name, vehicle_number, vehicle_type, vehicle_Timestamp, device_info], (err, result) => {
                    if (err) {
                        logger.log({ level: "error", message: `Error message: ${err}` });
                        return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                    }
                    return res.status(200).json({ status: true, message: 'data successfully uploaded' })
                })
            }
        })
    } */