require('dotenv').config(); // make environment variables available
const mysql = require('mysql2/promise'); // allows the use of mysql and promises

//establish connection to mysql
const con = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PSWD,
  database: process.env.MYSQL_DB
})

// a function; query, allows to connect to database and make sql queries/ CRUD operations
const query = (sql, binding) => {
  return new Promise((resolve, reject) => { //returns promise
    con.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    })
  })
}

module.exports = { con, query }