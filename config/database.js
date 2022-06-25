const Sequelize = require('sequelize');

module.exports = new Sequelize('car_rental', 'root', 's3ntinel', {
    host: 'localhost',
    dialect: 'mysql'
});