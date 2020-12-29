var express = require('express')
var mySQLDAO = require('./mySQLDAO')
var mongoDAO = require('./mongoDAO')
var bodyParser = require('body-parser')

var app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))

//This is essentially my home page ('/')
app.get('/', (req, res) => {
    //This is my list links for Country, City and Head of State
    res.send("<p><a href=/listCountries>List Countries</a></p>" +
        "<p><a href=/listCities>List Cities</a></p>" +
        "<p><a href=/listHeadOfState>List Head of State</a></p>")
})

//This is my list countries page
app.get('/listCountries', (req, res) => {
    mySQLDAO.getCountries()
        .then((result) => {
            //console.log my collection
            console.log(result)
            //This is presents the ejs layot of my list countries page
            res.render('showCountries', { countries: result })
        })
        .catch((error) => {
            //If an error occurs a message is passed back
            res.send("<h1>Error Message</h1>" + "<h3>Error " + error.message + "</h3")
        })
})

//This is my list cities page
app.get('/listCities', (req, res) => {
    mySQLDAO.getCities()
        .then((result) => {
            //console.log my collection
            console.log(result)
            //This is presents the ejs layot of my list cities page
            res.render('showCities', { cities: result })
        })
        .catch((error) => {
            //If an error occurs a message is passed back
            res.send("<h1>Error Message</h1>" + "<h3>Error: connect ECONNREFUSED 127.0.0.1:3306</h3>")
        })
})

//This is my list head of state page
app.get('/listHeadOfState', (req, res) => {
    mongoDAO.getHeadOfState()
        .then((result) => {
            //console.log my collection
            console.log(result)
            //This is presents the ejs layot of my list head of state page
            res.render('showHeadOfState', { headsOfStates: result })
        })
        .catch((error) => {
            //If an error occurs a message is passed back
            res.send("<h1>Error Message</h1>" + "<h3>connect ECONNREFUSED 127.0.0.1:27017</h3>")
        })
})

//This is my add country page
app.get('/addCountry', (req, res) => {
    //This is presents the ejs layot of my add country page
    res.render("addCountries")
})

//This is performs the function of my add country page
app.post('/addCountry', (req, res) => {
    mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
        .then((result) => {
            if (req.body.co_code.length > 0 && req.body.co_name.length > 0) {//if statement
                //if length of string is greater than than 0, it returns back to the list country page
                res.redirect('/listCountries')
            } else {
                //else it sends back an error message about the string length
                res.send("<p>Country Code must be 3 characters</p>" + "<p>Country Name must be at least 3 characters</p>")
            }
        })
        .catch((error) => {
            //If country code already exists, it sends back an error message
            res.send("Error: " + req.body.co_code + " already exists")
        })
})

//This is performs the function of my all city details page
app.get('/allDetails/:city', (req, res) => {
    mySQLDAO.getCityDetails(req.params.city)
        .then((result) => {
            console.log(result)
            //This present the city detailsl; of whatever city chosen in the list page
            res.render('allCities', { cities: result })
        })
        .catch((error) => {
            //an error will be sent back if code is wrong
            res.send(error)
        })
})

//This is performs the function of my edit country page
app.get('/edit/:country', (req, res) => {
    mySQLDAO.getCountryDetails(req.params.country)
        .then((result) => {
            //This present the city detailsl; of whatever city chosen in the list page
            res.render('editCountries', { countries: result })
        })
        .catch((error) => {
            //an error will be sent back if code is wrong
            res.send(error)
        })
})

app.post('/edit/:country', (req, res) => {
    mySQLDAO.editCountry(req.body.co_name, req.body.co_details, req.body.co_code)
        .then((result) => {
            res.redirect('/listCountries')
        })
        .catch((error) => {
            console.log(error)
            res.send("ERROR")
        })
})

//This is performs the function of my delete country page
app.get('/delete/:country', (req, res) => {
    mySQLDAO.deleteCountry(req.params.country)
        .then((result) => {
            if (result.affectedRows == 0) {
                res.send("<h3>" + req.params.country + " dosen't exist</h3>")
            } else {
                res.redirect('/listCountries')
            }
        })
        .catch((error) => {
            if (error.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h1>Error Message</h1>" + "<h3>" + req.params.country + " has cities, it cannot be deleted</h3>")
            } else {
                res.send("<h1>Error " + error.errno + " " + error.sqlMessage + "</h1>")
            }
        })
})

//This is my add head of state page
app.get('/addHeadOfState', (req, res) => {
    res.render("addHeadOfStates")
})

//This performs the function of my add head of state page
app.post('/addHeadOfState', (req, res) => {
    mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
        .then((result) => {
            if (req.body._id.length > 0) {
                res.redirect("/listHeadOfState")
            }
            else {
                res.send("<p>Country Code must be 3 characters</p>" + "<p>Head of State must be at least 3 characters</p>")
            }
        })
        .catch((error) => {
            res.send("<p>Cannot Add Head of State to " + req.body._id + " as this country is not in my SQL Database")
        })
})

//Port Number
app.listen(3007, () => {
    //When you enter localhoat:3007 in your url, this should come up
    console.log("Listening on port 3007")
})