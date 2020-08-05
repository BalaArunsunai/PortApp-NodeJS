const connection = require('../database/db');
const config = require('../config');
const jwt = require('jsonwebtoken');

exports.loading_data = (req, res) => {
    const data = req.body
    vehicle_details_id = data.vehicle_details_id;
    vessel_name = data.vessel_name;
    from_detail = data.from_detail;
    to_detail = data.to_detail;
    lat = data.lat;
    lgt = data.lgt;
    date = new Date();
    trip_reference = data.trip_reference;
    connection.beginTransaction(function (err) {
        if (err) {
            return res.status(200).json({ status: false, message: `error processing your request: ${err}` })

        }
        connection.query(`insert into loading_details (vehicle_details_id, vessel_name, from_detail, to_detail, lat, lgt) values(?,?,?,?,?,?)`, [vehicle_details_id, vessel_name, from_detail, to_detail, lat, lgt], (err, result) => {
            if (err) {
                connection.rollback(function () {
                    return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                });
            }
            if (result) {
                connection.query(`insert into loading_status_details (loading_id, date, trip_reference) values(?,?,?)`, [result.insertId, date, trip_reference], (err, rows) => {
                    if (err) {
                        connection.rollback(function () {
                            return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                        });
                    } if (rows) {
                        connection.query(`select ld.*,lsd.* from loading_details as ld inner join loading_status_details as lsd on ld.loading_id = lsd.loading_id where ld.loading_id = ? and lsd.loading_status_id = ?`, [result.insertId, rows.insertId], (err, rows) => {
                            if (err) {
                                connection.rollback(function () {
                                    return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                                });
                            }
                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                                    });
                                }
                                return res.status(200).json({ status: true, message: 'successfully uploaded!', result: rows })
                            });
                        });
                    }
                });
            }
        });
    });
}

exports.update_trip = (req, res) => {
    const data = req.body;
    vehicle_details_id = data.vehicle_details_id;
    loading_status_id = data.loading_status_id;
    connection.query(`select * from loading_details where vehicle_details_id = ?`, [vehicle_details_id], (err, result) => {
        if (err) {
            return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
        }
        if (result) {
            connection.query(`select * from loading_status_details where loading_status_id = ? and loading_id = ?`, [loading_status_id, result[0].loading_id], (err, rows) => {
                if (err) {
                    return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                } if (rows) {
                    tripno = rows[0].trip_no + 1;
                    date = new Date();
                    connection.query(`insert into loading_status_details (loading_id, date, trip_no, trip_status, trip_reference) values(?,?,?,?,?)`, [date, tripno, trip_status, trip_reference], (err, result) => {
                        if (err) {
                            return res.status(200).json({ status: false, message: `error processing your request: ${err}` })
                        } if (result) {
                            res.send('success')
                        }
                    })
                }
            })
        }
    })
}

exports.validateVehicle = (req, res) => {
    const data = req.query;
    vendor_Name = data.vendor_Name;
    vehicle_number = data.vehicle_number;
    vehicle_type = data.vehicle_type;
    connection.query(`select vehicle_details_id, vendor_Name, vehicle_number, vehicle_type from vehicle_details where vendor_Name = ? and vehicle_number = ? and vehicle_type = ? `, [vendor_Name, vehicle_number, vehicle_type], (err, result1) => {
        if (err) {
            res.send(err);
        } if (result1.length !== 0) {
            sql = `SELECT ld.*,lsd.* from loading_details as ld LEFT JOIN loading_status_details as lsd on ld.loading_id = lsd.loading_id where ld.vehicle_details_id = ?`
            connection.query(sql, [result1[0].vehicle_details_id], (err, result) => {
                if (err) {
                    res.send(err);
                } if (result) {
                    return res.status(200).json({ status: true, message: 'vahicle succesfully velidated !', result })
                }
            })
        } else {
            return res.status(200).json({ status: false, message: 'invalid vehicle details' })
        }
    })
}

exports.unloading = (req, res) => {
    const data = req.body;
    loading_id = data.loading_id;
    loading_status_id = data.loading_status_id;
    trip_status = data.trip_status
    connection.query(`select * from loading_status_details where loading_status_id = ? and loading_id = ?`, [loading_status_id, loading_id], (err, result) => {
        console.log(result);
        if (err) {
            res.send(err);
        } if (result.length != 0) {
            if (result[0].trip_status == 0) {
                connection.query(`update loading_status_details set trip_status = ? where loading_status_id = ? and loading_id = ?`, [trip_status, loading_status_id, loading_id], (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        return res.status(200).json({ status: true, message: 'trip status successfully changed!' })
                    }
                })
            } else {
                return res.status(200).json({ status: false, message: 'trip is already closed!' })
            }
        } else {
            return res.status(200).json({ status: false, message: 'invalid loading details' })
        }
    })
}