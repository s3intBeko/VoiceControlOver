const { Pool } = require('pg');
const dotenv = require('dotenv');
const db = require('.')

dotenv.config();
/*const { Pool, Client } = require('pg')
    const pool = new Pool({
        user: 'seint',
        host: 'localhost',
        database: 'texasholdem',
        password: 'ber1917',
        port: 5432,
    })
    pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
})*/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/*const pool = new Pool({
    user: 'seint',
    host: 'localhost',
    database: 'texasholdem',
    password: 'ber1917',
    port: 5432,
})*/

/*
pool.query('SELECT NOW()', (err, res) => {
console.log(err, res)
pool.end()
})*/

class Query {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object 
   */


  query(text, params){
    return new Promise((resolve, reject) => {
      pool.query(text, params)
      .then((res) => {
          //console.log(res)
        resolve(res);
      })
      .catch((err) => {
          console.log('errordb' + err)
        reject(err);
      })
    })
  }
}
exports.Query = Query