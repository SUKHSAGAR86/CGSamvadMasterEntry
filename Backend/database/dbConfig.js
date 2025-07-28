const sql = require("mssql");

const config = {
  user: "sa",
  password: "nic",
  server: "localhost",
  database: "samvad",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
  sql,
  pool,
  poolConnect,
};
