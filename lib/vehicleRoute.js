const Vehicle = require('../models/Vehicle');

async function checkVehicle(userField) {
    return await Vehicle.findOne({where: { plate: userField }});
}

module.exports.checkVehicle = checkVehicle;