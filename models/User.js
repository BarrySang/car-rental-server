// dependencies
const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    first_name: {
        type: Sequelize.STRING,
    },
    last_name: {
        type: Sequelize.STRING,
    },
    phone: {
        type: Sequelize.INTEGER,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    admin: {
        type: Sequelize.INTEGER,
    },
});

module.exports = User;
