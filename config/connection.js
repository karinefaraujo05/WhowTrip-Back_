const Sequelize = require("sequelize");
require("dotenv").config();

let sequelize;

sequelize = new Sequelize({
  username: "yxrdrslnldvrzszd",
  password: "jca4y2gnmcybpr4t",
  database: "km58fa9n4pkw70ub",
  host: "r98du2bxwqkq3shg.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  dialect: "mysql",
  port:3306
})

module.exports = sequelize;
