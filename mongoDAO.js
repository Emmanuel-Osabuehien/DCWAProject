const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

//MongoDB Database and Collection
const dbName = 'headsOfStateDB'
const collName = 'headsOfState'

var headsOfStateDB
var headsOfState

//Connecting to the mongo client
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        headsOfStateDB = client.db(dbName)
        headsOfState = headsOfStateDB.collection(collName)
    })
    .catch((error) => {
        console.log(error)
    })

//This is my get Head of State function
var getHeadOfState = function () {
    return new Promise((resolve, reject) => {
        //Retrieves the documents in my collection
        var cursor = headsOfState.find()
        cursor.toArray()
            .then((documents) => {
                //This will retrieve my documents inside my collection and prints to page
                resolve(documents)
            })
            .catch((error) => {
                //if there is an error, a message will be sent back
                reject(error)
            })
    })
}

//This is my add Head of State function
var addHeadOfState = function (_id, headOfState) {
    return new Promise((resolve, reject) => {
        //Inserts a new id and head of state into my collection
        headsOfState.insertOne({ "_id": _id, "headOfState": headOfState })
            .then((result) => {
                //if function works it will print result into collection and page
                resolve(result)
            })
            .catch((error) => {
                //if not, it will send back an error message
                reject(error)
            })
    })
}

//Makes sure function executes
module.exports = { getHeadOfState, addHeadOfState }