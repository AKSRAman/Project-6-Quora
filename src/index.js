const route = require('./routes/route');
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const responseTime = require('response-time')
const dotnev = require("dotenv")
const app = express()

const midGlb = function (req, res, next) {
    let currDate = new Date().toLocaleString()
    console.log(currDate, req.originalUrl);
    next()
}
app.use(midGlb)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(responseTime());

dotnev.config({ path: "./config.env" })
const myDbString = process.env.DATABASE
//const myDbString = "mongodb+srv://user-open-to-all:hiPassword123@cluster0.xgk0k.mongodb.net/project_6_Akash?retryWrites=true&w=majority"
mongoose.connect(myDbString, { useNewUrlParser: true, }).then(() => {
    console.log("You have connected with your mongoDB")
}).catch((err) => console.log("There is some problem in mongoose connection", { error: err }))

app.use('/', route);

app.listen(process.env.PORT || 3000, () => {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})