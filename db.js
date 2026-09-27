const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "supermarket_refrigeration",
  password: "inderjeetkalra.15",
  port: 5432
});

module.exports = pool;