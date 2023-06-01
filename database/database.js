const Sequelize = require("sequelize");
const connection = new Sequelize('bdblog', 'root', 'root1415', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;