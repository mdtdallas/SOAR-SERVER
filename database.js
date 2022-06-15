
// Import mysql2 module so that we can talk to the database
const mysql = require("mysql2")

// Create a connection to the database
// const connection = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "soar"
// })

const connection = mysql.createPool({
    host: "us-cdbr-east-05.cleardb.net",
    user: "b65a5210e3b5ab",
    password: "0881628e",
    database: "heroku_c58f5188f29ac0c"
})



// This wrapper will allow the use of promise functions
// like .then() and .catch() so that we can use it in an async
// way along with expressJS.


const query = (sql, parameters) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, parameters, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

// export the new query function so that the models can use it
module.exports = {
    query
}