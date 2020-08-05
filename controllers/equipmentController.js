const connection = require('../database/db');
const config = require('../config');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

exports.validateVehicle = (req, res) => {
    const data = req.query;
    vendor_Name = data.vendor_Name;
    vehicle_number = data.vehicle_number;
    vehicle_type = data.vehicle_type;
    connection.query(`SELECT vd.vehicle_details_id, vd.vendor_Name, vd.vehicle_number, vd.vehicle_type ,ei.equipment_id,ei.current_status, ei.activity, ei.vessel_name, FROM vehicle_details as vd INNER JOIN equipment_details as ei ON
    vd.vehicle_details_id = ei.vehicle_details_id where vd.vendor_Name = ? and vd.vehicle_number = ? and vd.vehicle_type = ?`, [vendor_Name, vehicle_number, vehicle_type], (err, result) => {
        if (err) {
            res.send(err);
        } if (result.length != '') {
            return res.status(200).json({ status: true, message: 'vahicle succesfully velidated !', result })
        } else if (result.length == 0) {
            connection.query(`select vehicle_details_id, vendor_Name, vehicle_number, vehicle_type from vehicle_details where vendor_Name = ? and vehicle_number = ? and vehicle_type = ? `, [vendor_Name, vehicle_number, vehicle_type], (err, result1) => {
                if (err) {
                    res.send(err);
                } if (result.length !== '') {
                    return res.status(200).json({ status: true, message: 'vahicle succesfully velidated !', result1 })
                } else {
                    return res.status(200).json({ status: false, message: 'invalid vehicle details' })
                }
            })
        } else {
            return res.status(200).json({ status: false, message: 'invalid vehicle details' })
        }
    });
}

exports.uploadEquipmentDetails = (req, res) => {
    token = jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.body;
    vehicle_details_id = data.vehicle_details_id;
    vessel_name = data.vessel_name;
    activity = data.activity;
    location = data.location;
    registered_on = new Date();
    equipment_id = data.equipment_id;
    updated_on = new Date();
    reading = data.reading;
    connection.beginTransaction(function (err) {
        if (err) {
            return res.status(200).json({ status: false, message: `error processing your request: ${err}` })

        }
        connection.query(`insert into equipment_details (vehicle_details_id, vessel_name, activity, location, registered_on) values(?,?,?,?,?)`, [vehicle_details_id, vessel_name, activity, location, registered_on], (err, result) => {
            if (err) {
                connection.rollback(function () {
                    return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                });
            } if (result) {
                connection.query(`insert into equipment_status (equipment_id, updated_on , reading) values(?,?,?)`, [result.insertId, updated_on, reading], (err, rows) => {
                    if (err) {
                        connection.rollback(function () {
                            return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                        });
                    } if (rows) {
                        sql = `SELECT ed.*, es.*, vd.* FROM equipment_details AS ed INNER JOIN equipment_status as es ON ed.equipment_id = es.equipment_id INNER JOIN
                        vehicle_details as vd on ed.vehicle_details_id = vd.vehicle_details_id where ed.equipment_id = ?`;
                        connection.query(sql, [result.insertId], (err, rows) => {
                            if (err) {
                                connection.rollback(function () {
                                    return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                                });
                            }
                            console.log(rows);
                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                                    });
                                }
                                return res.status(200).json({ status: true, message: 'successfully uploaded!', result: rows })
                            })
                        })
                    }

                })
            }
        })
    })
}

exports.uploadImage = (req, res) => {
    const data = req.body;
    equipment_id = data.equipment_id;
    equipment_status_id = data.equipment_status_id
    image = req.files[0].path;
    status = 'start';
    current_status = 'start';
    updated_on = new Date();
    connection.query(`select * from equipment_status where equipment_id = ?`, [equipment_id], (err, result) => {
        if (err) {
            return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
        }
        if (result.length !== 0) {
            if (result) {
                connection.query(`update equipment_status set status = ?, updated_on = ?, image = ? where equipment_id = ?`, [status, updated_on, image, equipment_id], (err, rows) => {
                    if (err) {
                        return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                    } if (rows) {
                        connection.query(`update equipment_details set current_status = ? where equipment_id = ?`, [current_status, equipment_id], (err, result) => {
                            if (err) {
                                return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                            } if (result) {
                                connection.query(`select ed.*, es.* from equipment_details as ed INNER JOIN equipment_status AS es ON ed.equipment_id = es.equipment_id WHERE es.equipment_status_id = ? and es.equipment_id = ?`, [equipment_status_id, equipment_id], (err, row) => {
                                    if (err) {
                                        return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                                    }
                                    if (row) {
                                        row[0].image = '/' + row[0].image.split('/').slice(1).join('/');
                                        return res.status(200).json({ status: true, message: `image successfully uploaded!`, result: row })
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                return res.status(200).json({ status: false, message: `equipment status is already closed!` })
            }
        } else {
            return res.status(200).json({ status: false, message: `equipment details not found!` })
        }
    })

}

exports.updateStatus = (req, res) => {
    const data = req.body;
    equipment_id = data.equipment_id;
    updated_on = new Date();
    image = req.files[0].path;
    reading = data.reading;
    connection.query(`select * from equipment_status where equipment_id = ?`, [equipment_id], (err, result) => {
        if (err) {
            return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
        } if (result.length !== 0) {
            if (result[0].status == 'start') {
                status = 'start';
                connection.query(`insert into equipment_status (equipment_id, status, updated_on, reading, image) values(?,?,?,?,?)`, [equipment_id, status, updated_on, reading, image], (err, result) => {
                    if (err) {
                        return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                    } if (result) {
                        current_status = 'start';
                        connection.query(`update equipment_details set current_status = ?`, [current_status, equipment_id], (err, rows) => {
                            if (err) {
                                return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                            } if (rows) {
                                connection.query(`select * from equipment_status where equipment_status_id = ?`, [result.insertId], (err, row) => {
                                    if (err) {
                                        return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                                    }
                                    row[0].image = row[0].image.split('/').slice(1).join('/');
                                    return res.status(200).json({ status: true, message: `status changed!`, row })
                                })
                            }
                        })
                    }
                })
            } else {
                return res.status(200).json({ status: false, message: `status is closed!` })
            }
        } else {
            return res.status(200).json({ status: false, message: `equipment details not found!` })
        }
    })
}

exports.getStatusDetails = (req, res) => {
    const data = req.query;
    equipment_id = data.equipment_id;
    connection.query(`SELECT * from equipment_details where equipment_id = ?`, [equipment_id], (err, result) => {
        if (err) {
            return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
        } if (result) {
            result.map(el => {
                el.image = '/' + el.image.split('/').slice(1).join('/');
                return el;
            })
            var add = 0
            for (var i = 0; i < result.length; i++) {
                if (result.length > i + 1) {
                    total = moment(result[i].updated_on).from(moment(result[i + 1].updated_on))
                    total = total.split(" ")
                    if (total[1] === 'a') {
                        add = add + 1
                    } else {
                        add = add + parseInt(total[1])
                    }
                }
            }
            return res.status(200).json({ status: true, message: `successfully get responce!`, result, totalTime: add })
        } else {
            return res.status(200).json({ status: false, message: `not found` })
        }
    })
}

exports.closeStatus = (req, res) => {
    const data = req.body;
    equipment_id = data.equipment_id;
    updated_on = new Date();
    image = req.files[0].path;
    reading = data.reading;
    status = data.status;
    connection.query(`select * from equipment_status where equipment_id = ?`, [equipment_id], (err, result) => {
        if (err) {
            return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
        } if (result.length !== 0) {
            if (result[0].status == 'start') {
                connection.query(`insert into equipment_status (equipment_id, status, updated_on, reading, image) values(?,?,?,?,?)`, [equipment_id, status, updated_on, reading, image], (err, result) => {
                    if (err) {
                        return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                    } if (result) {
                        connection.query(`update equipment_details set current_status = ?`, [status, equipment_id], (err, rows) => {
                            if (err) {
                                return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                            } if (rows) {
                                connection.query(`SELECT ed.current_status,es.image from equipment_details as ed INNER JOIN equipment_status AS es ON ed.equipment_id = es.equipment_id where es.equipment_id = ? and es.equipment_status_id = ?`, [equipment_id, result.insertId], (err, row) => {
                                    if (err) {
                                        return res.status(401).json({ status: false, message: `error processing your request: ${err}` })
                                    }
                                    row[0].image = '/' + row[0].image.split('/').slice(1).join('/');
                                    return res.status(200).json({ status: true, message: `status closed!`, row })
                                })
                            }
                        })
                    }
                })
            } else {
                return res.status(200).json({ status: false, message: `status is alresdy closed!` })
            }
        } else {
            return res.status(200).json({ status: false, message: `equipment details not found!` })
        }
    })
}