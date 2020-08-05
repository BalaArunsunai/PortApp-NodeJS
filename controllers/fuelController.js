const connection = require('../database/db');
const logger = require('../lib/logger').logger

exports.vendor_list_autocomplete = (req, res) => {
    vender_name = req.query.vendor_name;
    if (vender_name) {
        connection.query("select vender_name from vender_list where vender_name LIKE '%" + vender_name + "%'", (err, rows) => {
            if (err) {
                logger.log({ level: "error", message: `Error message: ${err}` });
                return res.status(400).json({ status: false, message: `error processing your request ${err}` })
            }console.log(rows);
            return res.status(200).json({ status: true, message: 'successfully fetch details', result: rows })
        })
    } else {
        connection.query("select vender_name from vender_list ORDER BY vender_name ASC", (err, rows) => {
            if (err) {
                logger.log({ level: "error", message: `Error message: ${err}` });
                return res.status(400).json({ status: false, message: `error processing your request ${err}` })
            }
            return res.status(200).json({ status: true, message: 'successfully fetch details', result: rows })
        })
    }
}

exports.upload_fuel_details = (req, res) => {
    token = jwt.verify(req.token, config.tokenInfo.secreteKey)
    const data = req.body;
    vehicle_details_id = data.vehicle_details_id;
    fuel = data.fuel;
    fuel_date_time = new Date();
    device_info = data.device_info;
    connection.query('select * from admin where admin_id = ?', [token.data.id], (err, admin) => {
        if (err) {
            logger.log({ level: "error", message: `Error message: ${err}` });
            return res.status(400).json({ status: false, message: `error processing your request ${err}` });
        } if (admin.length != '') {
            connection.query('select * from vehicle_details where vehicle_details_id = ?', [vehicle_details_id], (err, vehicle) => {
                if (err) {
                    logger.log({ level: "error", message: `Error message: ${err}` });
                    return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                }
                if (vehicle != '') {
                    connection.query('INSERT INTO fuel_details (admin_id, vehicle_details_id, fuel, fuel_date_time, device_info) VALUES (?,?,?,?,?)', [admin_id, vehicle_details_id, fuel, fuel_date_time, device_info], (err, result) => {
                        if (err) {
                            logger.log({ level: "error", message: `Error message: ${err}` });
                            return res.status(400).json({ status: false, message: `error processing your request ${err}` });
                        }
                        return res.status(200).json({ status: true, message: 'data successfully uploaded' })
                    })
                }else {
                    return res.status(200).json({ status: false, message: 'vehicle not found' })
                }
            })
        } else {
            return res.status(200).json({ status: false, message: 'admin not found' })
        }
    })

}
