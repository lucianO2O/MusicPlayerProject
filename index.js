//use express
const express = require('express')
//execute express
const app = express()

//gives access to routes in user
const userRoutes = require("./server/routes/user")

//CORS middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    next()
})


app.use("/user", userRoutes)
app.use("/song_upload", song_uploadRoutes)

const PORT = process.env.PORT || 3020

app.listen(PORT, () => console.log(`Server started on port ${PORT}! :P`))