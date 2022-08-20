const { createConnection } = require('./database');

async function getUser(email) {
    let client = createConnection();
    //let rows = await client.query(`SELECT email FROM users`);
    //console.log(rows)
    let query = `SELECT name FROM users WHERE email = ($1)`;
    let data = await client.query(query, [email]);
    client.end();
    return data.rows;
}

module.exports = { getUser };