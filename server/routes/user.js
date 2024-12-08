const express = require('express')
const user = require("../models/user")
const router = express.Router()

router
.get('/', (req, res) => {
    try {
        const users = user.getUsers()
        console.log((users))
        res.send(users)
    } catch (err) {
        res.status(401).send({message: err.message})
    }
})

.post('/login', async (req, res) => {
    try {
      let User = await user.login(req.body)
      res.send({...User, Password: undefined})
    } catch(err) {
      res.status(401).send({message: err.message})
    }
  })
  
.post('/register', async(req, res) => {
try {
    let User = await user.register(req.body)
    res.send({...User, Password: undefined})
} catch(err) {
    res.status(401).send({message: err.message})
}
})

module.exports = router