var mysql = require('promise-mysql');

var pool

//This creates a server pool
mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'fifa1234',
    database: 'geography'
})
    .then((result) => {
        //If pool is mysql then it creates a pool
        pool = result
    })
    .catch((error) => {
        //if not an error message will be sent back
        console.log(error)
    });

//This is my get cities function
var getCities = function () {
    return new Promise((resolve, reject) => {
        //This retrieves the data inside the city table in mysql
        pool.query('select * from city')
            .then((result) => {
                //If mysql is accessed, then it will print the city table to my page
                resolve(result)
            })
            .catch((error) => {
                //If not then an error message will be sent back
                reject(error)
            })
    })
}

//This is my get countries function
var getCountries = function () {
    return new Promise((resolve, reject) => {
        //This retrieves the data inside the country table in mysql
        pool.query('select * from country')
            .then((result) => {
                //If mysql is accessed, then it will print the country table to my page
                resolve(result)
            })
            .catch((error) => {
                //If not then an error message will be sent back
                reject(error)
            })
    })
}

//This is my all city detail function
var getCityDetails = function (cty_code, cty_name, co_code, population, isCoastal, areaKM, co_code, co_name) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            //This retrieves the details from city specified(clikced)
            sql: 'select c.cty_code, c.cty_name, c.co_code, c.population, c.isCoastal, c.areaKM, country.co_name from city c left join country on c.co_code = country.co_code where c.cty_code = ?',
            values: [cty_code, cty_name, co_code, population, isCoastal, areaKM, co_code, co_name]
        }
        pool.query(myQuery)
            .then((result) => {
                //If function works then it will retieve data
                resolve(result)
            })
            .catch((error) => {
                //If not then error message will be sent back
                reject(error)
            })
    })
}

//This is my get Country details
var getCountryDetails = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            //This retrieves the details from country specified(clicked)
            sql: 'select co_code, co_name, co_details from country where co_code = ?',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                //If function works then it will retieve data
                resolve(result)
            })
            .catch((error) => {
                //If not then error message will be sent back
                reject(error)
            })
    })
}

//This is my add country function
var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            //This inserts/adds data to my country table
            sql: 'INSERT INTO country (co_code, co_name, co_details) VALUES (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                //If function works then my input data will print to screen and into my country table in mysql
                resolve(result)
            })
            .catch((error) => {
                //If not then error message will be sent back
                reject(error)
            })
    })
}

//This isn my edit country function
var editCountry = function (co_name, co_details, co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            //This inserts/adds data to my country table
            sql: 'UPDATE country SET co_name = ?, co_details = ? WHERE co_code = ?',
            values: [co_name, co_details, co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                //If function works then my input data will print to screen and into my country table in mysql
                resolve(result)
            })
            .catch((error) => {
                //If not then error message will be sent back
                reject(error)
            })
    })
}

//This is my delete country function
var deleteCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            //This inserts/adds data to my country table
            sql: 'delete from country where co_code = ?',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                //If function works then my input data will print to screen and into my country table in mysql
                resolve(result)
            })
            .catch((error) => {
                //If not then error message will be sent back
                reject(error)
            })
    })
}

module.exports = { getCities, getCountries, getCityDetails, getCountryDetails, addCountry, editCountry, deleteCountry }