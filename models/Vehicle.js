// dependencies
const Sequelize = require('sequelize');
const db = require('../config/database');

const Vehicle = db.define('vehicle', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    make: {
        type: Sequelize.STRING,
    },
    model: {
        type: Sequelize.STRING,
    },
    colour: {
        type: Sequelize.STRING,
    },
    manufacture_year: {
        type: Sequelize.DATE,
    },
    plate: {
        type: Sequelize.STRING,
    },
    availability: {
        type: Sequelize.BOOLEAN,
    }
});

module.exports = Vehicle;
