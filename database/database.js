const Sequelize = require("sequelize");
const connection = new Sequelize('bdblog', 'root', 'root1415', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;